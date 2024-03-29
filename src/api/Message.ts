import {RealmDB} from '../storage/realm';
import {api} from '../api';
import {Conversation, Message} from '../Model';
import {mergeMessages} from '../services/message';
import {UserInfo} from '../model/userInfo';
import {Platform} from 'react-native';

declare type PaginatedResponse<T> = typeof import('@airyhq/http-client');

const realm = RealmDB.getInstance();

export const sendMessage = (conversationId: string, message: any) => {
  return new Promise((resolve, reject) => {
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
          resolve('resolve');
        });
      })
      .catch((error: Error) => {
        console.error('Error: ', error);
        reject('reject');
      });
  });
};

export const resendFailedStateMessage = async (messageId: string) => {
  try {
    await api.resendMessage({messageId});
  } catch (error) {
    console.error('Error: ', error);
  }
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

  return new Promise((resolve, reject) => {
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
        resolve('resolve');
      })
      .catch((error: Error) => {
        console.error(error);
        reject('reject');
      });
  });
};

export const uploadMedia = (file: any) => {
  const host = RealmDB.getInstance().objects<UserInfo>('UserInfo')[0].host;
  const formData = new FormData();
  formData.append('file', {
    ...file,
    uri: Platform.OS === 'ios' ? file.path : 'file://' + file.path,
    type: 'audio/aac',
  });

  return fetch(`${host}/media.upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  })
    .then(res => res.json())
    .then(response => {
      return response.media_url;
    })
    .catch((err: Error) => {
      console.error(err);
    });
};
