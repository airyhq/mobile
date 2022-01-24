import React from 'react';
import {
  filterToLuceneSyntax,
  Conversation,
  ConversationFilter,
  Pagination,
} from '../model';
import {
  RealmDB,
  upsertConversations,
  upsertFilteredConversations,
} from '../storage/realm';
import {api} from '../api';
import {PaginatedResponse} from '@airyhq/http-client';

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

export const getNextConversationList = (
  cursor: string,
  appliedFilters: boolean,
  currentFilter: ConversationFilter,
  setAllConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
  allConversations: Conversation[],
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  api
    .listConversations({
      cursor: cursor,
      page_size: 10,
      filters: appliedFilters ? filterToLuceneSyntax(currentFilter) : null,
    })
    .then((response: PaginatedResponse<Conversation>) => {
      setLoading(false);

      if (!appliedFilters) {
        setAllConversations(prevConversations => [
          ...prevConversations,
          ...response.data,
        ]);
      }

      if (realm.isInTransaction) {
        realm.cancelTransaction();
      }

      if (appliedFilters) {
        upsertFilteredConversations(response.data, realm, allConversations);
      } else {
        upsertConversations(response.data, realm);
      }

      if (appliedFilters) {
        const pagination: Pagination | undefined = realm.objects<Pagination>(
          'FilterConversationPagination',
        )[0];

        if (!pagination) {
          realm.write(() => {
            realm.create(
              'FilterConversationPagination',
              response.paginationData,
            );
          });
        } else {
          realm.write(() => {
            pagination.previousCursor = response.paginationData.previousCursor;
            pagination.nextCursor = response.paginationData.nextCursor;
            pagination.total = response.paginationData.total;
          });
        }
      } else {
        realm.write(() => {
          const pagination: Pagination | undefined =
            realm.objects<Pagination>('Pagination')[0];
          pagination.previousCursor = response.paginationData.previousCursor;
          pagination.nextCursor = response.paginationData.nextCursor;
          pagination.total = response.paginationData.total;
        });
      }
    })
    .catch((error: Error) => {
      console.error(error);
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
};
