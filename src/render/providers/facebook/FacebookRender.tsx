import React from 'react';
import {RenderPropsUnion} from '../../props';
import {TextComponent} from '../../components/Text';
import {
  ContentUnion,
  SimpleAttachment,
  ButtonAttachment,
  GenericAttachment,
  MediaAttachment,
  AttachmentUnion,
} from './facebookModel';

export const FacebookRender = (props: RenderPropsUnion) => {
  const message = props.message;
  const content = message.fromContact
    ? facebookInbound(message)
    : facebookOutbound(message);
  return render(content, props);
};

function render(content: ContentUnion, props: RenderPropsUnion) {
  switch (content.type) {
    case 'text':
      return (
        <TextComponent
          fromContact={props.message.fromContact || false}
          text={content.text}
        />
      );

    default:
      return null;
  }
}

const parseAttachment = (
  attachment:
    | SimpleAttachment
    | ButtonAttachment
    | GenericAttachment
    | MediaAttachment,
): AttachmentUnion => {
  if (attachment.type === 'image') {
    return {
      type: 'image',
      imageUrl: attachment.payload.url,
    };
  }

  if (attachment.type === 'audio') {
    return {
      type: 'audio',
      audioUrl: attachment.payload.url,
    };
  }

  if (attachment.type === 'file') {
    return {
      type: 'file',
      fileUrl: attachment.payload.url,
    };
  }

  if (
    attachment.type === 'template' &&
    attachment.payload.template_type === 'button'
  ) {
    return {
      type: 'buttonTemplate',
      text: attachment.payload.text ?? attachment.title,
      buttons: attachment.payload.buttons,
    };
  }

  if (
    attachment.type === 'template' &&
    attachment.payload.template_type === 'generic'
  ) {
    return {
      type: 'genericTemplate',
      elements: attachment.payload.elements,
    };
  }

  if (
    attachment.type === 'template' &&
    attachment.payload.template_type === 'media'
  ) {
    return {
      type: 'mediaTemplate',
      media_type: attachment.payload.elements[0].media_type,
      url: attachment.payload.elements[0].url ?? null,
      attachment_id: attachment.payload.elements[0].attachment_id ?? null,
      buttons: attachment.payload.elements[0].buttons,
    };
  }

  if (attachment.type === 'video') {
    return {
      type: 'video',
      videoUrl: attachment.payload.url,
    };
  }

  if (attachment.type === 'fallback') {
    return {
      type: 'fallback',
      title: attachment.payload?.title ?? attachment.title,
      url: attachment.payload?.url ?? attachment.url,
    };
  }

  return {
    type: 'text',
    text: 'Unknown message type',
  };
};

function facebookInbound(message): ContentUnion {
  const messageJson = message.content.message ?? message.content;

  if (
    messageJson.attachment?.type === 'fallback' ||
    messageJson.attachments?.[0].type === 'fallback'
  ) {
    return {
      text: messageJson.text ?? null,
      ...parseAttachment(messageJson.attachment || messageJson.attachments[0]),
    };
  }

  if (messageJson.attachments?.[0].type === 'image') {
    return {
      type: 'images',
      images: messageJson.attachments.map(image => {
        return parseAttachment(image);
      }),
    };
  }

  if (messageJson.attachment || messageJson.attachments) {
    return parseAttachment(
      messageJson.attachment || messageJson.attachments[0],
    );
  }

  if (messageJson.postback) {
    return {
      type: 'postback',
      title:
        messageJson.postback.title === false
          ? null
          : messageJson.postback.title,
      payload: messageJson.postback.payload,
    };
  }

  if (messageJson.text) {
    return {
      type: 'text',
      text: messageJson.text,
    };
  }

  return {
    type: 'text',
    text: 'Unkown message type',
  };
}

function facebookOutbound(message): ContentUnion {
  const messageJson = message.content.message ?? message.content;

  if (messageJson.quick_replies) {
    if (messageJson.quick_replies.length > 13) {
      messageJson.quick_replies = messageJson.quick_replies.slice(0, 13);
    }

    if (messageJson.attachment || messageJson.attachments) {
      return {
        type: 'quickReplies',
        attachment: parseAttachment(
          messageJson.attachment || messageJson.attachments,
        ),
        quickReplies: messageJson.quick_replies,
      };
    }

    return {
      type: 'quickReplies',
      text: messageJson.text,
      quickReplies: messageJson.quick_replies,
    };
  }

  if (
    messageJson.attachment?.type === 'fallback' ||
    messageJson.attachments?.[0].type === 'fallback'
  ) {
    return {
      text: messageJson.text ?? null,
      ...parseAttachment(messageJson.attachment || messageJson.attachments[0]),
    };
  }

  if (messageJson.attachment || messageJson.attachments) {
    return parseAttachment(
      messageJson.attachment || messageJson.attachments[0],
    );
  }

  if (messageJson.postback) {
    return {
      type: 'postback',
      title:
        messageJson.postback.title === false
          ? null
          : messageJson.postback.title,
      payload: messageJson.postback.payload,
    };
  }

  if (messageJson.text) {
    return {
      type: 'text',
      text: messageJson.text,
    };
  }

  return {
    type: 'text',
    text: 'Unknown message type',
  };
}
