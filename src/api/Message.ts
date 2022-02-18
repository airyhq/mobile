import {RealmDB} from '../storage/realm';
import {api} from '../api';
import {Conversation, Message} from '../Model';
import {mergeMessages} from '../services/message';

declare type PaginatedResponse<T> = typeof import('@airyhq/http-client');

const realm = RealmDB.getInstance();

export const sendMessage = (conversationId: string, message: any) => {
  api
    .sendMessages({
      conversationId,
      message,
    })
    .then((response: Message) => {
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

export const loadMessagesForConversation = (
  conversationId: string,
  cursor?: string,
  onResponse?: () => void,
) => {
  const currentConversationData: (Conversation & Realm.Object) | undefined =
    realm.objectForPrimaryKey<Conversation>('Conversation', conversationId);

  const currentConversation: Conversation | undefined =
    realm.objectForPrimaryKey<Conversation>('Conversation', conversationId);

  api
    .listMessages({
      conversationId,
      pageSize: 50,
      ...(cursor && {cursor: cursor}),
    })
    .then((response: PaginatedResponse<Message>) => {
      if (currentConversationData) {
        realm.write(() => {
          currentConversationData.messages = [
            ...mergeMessages(currentConversationData.messages, [
              ...response.data,
            ]),
          ];
        });
      } else {
        realm.write(() => {
          realm.create('Conversation', {
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
      if (onResponse) {
        onResponse();
      }
    });
};
