import React from 'react';
import {RenderPropsUnion} from '../../props';
import {ContentUnion, SimpleAttachment, AttachmentUnion} from './chatPluginModel';
import {TextComponent} from '../../components/Text';
import {RichCard, RichCardCarousel, QuickReplies} from './components';

export const ChatPluginRender = (props: RenderPropsUnion) => {
  return render(mapContent(props.message), props);
};

function render(content: ContentUnion, props: RenderPropsUnion) {
  const defaultProps = {
    fromContact: props.message.fromContact || false,
    commandCallback: 'commandCallback' in props ? props.commandCallback : null,
  };
  const invertedProps = {
    ...defaultProps,
    fromContact: !defaultProps.fromContact,
  };
  const propsToUse = 'invertSides' in props ? invertedProps : defaultProps;

  switch (content.type) {
    case 'text':
      return <TextComponent {...propsToUse} text={content.text} />;
    case 'richCard':
      return (
        <RichCard
          {...propsToUse}
          title={content.title}
          description={content.description}
          media={content.media}
          suggestions={content.suggestions}
        />
      );
    case 'richCardCarousel':
      return (
        <RichCardCarousel
          {...propsToUse}
          cardWidth={content.cardWidth}
          cardContents={content.cardContents}
        />
      );
    case 'quickReplies':
        return (
          <QuickReplies
            {...propsToUse}
            text={content.text}
            attachment={content.attachment}
            quickReplies={content.quickReplies}
          />
        );
  }
}

function mapContent(message: any): ContentUnion {
  const messageContent = message.content.message ?? message.content;


  if (messageContent.quick_replies) {
    if (messageContent.quick_replies.length > 13) {
      messageContent.quick_replies = messageContent.quick_replies.slice(0, 13);
    }

    if (messageContent.attachment || messageContent.attachments) {
      return {
        type: 'quickReplies',
        attachment: parseAttachment(messageContent.attachment || messageContent.attachments),
        quickReplies: messageContent.quick_replies,
      };
    }

    return {
      type: 'quickReplies',
      text: messageContent.text,
      quickReplies: messageContent.quick_replies,
    };
  }

  if (messageContent.richCard?.standaloneCard) {
    const {
      richCard: {
        standaloneCard: {cardContent},
      },
    } = messageContent;

    return {
      type: 'richCard',
      ...(cardContent.title && {title: cardContent.title}),
      ...(cardContent.description && {description: cardContent.description}),
      media: cardContent.media,
      suggestions: cardContent.suggestions,
    };
  }

  if (messageContent.richCardCarousel?.carouselCard) {
    return {
      type: 'richCardCarousel',
      cardWidth: messageContent.richCardCarousel.carouselCard.cardWidth,
      cardContents: messageContent.richCardCarousel.carouselCard.cardContents,
    };
  }

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


const parseAttachment = (attachment: SimpleAttachment): AttachmentUnion => {
  if (attachment.type === 'image') {
    return {
      type: 'image',
      imageUrl: attachment.payload.url,
    };
  }

  if (attachment.type === 'video') {
    return {
      type: 'video',
      videoUrl: attachment.payload.url,
    };
  }

  return {
    type: 'text',
    text: 'Unknown message type',
  };
};
