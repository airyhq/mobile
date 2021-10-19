import {Channel} from '.';

export interface ConversationFilter {
  readOnly?: boolean;
  unreadOnly?: boolean;
  displayName?: string;
  byChannels?: Channel[];
  isStateOpen?: boolean;
}

export const ConversationFilterSchema = {
  name: 'ConversationFilter',
  properties: {
    readOnly: 'bool?',
    unreadOnly: 'bool?',
    displayName: 'string?',
    byChannels: {type: 'list', objectType: 'Channel'},
    isStateOpen: 'bool?',
  },
};

export const filterToLuceneSyntax = (
  filter: ConversationFilter,
): string | null => {
  const filterQuery: Array<string> = [];
  if (filter?.unreadOnly) {
    filterQuery.push('unread_count:[1 TO *]');
  } else if (filter?.readOnly) {
    filterQuery.push('unread_count:0');
  }
  if (filter?.displayName) {
    filterQuery.push('display_name:*' + filter.displayName + '*');
  }
  if (filter?.byChannels && filter.byChannels.length > 0) {
    filterQuery.push('channel_id:(' + filter.byChannels.join(' OR ') + ')');    
  }
  if (filter?.isStateOpen === true) {
    filterQuery.push('id:* AND NOT metadata.state:CLOSED');
  } else if (filter?.isStateOpen !== null) {
    filterQuery.push('metadata.state:CLOSED');
  }
  console.log('FILTER QUERY: ', filterQuery);

  return !filterQuery.length ? undefined : filterQuery.join(' AND ');
};
