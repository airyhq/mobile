import React from 'react';
import {HttpClientInstance} from '../../InitializeAiryApi';
import {
  ConversationFilter,
  filterToLuceneSyntax,
} from '../../model/ConversationFilter';
import {RealmDB} from '../../storage/realm';

export const fetchFilteredConversations = (cursor?: string) => {
  const realm = RealmDB.getInstance();
  const filter = realm.objects<ConversationFilter>('ConversationFilter');
  console.log('FILTERS: ', filter);

  //   if (filter.length > 0) {
  //     delay(() => {
  //       if (isEqual(filter, state().data.conversations.filtered.currentFilter)) {
  //         return HttpClientInstance.listConversations({
  //           page_size: 50,
  //           cursor,
  //           filters: filterToLuceneSyntax(filter),
  //         }).then((response: PaginatedResponse<Conversation>) => {
  //           if (
  //             isEqual(filter, state().data.conversations.filtered.currentFilter)
  //           ) {
  //             if (cursor) {
  //               dispatch(
  //                 mergeFilteredConversationsAction(
  //                   response.data,
  //                   filter,
  //                   response.paginationData,
  //                 ),
  //               );
  //             } else {
  //               dispatch(
  //                 setFilteredConversationsAction(
  //                   response.data,
  //                   filter,
  //                   response.paginationData,
  //                 ),
  //               );
  //             }
  //             return Promise.resolve(true);
  //           }
  //         });
  //       }
  //       dispatch(loadingConversationsAction(false));
  //     }, 100);
  //   } else {
  //     dispatch(resetFilteredConversationAction());
  //     dispatch(loadingConversationsAction(false));
  //   }
};
