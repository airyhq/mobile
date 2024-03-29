import React from 'react';
import {
  filterToLuceneSyntax,
  Conversation,
  ConversationFilter,
  Pagination,
  Channel,
  parseToRealmConversation,
} from '../model';
import {
  RealmDB,
  upsertConversations,
  upsertFilteredConversations,
} from '../storage/realm';
import {api} from '../api';
import {PaginatedResponse} from '@airyhq/http-client';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { hapticFeedbackOptions } from '../services/hapticFeedbackOptions';

declare type PaginatedResponse<T> = typeof import('@airyhq/http-client');

const realm = RealmDB.getInstance();

export const listConversations = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setAllConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
) => {
  api
    .listConversations({
      page_size: 100,
    })
    .then((response: PaginatedResponse<Conversation>) => {
      setLoading(false);

      setAllConversations([...response.data]);

      realm.write(() => {
        realm.create('Pagination', response.paginationData);
      });

      upsertConversations(response.data, realm);
    })
    .catch((error: Error) => {
      console.error(error);
    });
};

export const listPreviousConversations = (
  cursor: string,
  setAllConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  api
    .listConversations({
      cursor: cursor,
      page_size: 10,
      filters: null,
    })
    .then((response: PaginatedResponse<Conversation>) => {
      setLoading(false);

      setAllConversations(prevConversations => [
        ...prevConversations,
        ...response.data,
      ]);

      if (realm.isInTransaction) {
        realm.cancelTransaction();
      }

      upsertConversations(response.data, realm);

      const pagination: Pagination | undefined =
        realm.objects<Pagination>('Pagination')[0];

      realm.write(() => {
        pagination.previousCursor = response.paginationData.previousCursor;
        pagination.nextCursor = response.paginationData.nextCursor;
        pagination.total = response.paginationData.total;
      });
    })
    .catch((error: Error) => {
      console.error(error);
    });
};

export const listPreviousFilteredConversations = (
  cursor: string,
  currentFilter: ConversationFilter,
  allConversations: Conversation[],
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  api
    .listConversations({
      cursor: cursor,
      page_size: 10,
      filters: filterToLuceneSyntax(currentFilter),
    })
    .then((response: PaginatedResponse<Conversation>) => {
      setLoading(false);

      if (realm.isInTransaction) {
        realm.cancelTransaction();
      }

      upsertFilteredConversations(response.data, realm, allConversations);

      const filteredConversationPagination: Pagination | undefined =
        realm.objects<Pagination>('FilterConversationPagination')[0];

      if (!filteredConversationPagination) {
        realm.write(() => {
          realm.create('FilterConversationPagination', response.paginationData);
        });
      } else {
        realm.write(() => {
          filteredConversationPagination.previousCursor =
            response.paginationData.previousCursor;
          filteredConversationPagination.nextCursor =
            response.paginationData.nextCursor;
          filteredConversationPagination.total = response.paginationData.total;
        });
      }
    })
    .catch((error: Error) => {
      console.error(error);
    });
};

export const getInfoNewConversation = (
  conversationId: string,
  retries: number,
): Promise<Conversation> => {
  return new Promise((resolve, reject) => {
    const getConversation = (_conversationId: string, _retries: number) => {
      if (_retries > 10) {
        reject('Getting new conversation exceeded maximum of 10 retries.');
      } else {
        api
          .getConversationInfo(_conversationId)
          .then((response: Conversation) => {
            const currentConversationData:
              | (Conversation & Realm.Object)
              | undefined = RealmDB.getInstance().objectForPrimaryKey<Conversation>(
              'Conversation',
              _conversationId,
            );
            if (currentConversationData) {
              resolve(currentConversationData);
            } else {
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
              realm.write(() => {
                const conversation: Conversation = realm.create(
                  'Conversation',
                  {
                    ...newConversation,
                    channel: channel || newConversation.channel,
                    metadata: {
                      ...newConversation.metadata,
                      state: newConversation.metadata.state || 'OPEN',
                    },
                  },
                );
                resolve(conversation);
              });
            }
          })
          .catch(() => {
            setTimeout(() => {
              getConversation(_conversationId, _retries + 1);
            }, 1000);
          });
      }
    };
    getConversation(conversationId, retries);
  });
};

export const changeConversationState = (
  currentConversationState: string,
  conversationId: string,
  setState?: (newState: string) => void,
) => {
  const newState = currentConversationState === 'OPEN' ? 'CLOSED' : 'OPEN';
  api
    .setStateConversation({
      conversationId: conversationId,
      state: newState,
    })
    .then(() => {
      realm.write(() => {
        const changedConversation: Conversation | undefined =
          realm.objectForPrimaryKey('Conversation', conversationId);

        if (changedConversation?.metadata?.state) {
          changedConversation.metadata.state = newState;
        }
      });
    });
  setState && setState(newState);
  ReactNativeHapticFeedback.trigger('impactHeavy', hapticFeedbackOptions);
};
