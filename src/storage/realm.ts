import Realm from 'realm';
import {UserInfoSchema} from '../model/userInfo';
import {ConversationSchema} from '../model/Conversation';
import {TagSchema} from '../model/Tag';
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
          ChannelSchema,
          ContentSchema,
          ChannelMetadataSchema,
          MessageSchema,
          MetadataSchema,
          MessageTypeSchema,
          MetadataEventSchema,
          MessageMetadataSchema,
          SuggestedReplySchema,
          SuggestionsSchema,
          TagSchema,
          PaginationSchema,
          UserInfoSchema,
        ],
      });
    }
    return RealmDB.instance;
  }
}