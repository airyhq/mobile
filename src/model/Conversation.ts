import {Contact} from './Contact';
import {Message} from './Message';
import {Metadata} from './Metadata';
import {Channel} from './Channel';
import {Pagination} from './Pagination';
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
    paginationData: 'Pagination',
    messages: {type: 'list', objectType: 'Message'},
    filtered: 'bool',
  },
};

export interface Conversation {
  id: string;
  channel: Channel;
  metadata: Metadata;
  createdAt: Date;
  lastMessage: Message;
  paginationData: Pagination;
  messages: Message[];
  filtered: boolean;
}

export const parseToRealmConversation = (
  unformattedConversation: Conversation,
  isFiltered: boolean,
): Conversation => {
  let conversation: Conversation;
  conversation = {
    id: unformattedConversation.id,
    channel: unformattedConversation.channel,
    metadata: unformattedConversation.metadata,
    createdAt: unformattedConversation.createdAt,
    lastMessage: parseToRealmMessage(
      unformattedConversation.lastMessage,
      unformattedConversation.channel.source,
    ),
    paginationData: {
      loading: null,
      previousCursor: null,
      nextCursor: null,
      total: null,
    },
    messages: unformattedConversation?.messages || [],
    filtered: isFiltered,
  };

  return conversation;
};
