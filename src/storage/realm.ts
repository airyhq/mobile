import Realm from 'realm';
import {UserInfoSchema} from '../model/userInfo';
import {ConversationSchema} from '../model/Conversation';
import {
  ChannelMetadataSchema,
  ChannelSchema,
  ContactSchema,
  TextContentSchema,
  MessageMetadataSchema,
  MessageSchema,
  MessageTypeSchema,
  MetadataEventSchema,
  MetadataSchema,
  PaginationSchema,
  SuggestedReplySchema,
  SuggestionsSchema,
  MessageDataSchema,
  ContentMessageSchema,
  RichCardSchema,
  ButtonAttachmentSchema,
  ButtonSchema,
  StandaloneCardSchema,
  CardContentSchema,
  RichCardMediaSchema,
  RichCardMediaContentInfoSchema,
  RichCardSuggestionsSchema,
  RichCardReplySchema,
  RichCardCarouselSchema,
  CarouselCardSchema,
  QuickRepliesChatPluginSchema,
  QuickRepliesChatPluginContentSchema,
  QuickReplyChatPluginCommandSchema,
  QuickRepliesFacebookSchema,
  QuickRepliesFacebookContentSchema,
  AttachmentSchema,
  AttachmentsSchema,
  AttachmentPayloadSchema,
  GenericAttachmentSchema,
  ElementSchema,
  MediaAttachmentSchema,
  MediaAttachmentPayloadSchema,
  MediaTemplateSchema,
  DefaultActionSchema,
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
          TextContentSchema,
          ContentMessageSchema,
          RichCardSchema,
          StandaloneCardSchema,
          CardContentSchema,
          RichCardMediaSchema,
          RichCardMediaContentInfoSchema,
          RichCardSuggestionsSchema,
          RichCardReplySchema,
          RichCardCarouselSchema,
          CarouselCardSchema,
          QuickRepliesChatPluginSchema,
          QuickRepliesChatPluginContentSchema,
          QuickReplyChatPluginCommandSchema,
          QuickRepliesFacebookSchema,
          QuickRepliesFacebookContentSchema,
          AttachmentSchema,
          AttachmentsSchema,
          AttachmentPayloadSchema,
          ButtonAttachmentSchema,
          ButtonSchema,
          GenericAttachmentSchema,
          ElementSchema,
          DefaultActionSchema,
          MediaAttachmentSchema,
          MediaAttachmentPayloadSchema,
          MediaTemplateSchema,
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
