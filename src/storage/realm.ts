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
  FilteredConversationSchema,
  FilterConversationPaginationSchema,
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
          FilteredConversationSchema,
          FilterConversationPaginationSchema,
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
    // console.log(
    //   'upsert Conversation',
    //   conversation.metadata.contact.displayName,
    // );

    if (conversation.id === 'b8e7eb3f-645f-5f88-9213-e6cce536e671') {
      console.log(
        'conversation.metadata.contact.displayName',
        conversation.metadata.contact.displayName,
      );
    }

    const storedConversation: Conversation | undefined =
      realm.objectForPrimaryKey('Conversation', conversation.id);

    if (storedConversation) {
      realm.write(() => {
        storedConversation.lastMessage = conversation.lastMessage;
        storedConversation.metadata = conversation.metadata;
        storedConversation.filtered = false;
      });
    } else {
      realm.write(() => {
        const newConversation: Conversation = parseToRealmConversation(
          conversation,
          false,
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
    console.log('UPSERT FILTERED');
    allConversations.filter(conv => {
      if (conv.id === conversation.id) {
        isFiltered = false;
        console.log('FILTER BOOL FALSE', conv.id);
        return;
      }
    });

    const storedConversation: Conversation | undefined =
      realm.objectForPrimaryKey('Conversation', conversation.id);

    if (storedConversation) {
      console.log('storedConversation.id', storedConversation.id);
      realm.write(() => {
        storedConversation.lastMessage = conversation.lastMessage;
        storedConversation.metadata = conversation.metadata;
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
