import React from 'react';
import {HttpClientInstance} from '../../InitializeAiryApi';
import {
  ConversationFilter,
  filterToLuceneSyntax,
} from '../../model/ConversationFilter';
import {RealmDB} from '../../storage/realm';
import {delay} from 'lodash';

export const fetchFilteredConversations = (cursor?: string) => {
  const realm = RealmDB.getInstance();
  const currentFilter =
    realm.objects<ConversationFilter>('ConversationFilter')[0];

  const filterApplied =
    currentFilter?.displayName !== '' ||
    currentFilter?.byChannels.length > 0 ||
    currentFilter?.isStateOpen !== null ||
    currentFilter?.readOnly !== null ||
    currentFilter?.unreadOnly !== null;

  if (!filterApplied) {
    // delay(() => {
    return HttpClientInstance.listConversations({
      page_size: 50,
      cursor,
      filters: 'display_name:*Michael',
      // filters: filterToLuceneSyntax(currentFilter),
    }).then((response: any) => {
      console.log('231293120-93120-93120-123');

      console.log('RESPONSE: ', response.data);
    });
  }
};

// const fetchFilteredConversations = (dispatch: Dispatch<any>, state: () => StateModel, cursor?: string) => {
//   dispatch(loadingConversationsAction(true));
//   const filter = state().data.conversations.filtered.currentFilter;
//   if (Object.keys(filter).length > 0) {
//     delay(() => {
//       if (isEqual(filter, state().data.conversations.filtered.currentFilter)) {
//         return HttpClientInstance.listConversations({
//           page_size: 50,
//           cursor,
//           filters: filterToLuceneSyntax(filter),
//         }).then((response: PaginatedResponse<Conversation>) => {
//           if (isEqual(filter, state().data.conversations.filtered.currentFilter)) {
//             if (cursor) {
//               dispatch(mergeFilteredConversationsAction(response.data, filter, response.paginationData));
//             } else {
//               dispatch(setFilteredConversationsAction(response.data, filter, response.paginationData));
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
// };
