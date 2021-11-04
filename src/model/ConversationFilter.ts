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
  return !filterQuery.length ? undefined : filterQuery.join(' AND ');
};

export const isFilterReadOnly = (filter: ConversationFilter): boolean => {
  return filter?.readOnly === true && filter?.unreadOnly === false;
};

export const isFilterUnreadOnly = (filter: ConversationFilter): boolean => {
  return filter?.readOnly === false && filter?.unreadOnly === true;
};

export const isFilterReadUnreadUndefined = (
  filter: ConversationFilter,
): boolean => {
  return (
    (filter?.readOnly === undefined || filter?.readOnly === false) &&
    (filter.unreadOnly === undefined || filter.unreadOnly === false)
  );
};

export const isFilterStateClose = (filter: ConversationFilter): boolean => {
  return filter?.isStateOpen === false;
};

export const isFilterStateOpen = (filter: ConversationFilter): boolean => {
  return filter?.isStateOpen === true;
};

export const isFilterStateUndefined = (filter: ConversationFilter): boolean => {
  return filter?.isStateOpen === undefined;
};

export const getDisplayNameForRealmFilter = (
  filter: ConversationFilter,
): string => {
  return filter?.displayName || '';
};

export const getStateForRealmFilter = (filter: ConversationFilter): string => {
  if (filter?.isStateOpen === true) {
    return 'OPEN';
  }
  if (filter?.isStateOpen === false) {
    return 'CLOSED';
  }
  return '*';
};
