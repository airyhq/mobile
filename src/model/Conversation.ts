import {Contact} from './Contact';
import {Message} from './Message';
import {Metadata} from './Metadata';
import {Channel} from './Channel';
import {parseToRealmMessage} from './Message';

export type ConversationMetadata = Metadata & {
  contact: Contact;
  unreadCount: number;
  tags: {
    [tagId: string]: string;
  };
  state: string;
};

export const ConversationSchema = {
  name: 'Conversation',
  primaryKey: 'id',
  properties: {
    id: 'string',
    channel: 'Channel',
    metadata: 'Metadata',
    createdAt: 'date?',
    lastMessage: 'Message',
  },
};

export interface Conversation {
  id: string;
  channel: Channel;
  metadata: Metadata;
  createdAt: Date;
  lastMessage: Message;
}

export const parseToRealmConversation = (
  unformattedConversation: Conversation,
): Conversation => {
  let conversation: Conversation;

  conversation = {
    id: unformattedConversation.id,
    channel: unformattedConversation.channel,
    metadata: unformattedConversation.metadata,
    createdAt: unformattedConversation.createdAt,
    lastMessage: parseToRealmMessage(
      unformattedConversation.lastMessage,
      unformattedConversation.channel,
    ),
  };

  return conversation;
};
