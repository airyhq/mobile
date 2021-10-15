import React, {useCallback, useEffect, useState} from 'react';
import {
  Metadata,
  Conversation,
  parseToRealmConversation,
  Message,
  MessageData,
  parseToRealmMessage,
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
    const currentMessageData: MessageData =
      realm.objectForPrimaryKey<MessageData>('MessageData', conversationId);

    if (currentConversation) {
      currentConversation.lastMessage = parseToRealmMessage(
        message,
        currentConversation.channel.source,
      );

      if (currentMessageData && currentMessageData.messages) {
        currentMessageData.messages = mergeMessages(
          currentMessageData.messages,
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
      realm.write(() => {
        realm.create('Conversation', parseToRealmConversation(response));
        realm.create('MessageData', {id: conversationId, messages: []});
      });
    })
    .catch(() => {
      setTimeout(() => {
        getInfoNewConversation(conversationId, retries ? retries + 1 : 1);
      }, 1000);
    });
};

const onMetadata = (metadata: Metadata) => {
  const currentConversation: Conversation | undefined =
    realm.objectForPrimaryKey<Conversation>(
      'Conversation',
      metadata.identifier,
    );

  if (
    currentConversation &&
    typeof metadata.metadata.unread_count === 'number'
  ) {
    realm.write(() => {
      currentConversation.metadata.unreadCount = metadata.metadata.unread_count;
    });
  }
  if (currentConversation && metadata?.metadata?.contact?.display_name) {
    realm.write(() => {
      currentConversation.metadata.contact.displayName =
        metadata?.metadata?.contact?.display_name;
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
