//RichCard Realm Schema
export const RichCardSchema = {
  name: 'RichCard',
  properties: {
    standaloneCard: 'StandaloneCard',
  },
};

export const StandaloneCardSchema = {
  name: 'StandaloneCard',
  properties: {
    cardContent: 'CardContent',
  },
};

export const CardContentSchema = {
  name: 'CardContent',
  properties: {
    title: 'string?',
    description: 'string?',
    media: 'RichCardMedia?',
    suggestions: 'RichCardSuggestions[]',
  },
};

export const RichCardMediaSchema = {
  name: 'RichCardMedia',
  properties: {
    height: 'string?',
    contentInfo: 'RichCardMediaContentInfo?',
  },
};

export const RichCardMediaContentInfoSchema = {
  name: 'RichCardMediaContentInfo',
  properties: {
    altText: 'string?',
    fileUrl: 'string?',
    forceRefresh: 'bool?',
  },
};

export const RichCardSuggestionsSchema = {
  name: 'RichCardSuggestions',
  properties: {
    reply: 'RichCardReply?',
    action: 'RichCardReply?',
  },
};

export const RichCardReplySchema = {
  name: 'RichCardReply',
  properties: {
    text: 'string?',
    postbackData: 'string?',
  },
};
