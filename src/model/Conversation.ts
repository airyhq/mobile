import {Contact} from './Contact';
import {Message} from './Message';
import {Metadata} from './Metadata';
import {Channel} from './Channel';
import {Pagination} from './Pagination';
import {parseToRealmMessage} from './Message';
import {RealmDB} from '../storage/realm';

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
  },
};

export interface Conversation {
  id: string;
  channel: Channel;
  metadata: Metadata;
  createdAt: Date;
  lastMessage: Message;
  paginationData: Pagination;
}

export const FilteredConversationSchema = {
  name: 'FilteredConversation',
  primaryKey: 'id',
  properties: {
    id: 'string',
    channel: 'Channel',
    metadata: 'Metadata',
    createdAt: 'date?',
    lastMessage: 'Message',
    paginationData: 'Pagination',
  },
};

export interface FilteredConversation {
  id: string;
  channel: Channel;
  metadata: Metadata;
  createdAt: Date;
  lastMessage: Message;
  paginationData: Pagination;
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
      unformattedConversation.channel.source,
    ),
    paginationData: {
      loading: null,
      previousCursor: null,
      nextCursor: null,
      total: null,
    },
  };

  return conversation;
};

export const upsertConversations = (conversations: Conversation[], realm: Realm) => {
  conversations.forEach(conversation => {      
    const storedConversation: Conversation | undefined = realm.objectForPrimaryKey('Conversation', conversation.id);
    
    if (storedConversation) {
      realm.write(() => {
        storedConversation.lastMessage = conversation.lastMessage;
        storedConversation.metadata = conversation.metadata;
      })
    } else {      
      const newConversation: Conversation = parseToRealmConversation(conversation);
      const channel: Channel = RealmDB.getInstance().objectForPrimaryKey<Channel>('Channel', conversation.channel.id);
      realm.create(
        'Conversation',
        { ...newConversation,
          channel: channel || newConversation.channel
        }
      );    
      realm.create('MessageData', {
        id: conversation.id,
        messages: [],
      });    
    }   
  });
}
