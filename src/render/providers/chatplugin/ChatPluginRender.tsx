import React from 'react';
import {RenderPropsUnion} from '../../props';
import {
  ContentUnion,
  SimpleAttachment,
  AttachmentUnion,
} from './chatPluginModel';
import {TextComponent} from '../../components/Text';
import {RichCard, RichCardCarousel, QuickReplies, RichText} from './components';
import {ImageComponent} from '../../components/ImageComponent';
import {VideoComponent} from '../../components/VideoComponent';
import {AudioComponent} from '../../components/AudioComponent';
import {FileComponent} from '../../components/FileComponent';

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
    case 'richText':
      return (
        <RichText
          text={content.text}
          fallback={content.fallback}
          fromContact={props.message.fromContact || false}
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

    case 'suggestionResponse':
      return <TextComponent {...propsToUse} text={content.text} />;
    case 'image':
      return <ImageComponent imageUrl={content.imageUrl} />;

    case 'video':
      return <VideoComponent videoUrl={content.videoUrl} />;

    case 'audio':
      return <AudioComponent audioUrl={content.audioUrl} />;

    case 'file':
      return <FileComponent fileUrl={content.fileUrl} />;
  }
}

function mapContent(message: any): ContentUnion {
  const messageContent = message.content?.message ?? message.content ?? message;

  if (messageContent.attachment) {
    return parseAttachment(messageContent.attachment);
  }

  if (messageContent.quickRepliesChatPlugin) {
    if (messageContent.quickRepliesChatPlugin.length > 13) {
      messageContent.quickRepliesChatPlugin =
        messageContent.quickRepliesChatPlugin.slice(0, 13);
    }

    if (messageContent?.attachment || messageContent?.attachments.length > 0) {
      return {
        type: 'quickReplies',
        attachment: parseAttachment(
          messageContent.attachment || messageContent.attachments,
        ),
        quickReplies: messageContent.quickRepliesChatPlugin,
      };
    }

    return {
      type: 'quickReplies',
      text: messageContent.text,
      quickReplies: messageContent.quickRepliesChatPlugin,
    };
  }

  if (messageContent?.suggestionResponse) {
    return {
      type: 'suggestionResponse',
      text: messageContent.suggestionResponse.text,
      postbackData: messageContent.suggestionResponse.postbackData,
    };
  }

  if (messageContent?.richText) {
    return {
      type: 'richText',
      fallback: messageContent.richText?.fallback,
      text: messageContent.richText?.text,
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
    text: 'Unsupported message type',
  };
}

const parseAttachment = (attachment: SimpleAttachment): AttachmentUnion => {
  if (attachment?.type === 'image') {
    return {
      type: 'image',
      imageUrl: attachment.payload.url,
    };
  }

  if (attachment?.type === 'video') {
    return {
      type: 'video',
      videoUrl: attachment.payload.url,
    };
  }

  if (attachment?.type === 'audio') {
    return {
      type: 'audio',
      audioUrl: attachment.payload.url,
    };
  }

  if (attachment?.type === 'file') {
    return {
      type: 'file',
      fileUrl: attachment.payload.url,
    };
  }

  return {
    type: 'text',
    text: 'Unsupported message type',
  };
};
