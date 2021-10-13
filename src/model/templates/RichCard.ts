import {ContentMessage} from '../Message';

export interface RichCard {
  standaloneCard: {
    cardContent: {
      title: string;
      description: string;
      media: {
        height: string;
        contentInfo: {
          altText: string;
          fileUrl: string;
          forceRefresh: boolean;
        };
      };
      suggestions: [
        {
          reply: {
            text: string;
            postbackData: string;
          };
        },
        {
          reply?: {
            text?: string;
            postbackData?: string;
          };
        },
      ];
    };
  };
}

export interface RichCardContent extends ContentMessage {
  richCard: RichCard;
}

//RichCard Schema
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
  },
};

export const RichCardReplySchema = {
  name: 'RichCardReply',
  properties: {
    text: 'string?',
    postbackData: 'string?',
  },
};
