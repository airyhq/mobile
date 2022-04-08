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
  ImagesChatpluginSchema,
  SuggestionResponseSchema,
  RichTextSchema,
  FilterConversationPaginationSchema,
  parseToRealmMessage,
  DarkMode,
  DarkModeSchema,
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
          ConversationFilterSchema,
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
          MetadataSchema,
          MessageTypeSchema,
          MetadataEventSchema,
          MessageMetadataSchema,
          SuggestedReplySchema,
          SuggestionsSchema,
          PaginationSchema,
          UserInfoSchema,
          ImagesChatpluginSchema,
          SuggestionResponseSchema,
          RichTextSchema,
          FilterConversationPaginationSchema,
          DarkModeSchema,
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
  const isFiltered = false;
  conversations.forEach(conversation => {
    const storedConversation: Conversation | undefined =
      realm.objectForPrimaryKey('Conversation', conversation.id);

    if (storedConversation) {
      realm.write(() => {
        storedConversation.lastMessage = parseToRealmMessage(
          conversation.lastMessage,
          conversation.channel.source,
        );
        storedConversation.metadata = conversation.metadata;
        storedConversation.filtered = isFiltered;
      });
    } else {
      realm.write(() => {
        const newConversation: Conversation = parseToRealmConversation(
          conversation,
          isFiltered,
        );
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
      });
    }
  });
};

export const upsertFilteredConversations = (
  conversations: Conversation[],
  realm: Realm,
  allConversations: Conversation[],
) => {
  conversations.forEach(conversation => {
    let isFiltered = true;

    allConversations.filter(conv => {
      if (conv.id === conversation.id) {
        isFiltered = false;
        return;
      }
    });

    const storedConversation: Conversation | undefined =
      realm.objectForPrimaryKey('Conversation', conversation.id);

    if (storedConversation) {
      realm.write(() => {
        storedConversation.lastMessage = parseToRealmMessage(
          conversation.lastMessage,
          conversation.channel.source,
        );
        storedConversation.metadata = conversation.metadata;
        storedConversation.filtered = isFiltered;
      });
    } else {
      realm.write(() => {
        const newConversation: Conversation = parseToRealmConversation(
          conversation,
          isFiltered,
        );
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
      });
    }
  });
};
