import React from 'react';
import {
  filterToLuceneSyntax,
  Conversation,
  ConversationFilter,
  FilteredConversation,
  Pagination,
} from '../model';
import {RealmDB, upsertConversations} from '../storage/realm';
import {api} from '../api';

const realm = RealmDB.getInstance();

export const listConversations = (
  appliedFilters: boolean,
  currentFilter: ConversationFilter,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  conversations: Conversation[],
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
) => {
  api
    .listConversations({
      page_size: 50,
      filters: appliedFilters ? filterToLuceneSyntax(currentFilter) : null,
    })
    .then((response: any) => {
     // console.log('listConv');
      setLoading(false);

      // for (let i = 0; i < response.data.length; i++) {
      //   console.log(
      //     'listConversations - responseDATA',
      //     response.data[i].metadata.contact.displayName,
      //   );
      // }

      setConversations([...response.data]);

      realm.write(() => {
        realm.create('Pagination', response.paginationData);
      });

      if (conversations.length === 0) {
        setConversations([...response.data]);
        upsertConversations(response.data, realm);
      } else {
        upsertConversations(response.data, realm);
      }
    })
    .catch((error: Error) => {
      console.error(error);
    });
};

export const getNextConversationList = (
  cursor: string,
  appliedFilters: boolean,
  currentFilter: ConversationFilter,
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
) => {
  api
    .listConversations({
      cursor: cursor,
      page_size: 50,
      filters: appliedFilters ? filterToLuceneSyntax(currentFilter) : null,
    })
    .then((response: any) => {

      console.log('getNext response');
      // for (let i = 0; i < response.data.length; i++) {
      //   console.log(
      //     'listNextConversations - responseDATA',
      //     response.data[i].metadata.contact.displayName,
      //   );
      // }

      setConversations(prevConversations => {
        // for (let i = 0; i < prevConversations.length; i++) {
        //   console.log(
        //     'listNextConversations - prevConversations',
        //     prevConversations[i].metadata.contact.displayName,
        //   );
        // }

        return [...prevConversations, ...response.data];
      });

      upsertConversations(response.data, realm);

      if (appliedFilters) {
        const pagination: Pagination | undefined =
            realm.objects<Pagination>('FilterConversationPagination')[0];

            console.log('pagination - appliedFilter', pagination);

          if(!pagination){
            realm.write(() => {
              realm.create('FilterConversationPagination', response.paginationData);
            });
          } else {
            realm.write(() => {
            pagination.previousCursor = response.paginationData.previousCursor;
            pagination.nextCursor = response.paginationData.nextCursor;
            pagination.total = response.paginationData.total;
            console.log('update pagination.nextCursor', pagination.nextCursor);
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
