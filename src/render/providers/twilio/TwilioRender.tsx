import React from 'react';
import {TextComponent} from '../../components/Text';
import {RenderPropsUnion} from '../../props';
import {ContentUnion} from './twilioModel';

export const TwilioRender = (props: RenderPropsUnion) => {
  const message = props.message;
  const content = message.fromContact
    ? inboundContent(message)
    : outboundContent(message);
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
  }
}

const inboundContent = (message): ContentUnion => {
  const lastMessageContent: any = message.content;

  if (typeof lastMessageContent.text === 'string') {
    if (
      typeof lastMessageContent.text === 'string' &&
      lastMessageContent.text.includes('&Body=' && '&FromCountry=')
    ) {
      const startText = lastMessageContent.text.search('&Body=');
      const endText = lastMessageContent.text.search('&FromCountry=');
      const textLength = endText - startText;
      const enCodedText = lastMessageContent.text.substring(
        startText + 6,
        startText + textLength,
      );
      const replaced = enCodedText.split('+').join(' ');
      const text = decodeURIComponent(replaced);
      return {
        type: 'text',
        text: text,
      };
    } else if (lastMessageContent.text.includes('&Body=' && '&To=whatsapp')) {
      const startText = lastMessageContent.text.search('&Body=');
      const endText = lastMessageContent.text.search('&To=whatsapp');
      const textLength = endText - startText;
      const enCodedText = lastMessageContent.text.substring(
        startText + 6,
        startText + textLength,
      );
      const replaced = enCodedText.split('+').join(' ');
      const text = decodeURIComponent(replaced);
      return {
        type: 'text',
        text: text,
      };
    }
  }
};

const outboundContent = (message: any): ContentUnion => {
  const messageContent = message.content?.text;

  return {
    type: 'text',
    text: messageContent,
  };
};
