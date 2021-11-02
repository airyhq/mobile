import {RealmDB} from '../storage/realm';
import {api} from '../api';
import {Conversation, Message, MessageData} from '../Model';
import { mergeMessages } from '../services/message';

declare type PaginatedResponse<T> = typeof import('@airyhq/http-client');

export const sendMessage = (conversationId: string, message: any) => {
  api
    .sendMessages({
      conversationId,
      message,
    })
    .then((response: Message) => {
      const realm = RealmDB.getInstance();
      realm.write(() => {
        realm.create('Message', {
          id: response.id,
          content: {text: response.content.text},
          deliveryState: response.deliveryState,
          fromContact: response.fromContact,
          sentAt: response.sentAt,
          metadata: response.metadata,
        });
      });
    })
    .catch((error: Error) => {
      console.error('Error: ', error);
    });
};

export const loadMessagesForConversation = (conversationId: string) => {


  console.log('LOAD MESSAGES');
  
  const realm = RealmDB.getInstance();

  const currentConversationData: (MessageData & Realm.Object) | undefined =
    realm.objectForPrimaryKey<MessageData>('MessageData', conversationId);

  const currentConversation: Conversation | undefined =
    realm.objectForPrimaryKey<Conversation>('Conversation', conversationId);

  api
    .listMessages({conversationId, pageSize: 50})
    .then((response: PaginatedResponse<Message>) => {
      if (currentConversationData) {
        realm.write(() => {
          currentConversationData.messages = [
            ...mergeMessages(currentConversationData.messages, [...response.data]),
          ];
        });
      } else {
        realm.write(() => {
          realm.create('MessageData', {
            id: conversationId,
            messages: mergeMessages([], [...response.data]),
          });
        });
      }

      if (response.paginationData) {
        realm.write(() => {
          currentConversation.paginationData.loading =
            response.paginationData?.loading ?? null;
          currentConversation.paginationData.nextCursor =
            response.paginationData?.nextCursor ?? null;
          currentConversation.paginationData.previousCursor =
            response.paginationData?.previousCursor ?? null;
          currentConversation.paginationData.total =
            response.paginationData?.total ?? null;
        });
      }
    });
};