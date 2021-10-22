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

//attachment message: distinguish btw all types of attachments
// + template attachments

export const ContentMessageSchema = {
  name: 'ContentMessage',
  properties: {
    type: 'string',
    text: 'string?',
    richCard: 'RichCard?',
    richCardCarousel: 'RichCardCarousel?',
    attachment: 'Attachment?',
    attachments: 'Attachments?',
    genericAttachment: 'GenericAttachment?',
    mediaAttachment: 'MediaAttachment?',
    buttonAttachment: 'ButtonAttachment?',
    quickRepliesChatPlugin: 'QuickRepliesChatPlugin?',
    quickRepliesFacebook: 'QuickRepliesFacebook?',
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

//Postabcak Facebook

export const parseToRealmMessage = (
  unformattedMessage: any,
  source: string,
): Message => {
  let messageContent =
    unformattedMessage.content?.Body ??
    unformattedMessage.content?.text ??
    unformattedMessage.content?.message?.text ??
    unformattedMessage.content?.postback?.title ??
    unformattedMessage.content?.message ??
    unformattedMessage.content

  //chatplugin templates
  if (source === Source.chatplugin) {
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

    if (messageContent.quick_replies) {
      if (
        (messageContent.attachment || messageContent.attachments) &&
        messageContent.quick_replies
      ) {
        const attachmentMessage =
          messageContent.attachment || messageContent.attachments;
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

      return {
        id: unformattedMessage.id,
        content: {
          type: 'QuickReplies',
          QuickReplies: {...messageContent.quick_replies},
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
    }

    if (messageContent.postback) {
      return {
        id: unformattedMessage.id,
        content: {
          type: 'Postback',
          Postback: {...messageContent.quick_replies},
        },
        deliveryState: unformattedMessage.deliveryState,
        fromContact: unformattedMessage.fromContact,
        sentAt: unformattedMessage.sentAt,
        metadata: unformattedMessage.metadata,
      };
    }
  }

  //facebook templates
  if (source === Source.facebook) {
    const attachmentMessage =
      messageContent?.message?.attachment ||
      messageContent?.message?.attachments?.[0]

    console.log('parse fb', messageContent);

    if (
      messageContent?.quick_replies ||
      messageContent?.message?.quick_replies
    ) {
      if (
        messageContent?.message?.attachment ||
        messageContent?.message?.attachments
      ) {
        if (messageContent?.message?.attachment) {
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

        if (messageContent?.message?.attachments) {
          return {
            id: unformattedMessage.id,
            content: {
              type: 'QuickReplies',
              attachments: {...attachmentMessage},
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
      }

      if (messageContent.messagetext) {
        return {
          id: unformattedMessage.id,
          content: {
            type: 'QuickReplies',
            text: messageContent.text,
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

      return {
        id: unformattedMessage.id,
        content: {
          type: 'QuickReplies',
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

    // if (messageContent.message.postback) {
    //   return {
    //     id: unformattedMessage.id,
    //     content: {
    //       type: 'Postback',
    //       Postback: {...messageContent.message.postback},
    //     },
    //     deliveryState: unformattedMessage.deliveryState,
    //     fromContact: unformattedMessage.fromContact,
    //     sentAt: unformattedMessage.sentAt,
    //     metadata: unformattedMessage.metadata,
    //   };
    // }

    // genericAttachment: 'GenericAttachment?',
    // mediaAttachment: 'MediaAttachment?',
    // buttonAttachment: 'ButtonAttachment?',

    //TEMPLATES
    if (attachmentMessage && attachmentMessage.type === 'template') {
      console.log('template', attachmentMessage?.payload);
      //buttonTemplate
      if (attachmentMessage?.payload?.template_type === 'button') {
        return {
          id: unformattedMessage.id,
          content: {
            type: 'button',
            buttonAttachment: {...attachmentMessage},
          },
          deliveryState: unformattedMessage.deliveryState,
          fromContact: unformattedMessage.fromContact,
          sentAt: unformattedMessage.sentAt,
          metadata: unformattedMessage.metadata,
        };
      }

      if (attachmentMessage?.payload?.template_type === 'generic') {
        return {
          id: unformattedMessage.id,
          content: {
            type: 'generic',
            genericAttachment: {...attachmentMessage},
          },
          deliveryState: unformattedMessage.deliveryState,
          fromContact: unformattedMessage.fromContact,
          sentAt: unformattedMessage.sentAt,
          metadata: unformattedMessage.metadata,
        };
      }

      if (attachmentMessage?.payload?.template_type === 'media') {
        return {
          id: unformattedMessage.id,
          content: {
            type: 'media',
            mediaAttachment: {...attachmentMessage},
          },
          deliveryState: unformattedMessage.deliveryState,
          fromContact: unformattedMessage.fromContact,
          sentAt: unformattedMessage.sentAt,
          metadata: unformattedMessage.metadata,
        };
      }
    }

    //attachment or attachment
    if (
      attachmentMessage
    ) {
      console.log('attachment', attachmentMessage);

      if (messageContent?.message?.attachment) {
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

      if (messageContent?.message?.attachments) {
        return {
          id: unformattedMessage.id,
          content: {
            type: 'Attachments',
            attachments: {...attachmentMessage},
          },
          deliveryState: unformattedMessage.deliveryState,
          fromContact: unformattedMessage.fromContact,
          sentAt: unformattedMessage.sentAt,
          metadata: unformattedMessage.metadata,
        };
      }
    }
  }

  if (source === Source.google) {
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
