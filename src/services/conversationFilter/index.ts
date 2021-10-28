import {ConversationFilter} from '../../model';

export const displayNameFilterActive = (currentFilter: ConversationFilter) => {
  if (currentFilter !== undefined) {
    if (currentFilter.displayName !== '') {
      return true;
    } else {
      return false;
    }
  }
};

export const readOnlyFilterActive = (currentFilter: ConversationFilter) => {
  if (currentFilter !== undefined) {
    if (currentFilter.readOnly !== null) {
      return true;
    } else {
      return false;
    }
  }
};

export const unreadOnlyFilterActive = (currentFilter: ConversationFilter) => {
  if (currentFilter !== undefined) {
    if (currentFilter.unreadOnly !== null) {
      return true;
    } else {
      return false;
    }
  }
};

export const isStateOpenFilterActive = (currentFilter: ConversationFilter) => {
  if (currentFilter !== undefined) {
    if (currentFilter.isStateOpen !== null) {
      return true;
    } else {
      return false;
    }
  }
};

export const byChannelsFilterActive = (currentFilter: ConversationFilter) => {
  if (currentFilter !== undefined) {
    if (currentFilter.byChannels.length > 0) {
      return true;
    } else {
      return false;
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
    } else {
      return false;
    }
  }
};
