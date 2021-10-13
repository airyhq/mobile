import {Source} from './Channel';
import {RichCard} from './templates';
import {Suggestions} from './SuggestedReply';
import {RichCardCarousel} from './templates/RichCardCarousel';

export type ContentMessage = {
  type: string;
  text?: string;
  richCard?: RichCard;
  richCardCarousel?: RichCardCarousel;
};

export const ContentMessageSchema = {
  name: 'ContentMessage',
  properties: {
    type: 'string',
    text: 'string?',
    richCard: 'RichCard?',
    richCardCarousel: 'RichCardCarousel?',
  },
};

export enum MessageType {
  audio = 'audio',
  file = 'file',
  image = 'image',
  text = 'text',
  video = 'video',
}

export enum DeliveryState {
  pending = 'PENDING',
  failed = 'FAILED',
  delivered = 'DELIVERED',
}

export interface MessageMetadata {
  suggestions?: Suggestions;
}
export interface Message {
  id: string;
  content: ContentMessage;
  deliveryState: DeliveryState;
  fromContact: boolean;
  sentAt: Date;
  metadata?: MessageMetadata;
  source?: string;
}

export type MessageData = {
  id: string;
  messages: Message[];
};

export const parseToRealmMessage = (
  unformattedMessage: any,
  source: string,
): Message => {
  let messageContent =
    unformattedMessage.content?.Body ??
    unformattedMessage.content?.text ??
    unformattedMessage.content?.message?.text ??
    unformattedMessage.content?.postback?.title ??
    unformattedMessage.content;

  if (
    source === Source.chatplugin &&
    messageContent.richCard &&
    !messageContent.richCard?.carouselCard
  ) {
    return {
      id: unformattedMessage.id,
      content: {
        type: 'RichCard',
        richCard: {...messageContent.richCard},
      },
      deliveryState: unformattedMessage.deliveryState,
      fromContact: unformattedMessage.fromContact,
      sentAt: unformattedMessage.sentAt,
      metadata: unformattedMessage.metadata,
    };
  }

  if (
    source === Source.chatplugin &&
    messageContent.richCard &&
    messageContent.richCard?.carouselCard
  ) {
    console.log('carouselCard', messageContent.richCard?.carouselCard);
    return {
      id: unformattedMessage.id,
      content: {
        type: 'RichCardCarousel',
        richCardCarousel: {...messageContent.richCard},
      },
      deliveryState: unformattedMessage.deliveryState,
      fromContact: unformattedMessage.fromContact,
      sentAt: unformattedMessage.sentAt,
      metadata: unformattedMessage.metadata,
    };
  }

  if (typeof messageContent === 'object') {
    messageContent = JSON.stringify(messageContent);
  }

  if (source === Source.facebook) {
    return {
      id: unformattedMessage.id,
      content: {
        type: 'text',
        text: messageContent,
      },
      deliveryState: unformattedMessage.deliveryState,
      fromContact: unformattedMessage.fromContact,
      sentAt: unformattedMessage.sentAt,
      metadata: unformattedMessage.metadata,
    };
  }

  if (source === Source.google) {
    return {
      id: unformattedMessage.id,
      content: {
        type: 'text',
        text: messageContent,
      },
      deliveryState: unformattedMessage.deliveryState,
      fromContact: unformattedMessage.fromContact,
      sentAt: unformattedMessage.sentAt,
      metadata: unformattedMessage.metadata,
    };
  }

  if (source === Source.chatplugin && !messageContent.richCard) {
    return {
      id: unformattedMessage.id,
      content: {
        type: 'text',
        text: messageContent,
      },
      deliveryState: unformattedMessage.deliveryState,
      fromContact: unformattedMessage.fromContact,
      sentAt: unformattedMessage.sentAt,
      metadata: unformattedMessage.metadata,
    };
  }

  if (source === Source.twilioSms) {
    return {
      id: unformattedMessage.id,
      content: {
        type: 'text',
        text: messageContent,
      },
      deliveryState: unformattedMessage.deliveryState,
      fromContact: unformattedMessage.fromContact,
      sentAt: unformattedMessage.sentAt,
      metadata: unformattedMessage.metadata,
    };
  }

  if (source === Source.twilioWhatsapp) {
    return {
      id: unformattedMessage.id,
      content: {
        type: 'text',
        text: messageContent,
      },
      deliveryState: unformattedMessage.deliveryState,
      fromContact: unformattedMessage.fromContact,
      sentAt: unformattedMessage.sentAt,
      metadata: unformattedMessage.metadata,
    };
  }

  if (source === Source.instagram) {
    return {
      id: unformattedMessage.id,
      content: {
        type: 'text',
        text: messageContent,
      },
      deliveryState: unformattedMessage.deliveryState,
      fromContact: unformattedMessage.fromContact,
      sentAt: unformattedMessage.sentAt,
      metadata: unformattedMessage.metadata,
    };
  }

  if (source === Source.viber) {
    return {
      id: unformattedMessage.id,
      content: {
        type: 'text',
        text: messageContent,
      },
      deliveryState: unformattedMessage.deliveryState,
      fromContact: unformattedMessage.fromContact,
      sentAt: unformattedMessage.sentAt,
      metadata: unformattedMessage.metadata,
    };
  }

  return {
    id: unformattedMessage.id,
    content: {
      type: 'text',
      text: messageContent,
    },
    deliveryState: unformattedMessage.deliveryState,
    fromContact: unformattedMessage.fromContact,
    sentAt: unformattedMessage.sentAt,
    metadata: unformattedMessage.metadata,
  };
};

export const MessageSchema = {
  name: 'Message',
  properties: {
    id: 'string',
    content: 'ContentMessage',
    deliveryState: 'string',
    fromContact: 'bool',
    sentAt: 'date',
    metadata: 'MessageMetadata?',
  },
};

export const MessageDataSchema = {
  name: 'MessageData',
  primaryKey: 'id',
  properties: {
    id: 'string',
    messages: {type: 'list', objectType: 'Message'},
  },
};

export const MessageTypeSchema = {
  name: 'MessageType',
  properties: {
    audio: 'string',
    file: 'string',
    image: 'string',
    text: 'string',
    video: 'string',
  },
};

export const MessageMetadataSchema = {
  name: 'MessageMetadata',
  properties: {
    suggestions: 'Suggestions',
  },
};
