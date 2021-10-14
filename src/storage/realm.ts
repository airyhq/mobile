import Realm from 'realm';
import {UserInfoSchema} from '../model/userInfo';
import {ConversationSchema, FilteredConversationSchema} from '../model/Conversation';
import {
  ChannelMetadataSchema,
  ChannelSchema,
  ContactSchema,
  ContentSchema,
  MessageMetadataSchema,
  MessageSchema,
  MessageTypeSchema,
  MetadataEventSchema,
  MetadataSchema,
  PaginationSchema,
  SuggestedReplySchema,
  SuggestionsSchema,
  MessageDataSchema,
  ConversationFilterSchema,
} from '../model';

export class RealmDB {
  private static instance: Realm;

  private constructor() {}

  public static getInstance(): Realm {
    if (!RealmDB.instance) {
      RealmDB.instance = new Realm({
        path: 'airyRealm',
        schema: [
          ContactSchema,
          ConversationSchema,
          FilteredConversationSchema,
          ConversationFilterSchema,
          ChannelSchema,
          ContentSchema,
          ChannelMetadataSchema,
          MessageSchema,
          MessageDataSchema,
          MetadataSchema,
          MessageTypeSchema,
          MetadataEventSchema,
          MessageMetadataSchema,
          SuggestedReplySchema,
          SuggestionsSchema,
          PaginationSchema,
          UserInfoSchema,
        ],
      });
    }
    return RealmDB.instance;
  }
}
