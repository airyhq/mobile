import {Content} from './Content';
import {Source} from './Channel';
import {Suggestions} from './SuggestedReply';

export enum MessageType {
  audio = 'audio',
  file = 'file',
  image = 'image',
  text = 'text',
  video = 'video',
}

export enum DeliveryState {
  pending = 'PENDING',
  failed = 'FAILED',
  delivered = 'DELIVERED',
}

export interface MessageMetadata {
  suggestions?: Suggestions;
}
export interface Message {
  id: string;
  content: Content;
  deliveryState: DeliveryState;
  fromContact: boolean;
  sentAt: Date;
  metadata?: MessageMetadata;
  source?: string;
}

export type MessageData = {
  id: string;
  messages: Message[];
};

export const ContentMessageSchema = {
  name: 'ContentMessage',
  properties: {
    type: 'string?',
    text: 'string?',
    richText: 'RichText?',
    richCard: 'RichCard?',
    richCardCarousel: 'RichCardCarousel?',
    attachment: 'Attachment?',
    attachments: 'Attachment[]',
    genericAttachment: 'GenericAttachment?',
    mediaAttachment: 'MediaAttachment?',
    buttonAttachment: 'ButtonAttachment?',
    quickRepliesChatPlugin: 'QuickRepliesChatPlugin?',
    quickRepliesFacebook: 'QuickRepliesFacebook?',
    storyReplies: 'InstagramStoryReplies?',
    suggestionResponse: 'SuggestionResponse?',
  },
};

export const MessageSchema = {
  name: 'Message',
  properties: {
    id: 'string',
    content: 'ContentMessage',
    deliveryState: 'string',
    fromContact: 'bool',
    sentAt: 'date',
    metadata: 'MessageMetadata?',
  },
};

export const MessageDataSchema = {
  name: 'MessageData',
  primaryKey: 'id',
  properties: {
    id: 'string',
    messages: {type: 'list', objectType: 'Message'},
  },
};

export const MessageTypeSchema = {
  name: 'MessageType',
  properties: {
    audio: 'string',
    file: 'string',
    image: 'string',
    text: 'string',
    video: 'string',
  },
};

export const MessageMetadataSchema = {
  name: 'MessageMetadata',
  properties: {
    suggestions: 'Suggestions',
  },
};

const isTextMessageOrStoryReplies = (unformattedMessage: any) => {
  return unformattedMessage.content?.message?.text &&
    (!unformattedMessage.content?.message?.reply_to ||
      !unformattedMessage.content?.reply_to)
    ? unformattedMessage.content?.message?.text
    : unformattedMessage.content?.message;
};

export const parseToRealmMessage = (
  unformattedMessage: any,
  source: string,
): Message => {
  let messageContent =
    unformattedMessage.content?.Body ??
    unformattedMessage.content?.text ??
    isTextMessageOrStoryReplies(unformattedMessage) ??
    unformattedMessage.content?.postback?.title ??
    unformattedMessage.content?.message ??
    unformattedMessage.content;

  const attachmentMessage =
    messageContent?.attachment || messageContent?.attachments;

  //chatplugin templates
  if (source === Source.chatplugin) {
    //richCard
    if (messageContent.richCard && !messageContent.richCard?.carouselCard) {
      return {
        id: unformattedMessage.id,
        content: {
          type: 'RichCard',
          richCard: {...messageContent.richCard},
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
    }

    //richCard Carousel
    if (messageContent.richCard && messageContent.richCard?.carouselCard) {
      return {
        id: unformattedMessage.id,
        content: {
          type: 'RichCardCarousel',
          richCardCarousel: {...messageContent.richCard},
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
    }

    //RichText
    if (unformattedMessage.content?.containsRichText) {
      return {
        id: unformattedMessage.id,
        content: {
          type: 'richText',
          richText: {
            fallback: unformattedMessage.content?.fallback,
            text: unformattedMessage.content?.text,
          },
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
    }

    if (unformattedMessage.content?.suggestionResponse) {
      return {
        id: unformattedMessage.id,
        content: {
          type: 'suggestionResponse',
          postbackData: {
            text: unformattedMessage.content?.suggestionResponse?.text,
            postbackData:
              unformattedMessage.content?.suggestionResponse?.postbackData,
          },
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
    }

    //QuickReplies
    if (messageContent.quick_replies) {
      //QuickReplies with attachment
      if (messageContent.attachment && messageContent.quick_replies) {
        return {
          id: unformattedMessage.id,
          content: {
            type: 'QuickReplies',
            attachment: {...attachmentMessage},
            quickRepliesChatPlugin: {...messageContent.quick_replies},
          },
          deliveryState: unformattedMessage.deliveryState,
          fromContact: unformattedMessage.fromContact,
          sentAt: unformattedMessage.sentAt,
          metadata: unformattedMessage.metadata,
        };
      }
    }

    //QuickReplies with attachments
    if (messageContent.attachments && messageContent.quick_replies) {
      return {
        id: unformattedMessage.id,
        content: {
          type: 'QuickReplies',
          attachments: [...attachmentMessage],
          quickRepliesChatPlugin: {...messageContent.quick_replies},
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
    }

    //QuickReplies with text
    if (messageContent.text && messageContent.quick_replies) {
      return {
        id: unformattedMessage.id,
        content: {
          type: 'QuickReplies',
          text: messageContent.text,
          quickRepliesChatPlugin: {...messageContent.quick_replies},
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
    }

    if (attachmentMessage?.type === 'image') {
      return {
        id: unformattedMessage.id,
        content: {
          attachment: {
            type: 'image',
            payload: {
              url: unformattedMessage.content.attachment.payload.url,
            },
          },
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
    }
    if (attachmentMessage?.type === 'video') {
      return {
        id: unformattedMessage.id,
        content: {
          attachment: {
            type: 'video',
            payload: {
              url: unformattedMessage.content.attachment.payload.url,
            },
          },
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
    }
    if (attachmentMessage?.type === 'audio') {
      return {
        id: unformattedMessage.id,
        content: {
          attachment: {
            type: 'audio',
            payload: {
              url: unformattedMessage.content.attachment.payload.url,
            },
          },
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
    }
    if (attachmentMessage?.type === 'file') {
      return {
        id: unformattedMessage.id,
        content: {
          attachment: {
            type: 'file',
            payload: {
              url: unformattedMessage.content.attachment.payload.url,
            },
          },
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
    }
  }

  //facebook templates
  if (source === Source.facebook || source === Source.instagram) {
    //instagram story replies
    if (messageContent?.reply_to) {
      return {
        id: unformattedMessage.id,
        content: {
          type: 'storyReplies',
          storyReplies: {
            url: messageContent.reply_to.story.url,
            text: messageContent.text,
          },
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
    }

    //instagram deleted messages
    if (messageContent?.is_deleted) {
      return {
        id: unformattedMessage.id,
        content: {
          type: 'isDeleted',
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
    }

    //instagram unsupported
    if (messageContent?.is_unsupported) {
      return {
        id: unformattedMessage.id,
        content: {
          type: 'text',
          text: 'Unsupported message type',
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
    }

    if (
      messageContent?.attachment?.type === 'template' ||
      messageContent?.attachments?.[0].type === 'template'
    ) {
      const attachment =
        messageContent?.attachment || messageContent?.attachments?.[0];

      //buttonTemplate
      if (
        messageContent?.attachment?.payload?.template_type === 'button' ||
        messageContent?.attachments?.[0].payload?.template_type === 'button'
      ) {
        return {
          id: unformattedMessage.id,
          content: {
            type: 'button',
            buttonAttachment: {...attachment},
          },
          deliveryState: unformattedMessage.deliveryState,
          fromContact: unformattedMessage.fromContact,
          sentAt: unformattedMessage.sentAt,
          metadata: unformattedMessage.metadata,
        };
      }

      //generic template
      if (
        messageContent?.attachment?.payload?.template_type === 'generic' ||
        messageContent?.attachments?.[0].payload?.template_type === 'generic'
      ) {
        return {
          id: unformattedMessage.id,
          content: {
            type: 'generic',
            genericAttachment: {...attachment},
          },
          deliveryState: unformattedMessage.deliveryState,
          fromContact: unformattedMessage.fromContact,
          sentAt: unformattedMessage.sentAt,
          metadata: unformattedMessage.metadata,
        };
      }

      //media template
      if (
        messageContent?.attachment?.payload?.template_type === 'media' ||
        messageContent?.attachments?.[0]?.payload?.template_type === 'media'
      ) {
        return {
          id: unformattedMessage.id,
          content: {
            type: 'media',
            mediaAttachment: {...attachment},
          },
          deliveryState: unformattedMessage.deliveryState,
          fromContact: unformattedMessage.fromContact,
          sentAt: unformattedMessage.sentAt,
          metadata: unformattedMessage.metadata,
        };
      }
    }

    //attachment / attachments
    if (attachmentMessage) {
      if (messageContent?.attachment) {
        return {
          id: unformattedMessage.id,
          content: {
            type: 'Attachment',
            attachment: {...attachmentMessage},
          },
          deliveryState: unformattedMessage.deliveryState,
          fromContact: unformattedMessage.fromContact,
          sentAt: unformattedMessage.sentAt,
          metadata: unformattedMessage.metadata,
        };
      }

      if (messageContent?.attachments) {
        return {
          id: unformattedMessage.id,
          content: {
            type: 'Attachments',
            attachments: [...messageContent.attachments],
          },
          deliveryState: unformattedMessage.deliveryState,
          fromContact: unformattedMessage.fromContact,
          sentAt: unformattedMessage.sentAt,
          metadata: unformattedMessage.metadata,
        };
      }
    }

    //Quick Replies
    if (messageContent?.quick_replies) {
      //QuickReplies with attachment
      if (messageContent?.attachment) {
        return {
          id: unformattedMessage.id,
          content: {
            type: 'QuickReplies',
            attachment: {...attachmentMessage},
            quickReplies: {
              ...(messageContent?.quick_replies ||
                messageContent?.message?.quick_replies),
            },
          },
          deliveryState: unformattedMessage.deliveryState,
          fromContact: unformattedMessage.fromContact,
          sentAt: unformattedMessage.sentAt,
          metadata: unformattedMessage.metadata,
        };
      }

      //QuickReplies with attachments
      if (messageContent?.attachments) {
        return {
          id: unformattedMessage.id,
          content: {
            type: 'QuickReplies',
            attachments: [...messageContent.attachments],
            quickReplies: {
              ...messageContent?.quick_replies,
            },
          },
          deliveryState: unformattedMessage.deliveryState,
          fromContact: unformattedMessage.fromContact,
          sentAt: unformattedMessage.sentAt,
          metadata: unformattedMessage.metadata,
        };
      }

      //QuickReplies with text
      if (messageContent.messagetext) {
        return {
          id: unformattedMessage.id,
          content: {
            type: 'QuickReplies',
            text: messageContent.text,
            quickReplies: {
              ...messageContent?.quick_replies,
            },
          },
          deliveryState: unformattedMessage.deliveryState,
          fromContact: unformattedMessage.fromContact,
          sentAt: unformattedMessage.sentAt,
          metadata: unformattedMessage.metadata,
        };
      }

      return {
        id: unformattedMessage.id,
        content: {
          type: 'QuickReplies',
          quickReplies: {
            ...messageContent?.quick_replies,
          },
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
    }
  }

  //Google templates
  if (source === Source.google) {
    //richCard
    if (messageContent.richCard && !messageContent.richCard?.carouselCard) {
      return {
        id: unformattedMessage.id,
        content: {
          type: 'RichCard',
          richCard: {...messageContent.richCard},
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
    }

    //richCard Carousel
    if (messageContent.richCard && messageContent.richCard?.carouselCard) {
      return {
        id: unformattedMessage.id,
        content: {
          type: 'RichCardCarousel',
          richCardCarousel: {...messageContent.richCard},
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
    }

    //image attachment
    if (messageContent.image && messageContent.image?.contentInfo?.fileUrl) {
      return {
        id: unformattedMessage.id,
        content: {
          type: 'image',
          image: messageContent,
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
    }
  }

  //text message: all sources
  if (typeof messageContent === 'object') {
    messageContent = JSON.stringify(messageContent);
  }

  if (source === Source.facebook) {
    return {
      id: unformattedMessage.id,
      content: {
        type: 'text',
        text: messageContent,
      },
      deliveryState: unformattedMessage.deliveryState,
      fromContact: unformattedMessage.fromContact,
      sentAt: unformattedMessage.sentAt,
      metadata: unformattedMessage.metadata,
    };
  }

  if (source === Source.google) {
    return {
      id: unformattedMessage.id,
      content: {
        type: 'text',
        text: messageContent,
      },
      deliveryState: unformattedMessage.deliveryState,
      fromContact: unformattedMessage.fromContact,
      sentAt: unformattedMessage.sentAt,
      metadata: unformattedMessage.metadata,
    };
  }

  if (source === Source.chatplugin && !messageContent.richCard) {
    return {
      id: unformattedMessage.id,
      content: {
        type: 'text',
        text: messageContent,
      },
      deliveryState: unformattedMessage.deliveryState,
      fromContact: unformattedMessage.fromContact,
      sentAt: unformattedMessage.sentAt,
      metadata: unformattedMessage.metadata,
    };
  }

  if (source === Source.twilioSms) {
    return {
      id: unformattedMessage.id,
      content: {
        type: 'text',
        text: messageContent,
      },
      deliveryState: unformattedMessage.deliveryState,
      fromContact: unformattedMessage.fromContact,
      sentAt: unformattedMessage.sentAt,
      metadata: unformattedMessage.metadata,
    };
  }

  if (source === Source.twilioWhatsapp) {
    return {
      id: unformattedMessage.id,
      content: {
        type: 'text',
        text: messageContent,
      },
      deliveryState: unformattedMessage.deliveryState,
      fromContact: unformattedMessage.fromContact,
      sentAt: unformattedMessage.sentAt,
      metadata: unformattedMessage.metadata,
    };
  }

  if (source === Source.instagram) {
    return {
      id: unformattedMessage.id,
      content: {
        type: 'text',
        text: messageContent,
      },
      deliveryState: unformattedMessage.deliveryState,
      fromContact: unformattedMessage.fromContact,
      sentAt: unformattedMessage.sentAt,
      metadata: unformattedMessage.metadata,
    };
  }

  if (source === Source.viber) {
    return {
      id: unformattedMessage.id,
      content: {
        type: 'text',
        text: messageContent,
      },
      deliveryState: unformattedMessage.deliveryState,
      fromContact: unformattedMessage.fromContact,
      sentAt: unformattedMessage.sentAt,
      metadata: unformattedMessage.metadata,
    };
  }

  return {
    id: unformattedMessage.id,
    content: {
      type: 'text',
      text: messageContent,
    },
    deliveryState: unformattedMessage.deliveryState,
    fromContact: unformattedMessage.fromContact,
    sentAt: unformattedMessage.sentAt,
    metadata: unformattedMessage.metadata,
  };
};
