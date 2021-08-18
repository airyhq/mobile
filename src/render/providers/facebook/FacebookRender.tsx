import React from 'react';
import {RenderPropsUnion} from '../../props';
import {Text} from '../../components/Text';
import { ContentUnion } from './facebookModel';

export const FacebookRender = (props: RenderPropsUnion) => {
  const message = props.message;
  const content = message.fromContact ? facebookInbound(message) : facebookOutbound(message);
  return render(content, props);
};

function render(content: ContentUnion, props: RenderPropsUnion) {
  switch (content.type) {
    case 'text':
      return <Text fromContact={props.message.fromContact || false} text={content.text} />;

    default:
      return null;
  }
}

function facebookInbound(message): ContentUnion {
  const messageJson = message.content.message ?? message.content;

  if (messageJson.attachment?.type === 'fallback' || messageJson.attachments?.[0].type === 'fallback') {
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
    return parseAttachment(messageJson.attachment || messageJson.attachments[0]);
  }

  if (messageJson.postback) {
    return {
      type: 'postback',
      title: messageJson.postback.title == false ? null : messageJson.postback.title,
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
        attachment: parseAttachment(messageJson.attachment || messageJson.attachments),
        quickReplies: messageJson.quick_replies,
      };
    }

    return {
      type: 'quickReplies',
      text: messageJson.text,
      quickReplies: messageJson.quick_replies,
    };
  }

  if (messageJson.attachment?.type === 'fallback' || messageJson.attachments?.[0].type === 'fallback') {
    return {
      text: messageJson.text ?? null,
      ...parseAttachment(messageJson.attachment || messageJson.attachments[0]),
    };
  }

  if (messageJson.attachment || messageJson.attachments) {
    return parseAttachment(messageJson.attachment || messageJson.attachments[0]);
  }

  if (messageJson.postback) {
    return {
      type: 'postback',
      title: messageJson.postback.title == false ? null : messageJson.postback.title,
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
