import React, {useCallback, useEffect, useState} from 'react';
import {Metadata, Conversation, Message} from '../model';
import {RealmDB} from '../storage/realm';
import {WebSocketClient} from './WebsocketClient/WebsocketClient';
import {AuthContext} from './auth/AuthWrapper';
import {UserInfo} from '../model/userInfo';
import {addMessageToConversation} from '../services';
import {getInfoNewConversation} from '../api/Conversation';

type WebSocketProps = {
  children: React.ReactNode;
  user: UserInfo;
};

const realm = RealmDB.getInstance();

const onMetadata = (metadataObj: Metadata) => {
  const currentConversation: Conversation | undefined =
    realm.objectForPrimaryKey<Conversation>(
      'Conversation',
      metadataObj.identifier,
    );

  const {metadata} = metadataObj;

  if (currentConversation && metadata?.state) {
    realm.write(() => {
      currentConversation.metadata.state = metadata.state;
    });
  }

  if (currentConversation && typeof metadata.unread_count === 'number') {
    realm.write(() => {
      currentConversation.metadata.unreadCount = metadata.unread_count;
    });
  }

  if (currentConversation && typeof metadata.unread_count === 'number') {
    realm.write(() => {
      currentConversation.metadata.unreadCount = metadata.unread_count;
    });
  }
  if (currentConversation && metadata?.contact?.display_name) {
    realm.write(() => {
      currentConversation.metadata.contact.displayName =
        metadata.contact.display_name;
    });
  }
};

const onMessage = (conversationId: string, message: Message) => {
  const isStored = realm.objectForPrimaryKey<Conversation>(
    'Conversation',
    conversationId,
  );
  if (isStored) {
    addMessageToConversation(conversationId, message);
  } else {
    getInfoNewConversation(conversationId, 0);
  }
};

const WebSocketComponent = ({children, user}: WebSocketProps) => {
  let [webSocketClient, setWebsocketClient] = useState(null);

  const refreshSocket = useCallback(() => {
    if (webSocketClient) {
      webSocketClient.destroyConnection();
    }

    setWebsocketClient(
      new WebSocketClient(user.host, user.token, {
        onMessage: (
          conversationId: string,
          _channelId: string,
          message: Message,
        ) => {
          onMessage(conversationId, message);
        },
        onMetadata,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => refreshSocket(), [refreshSocket]);

  return <>{children}</>;
};

export const WebSocket = ({children}) => (
  <AuthContext.Consumer>
    {({user}) => (
      <WebSocketComponent user={user}>{children}</WebSocketComponent>
    )}
  </AuthContext.Consumer>
);
