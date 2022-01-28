import React, {useCallback, useEffect, useState} from 'react';
import {
  Metadata,
  Conversation,
  parseToRealmConversation,
  Message,
  parseToRealmMessage,
  Channel,
} from '../model';
import {RealmDB} from '../storage/realm';
import {WebSocketClient} from './WebsocketClient/WebsocketClient';
import {mergeMessages} from '../services/message';
import {api, AuthContext} from './auth/AuthWrapper';
import {UserInfo} from '../model/userInfo';

type WebSocketProps = {
  children: React.ReactNode;
  user: UserInfo;
};

const realm = RealmDB.getInstance();

const addMessage = (conversationId: string, message: Message) => {
  realm.write(() => {
    const currentConversation: Conversation | undefined =
      realm.objectForPrimaryKey<Conversation>('Conversation', conversationId);

    if (currentConversation) {
      currentConversation.lastMessage = parseToRealmMessage(
        message,
        currentConversation.channel.source,
      );

      if (currentConversation && currentConversation.messages) {
        currentConversation.messages = mergeMessages(
          currentConversation.messages,
          [message],
        );
      }
    }
  });
};

const getInfoNewConversation = (conversationId: string, retries: number) => {
  if (retries > 10) {
    console.error('Getting new conversation exceeded maximum of 10 retries.');
    return;
  }
  api
    .getConversationInfo(conversationId)
    .then((response: Conversation) => {
      const isFiltered = false;
      const newConversation: Conversation = parseToRealmConversation(
        response,
        isFiltered,
      );
      const channel: Channel =
        RealmDB.getInstance().objectForPrimaryKey<Channel>(
          'Channel',
          response.channel.id,
        );

      const newConversationState = newConversation.metadata.state || 'OPEN';

      realm.write(() => {
        realm.create('Conversation', {
          ...newConversation,
          channel: channel || newConversation.channel,
          metadata: {
            ...newConversation.metadata,
            state: newConversationState,
          },
        });
      });
    })
    .catch(() => {
      setTimeout(() => {
        getInfoNewConversation(conversationId, retries ? retries + 1 : 1);
      }, 1000);
    });
};

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
    addMessage(conversationId, message);
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
