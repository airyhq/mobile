import React from 'react';
import {RenderPropsUnion} from '../../props';
import {ContentUnion} from './chatPluginModel';
import {TextComponent} from '../../components/Text';


export const ChatPluginRender = (props: RenderPropsUnion) => {
  return render(mapContent(props.message), props);
};

function render(content: ContentUnion, props: RenderPropsUnion) {

  const defaultProps = {
    fromContact: props.message.fromContact || false,
    commandCallback: 'commandCallback' in props ? props.commandCallback : null,
  };
  const invertedProps = {...defaultProps, fromContact: !defaultProps.fromContact};
  const propsToUse = 'invertSides' in props ? invertedProps : defaultProps;

  switch (content.type) {
    case 'text':
      return <TextComponent {...propsToUse} text={content.text} />;
  }
}

function mapContent(message:any):ContentUnion {

  const messageContent = message.content.message ?? message.content;

  if (messageContent.text) {
    return {
      type: 'text',
      text: messageContent.text,
    };
  }

  return {
    type: 'text',
    text: 'Unknown message type',
  };
}



