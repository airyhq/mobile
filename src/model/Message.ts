import {Channel} from '.';
import {Content} from './Content';
import {Suggestions} from './SuggestedReply';

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
  content: Content;
  deliveryState: DeliveryState;
  fromContact: boolean;
  sentAt: Date;
  metadata?: MessageMetadata;
}

export type MessageData = {
  id: string;
  messages: Message[]
}


export const parseToRealmMessage = (
  unformattedMessage: any,
  channel: Channel,
): Message => {
  let message: Message;

  const messageContent = unformattedMessage.content?.text ?? unformattedMessage.content?.message?.text ?? unformattedMessage.content


  switch (channel.source) {
    case 'facebook':
      message = {
        id: unformattedMessage.id,
        content: {
          text: messageContent,
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
      break;
    case 'google':
      message = {
        id: unformattedMessage.id,
        content: {
          text: messageContent,
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
      break;
    case 'chatplugin':
      message = {
        id: unformattedMessage.id,
        content: {
          text: messageContent,
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
      break;
    case 'twilio.sms':
      message = {
        id: unformattedMessage.id,
        content: {
          text: messageContent,
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
      break;
    case 'twilio.whatsapp':
      message = {
        id: unformattedMessage.id,
        content: {
          text: messageContent,
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
      break;
    case 'instagram':
      message = {
        id: unformattedMessage.id,
        content: {
          text: unformattedMessage.content.postback.title,
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
      break;
    default:
      message = {
        id: unformattedMessage.id,
        content: {
          text: messageContent,
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
      break;
  }
  return message;
};

export const MessageSchema = {
  name: 'Message',
  properties: {
    id: 'string',
    content: 'Content',
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
  messages: { type: 'list', objectType: 'Message' },
  }
}

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
