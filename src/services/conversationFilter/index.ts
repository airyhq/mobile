import {ConversationFilter} from '../../model';

export const displayNameFilterActive = (currentFilter: ConversationFilter) => {
  if (currentFilter !== undefined) {
    if (currentFilter.displayName !== '') {
      return true;
    }
  }
};

export const readOnlyFilterActive = (currentFilter: ConversationFilter) => {
  if (currentFilter !== undefined) {
    if (currentFilter.readOnly !== null) {
      return true;
    }
  }
};

export const unreadOnlyFilterActive = (currentFilter: ConversationFilter) => {
  if (currentFilter !== undefined) {
    if (currentFilter.unreadOnly !== null) {
      return true;
    }
  }
};

export const isStateOpenFilterActive = (currentFilter: ConversationFilter) => {
  if (currentFilter !== undefined) {
    if (currentFilter.isStateOpen !== null) {
      return true;
    }
  }
};

export const byChannelsFilterActive = (currentFilter: ConversationFilter) => {
  if (currentFilter !== undefined) {
    if (currentFilter.byChannels.length > 0) {
      return true;
    }
  }
};

export const isFilterActive = (currentFilter: ConversationFilter) => {
  if (currentFilter !== undefined) {
    if (
      displayNameFilterActive(currentFilter) ||
      readOnlyFilterActive(currentFilter) ||
      unreadOnlyFilterActive(currentFilter) ||
      isStateOpenFilterActive(currentFilter) ||
      byChannelsFilterActive(currentFilter)
    ) {
      return true;
    }
  }
};

export const onlyDisplayNameFilterActive = (
  currentFilter: ConversationFilter,
) => {
  if (currentFilter !== undefined) {
    if (
      displayNameFilterActive(currentFilter) &&
      !readOnlyFilterActive(currentFilter) &&
      !unreadOnlyFilterActive(currentFilter) &&
      !byChannelsFilterActive(currentFilter) &&
      !isStateOpenFilterActive(currentFilter)
    ) {
      return true;
    }
  }
};

export const resetConversationFilters = (
  currentFilter: ConversationFilter,
  realm: Realm,
) => {
  if (currentFilter !== undefined) {
    realm.write(() => {
      currentFilter.displayName = '';
      currentFilter.byChannels = [];
      currentFilter.readOnly = null;
      currentFilter.unreadOnly = null;
      currentFilter.isStateOpen = null;
    });
  }
};
