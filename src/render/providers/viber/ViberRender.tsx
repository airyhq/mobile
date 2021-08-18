import React from 'react';
import {Text} from '../../components/Text';
import {RenderPropsUnion} from '../../props';
import {ContentUnion} from './viberModel';

export const ViberRender = (props: RenderPropsUnion) => {
  const message = props.message;
  const content = message.fromContact ? inboundContent(message) : outboundContent(message);
  return render(content, props);
};

function render(content: ContentUnion, props: RenderPropsUnion) {
  switch (content.type) {
    case 'text':
      return <Text fromContact={props.message.fromContact || false} text={content.text} />;

  }

  return null;
}

// Viber already uses a type identifier so we only need to cast to our interface
const inboundContent = (message:any): ContentUnion => message.content?.message;

const outboundContent = (message:any): ContentUnion => message.content;
