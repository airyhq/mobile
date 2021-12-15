import Realm from 'realm';
import {UserInfoSchema} from '../model/userInfo';
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
  RichTextSchema,
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
  AttachmentPayloadSchema,
  GenericAttachmentSchema,
  GenericPayloadSchema,
  ButtonPayloadSchema,
  ElementSchema,
  MediaAttachmentSchema,
  MediaAttachmentPayloadSchema,
  MediaTemplateSchema,
  DefaultActionSchema,
  InstagramStoryRepliesSchema,
  ConversationSchema,
  parseToRealmConversation,
  Conversation,
  Channel,
  ConversationFilterSchema,
  GoogleSuggestionsSchema,
  GoogleSuggestionsTypesSchema,
  GoogleImageSchema,
  ImageInfoSchema,
  SuggestedRepliesSchema,
  SuggestedActionSchema,
  OpenUrlActionSchema,
  SuggestedDialActionSchema,
  AuthenticationRequestSchema,
  OAuthSchema,
  LiveAgentRequestSchema,
  FacebookPostbackSchema,
} from '../model';
import {SuggestionResponseSchema} from '../model/templates/SuggestionResponse';

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
          ConversationFilterSchema,
          ChannelSchema,
          TextContentSchema,
          ContentMessageSchema,
          RichCardSchema,
          StandaloneCardSchema,
          CardContentSchema,
          RichTextSchema,
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
          AttachmentPayloadSchema,
          ButtonAttachmentSchema,
          ButtonSchema,
          GenericAttachmentSchema,
          GenericPayloadSchema,
          ButtonPayloadSchema,
          ElementSchema,
          DefaultActionSchema,
          MediaAttachmentSchema,
          MediaAttachmentPayloadSchema,
          MediaTemplateSchema,
          InstagramStoryRepliesSchema,
          GoogleSuggestionsSchema,
          GoogleSuggestionsTypesSchema,
          GoogleImageSchema,
          ImageInfoSchema,
          SuggestedRepliesSchema,
          SuggestedActionSchema,
          OpenUrlActionSchema,
          SuggestedDialActionSchema,
          AuthenticationRequestSchema,
          OAuthSchema,
          LiveAgentRequestSchema,
          FacebookPostbackSchema,
          ChannelMetadataSchema,
          MessageSchema,
          MessageDataSchema,
          MetadataSchema,
          MessageTypeSchema,
          MetadataEventSchema,
          MessageMetadataSchema,
          SuggestedReplySchema,
          SuggestionsSchema,
          SuggestionResponseSchema,
          PaginationSchema,
          UserInfoSchema,
        ],
      });
    }
    return RealmDB.instance;
  }
}

export const upsertConversations = (
  conversations: Conversation[],
  realm: Realm,
) => {
  conversations.forEach(conversation => {
    const storedConversation: Conversation | undefined =
      realm.objectForPrimaryKey('Conversation', conversation.id);

    if (storedConversation) {
      realm.write(() => {
        storedConversation.lastMessage = conversation.lastMessage;
        storedConversation.metadata = conversation.metadata;
      });
    } else {
      realm.write(() => {
        const newConversation: Conversation =
          parseToRealmConversation(conversation);
        const channel: Channel =
          RealmDB.getInstance().objectForPrimaryKey<Channel>(
            'Channel',
            conversation.channel.id,
          );
        const newConversationState = newConversation.metadata.state || 'OPEN';

        realm.create('Conversation', {
          ...newConversation,
          channel: channel || newConversation.channel,
          metadata: {
            ...newConversation.metadata,
            state: newConversationState,
          },
        });
        realm.create('MessageData', {
          id: conversation.id,
          messages: [],
        });
      });
    }
  });
};
