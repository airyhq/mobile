import {Contact} from './Contact';
import {Message} from './Message';
import {Metadata} from './Metadata';
import {Channel} from './Channel';
import {Results} from 'realm';
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
  properties: {
    id: 'string',
    channel: 'string?',
    metadata: 'string?',
    createdAt: 'string?',
    lastMessage: 'string?',
  },
};

export interface Conversation {
  id: string;
  channel: Channel;
  metadata: ConversationMetadata;
  createdAt: Date;
  lastMessage: Message;
}

export const getConversations = (): Conversation | undefined => {
  const objects: Results<Conversation> =
    RealmDB.getInstance()?.objects('Conversation');
  if (objects) return objects[0];
};
