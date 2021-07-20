import {Content} from './Content';
export interface SuggestedReply {
  content: Content;
}
export interface Suggestions {
  [suggestionId: string]: SuggestedReply;
}

export const SuggestedReplySchema = {
  name: 'SuggestedReply',
  properties: {
    content: 'Content',
  },
};

export const SuggestionsSchema = {
  name: 'Suggestions',
  properties: {
    
  },
};