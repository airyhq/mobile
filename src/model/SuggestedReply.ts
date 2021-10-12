import {TextContent} from './Content';
export interface SuggestedReply {
  content: TextContent;
}
export interface Suggestions {
  [suggestionId: string]: SuggestedReply;
}

export const SuggestedReplySchema = {
  name: 'SuggestedReply',
  properties: {
    content: 'TextContent',
  },
};

export const SuggestionsSchema = {
  name: 'Suggestions',
  properties: {},
};
