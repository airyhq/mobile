import React from 'react';
import {RenderPropsUnion} from '../../props';
import {ContentUnion} from './googleModel';
import {TextComponent} from '../../components/Text';
import {ImageComponent} from '../../components/ImageComponent';

export const GoogleRender = (props: RenderPropsUnion) => {
  const message = props.message;
  const content = message.fromContact
    ? googleInbound(message)
    : googleOutbound(message);
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
    case 'image':
      return (
        <ImageComponent
          imageUrl={content.imageUrl}
          altText="sent via Google Business Messages"
        />
      );
  }
}

function googleInbound(message: any): ContentUnion {
  const messageJson = message.content.message ?? message.content;

  if (messageJson.image) {
    return {
      type: 'image',
      imageUrl: messageJson.image.contentInfo.fileUrl,
      altText: messageJson.image.contentInfo.altText,
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

function googleOutbound(message: any): ContentUnion {
  const messageJson = message.content.message ?? message.content;

  if (messageJson.image) {
    return {
      type: 'image',
      imageUrl: messageJson.image.contentInfo.fileUrl,
      altText: messageJson.image.contentInfo.altText,
    };
  }

  if (messageJson.text) {
    return {
      type: 'text',
      text: messageJson.text,
    };
  }

  if (messageJson.fallback) {
    return {
      type: 'text',
      text: messageJson.fallback,
    };
  }

  return {
    type: 'text',
    text: 'Unknown message type',
  };
}
