import React, {useState, useEffect, useCallback} from 'react';
import {HttpClientInstance} from '../InitializeAiryApi';
import {Metadata} from '../model/Metadata';
import {Conversation, parseToRealmConversation} from '../model/Conversation';
import {Message, MessageData, parseToRealmMessage} from '../model/Message';
import {RealmDB} from '../storage/realm';
import {WebSocketClient} from './WebsocketClient/WebsocketClient';
import {mergeMessages} from '../services/message';

type AiryWebSocketProps = {
  children: React.ReactNode;
};

export const AiryWebSocketContext = React.createContext({});
const realm = RealmDB.getInstance();

export const AiryWebSocket = (props: AiryWebSocketProps) => {
  const {children} = props;
  const [webSocketClient, setWebSocketClient] =
    useState<WebSocketClient | null>(null);

  const refreshSocket = useCallback(() => {
    const addMessage = (conversationId: string, message: Message) => {
      realm.write(() => {
        const currentConversation: Conversation | undefined =
          realm.objectForPrimaryKey<Conversation>(
            'Conversation',
            conversationId,
          );
        const currentMessageData: MessageData =
          realm.objectForPrimaryKey<MessageData>('MessageData', conversationId);

        if (currentConversation) {
          currentConversation.lastMessage = parseToRealmMessage(
            message,
            currentConversation.channel.source,
          );
          currentMessageData.messages = mergeMessages(
            currentMessageData.messages,
            [message],
          );
        }
      });
    };

    const getInfoNewConversation = (
      conversationId: string,
      retries: number,
    ) => {
      if (retries > 5) {
        return Promise.reject(true);
      }
      HttpClientInstance.getConversationInfo(conversationId)
        .then((response: any) => {
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
          currentConversation.metadata.unreadCount =
            metadata.metadata.unread_count;
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

    if (webSocketClient) {
      webSocketClient.destroyConnection();
    }
    setWebSocketClient(
      new WebSocketClient('airy.core', {
        onMessage: (
          conversationId: string,
          _channelId: string,
          message: Message,
        ) => {
          onMessage(conversationId, message);
        },
        onMetadata: (metadata: Metadata) => {
          onMetadata(metadata);
        },
      }),
    );
  }, [webSocketClient]);

  useEffect(() => refreshSocket(), [refreshSocket]);

  return (
    <AiryWebSocketContext.Provider value={{refreshSocket}}>
      {children}
    </AiryWebSocketContext.Provider>
  );
};
