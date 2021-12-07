import React from 'react';
import {RenderPropsUnion} from '../../props';
import {ContentUnion} from './googleModel';
import {TextComponent} from '../../components/Text';
import {ImageComponent} from '../../components/ImageComponent';
import {RichCard} from './components/RichCard';
import {RichCardCarousel} from './components/RichCardCarousel';
import {SurveyResponse} from './components/SurveyResponse';

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
    case 'richCard':
      return (
        <RichCard
          title={content.title}
          description={content.description}
          media={content.media}
          suggestions={content.suggestions}
        />
      );

    case 'richCardCarousel':
      return (
        <RichCardCarousel
          cardWidth={content.cardWidth}
          cardContents={content.cardContents}
        />
      );

    case 'surveyResponse':
      return <SurveyResponse rating={content.rating} />;
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

  if (messageJson.richCard?.standaloneCard) {
    const {
      richCard: {
        standaloneCard: {cardContent},
      },
    } = messageJson;

    return {
      type: 'richCard',
      ...(cardContent.title && {title: cardContent.title}),
      ...(cardContent.description && {description: cardContent.description}),
      media: cardContent.media,
      suggestions: cardContent.suggestions,
    };
  }

  if (messageJson.richCardCarousel?.carouselCard) {
    return {
      type: 'richCardCarousel',
      cardWidth: messageJson.richCardCarousel.carouselCard.cardWidth,
      cardContents: messageJson.richCardCarousel.carouselCard.cardContents,
    };
  }

  if (
    messageJson.text &&
    messageJson.text.includes('https://storage.googleapis.com') &&
    messageJson.text.toLowerCase().includes('x-goog-algorithm') &&
    messageJson.text.toLowerCase().includes('x-goog-credential')
  ) {
    return {
      type: 'image',
      imageUrl: messageJson.text,
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

  if (messageJson.richCard?.standaloneCard) {
    const {
      richCard: {
        standaloneCard: {cardContent},
      },
    } = messageJson;

    return {
      type: 'richCard',
      ...(cardContent.title && {title: cardContent.title}),
      ...(cardContent.description && {description: cardContent.description}),
      media: cardContent.media,
      suggestions: cardContent.suggestions,
    };
  }

  if (messageJson.richCardCarousel?.carouselCard) {
    return {
      type: 'richCardCarousel',
      cardWidth: messageJson.richCardCarousel.carouselCard.cardWidth,
      cardContents: messageJson.richCardCarousel.carouselCard.cardContents,
    };
  }

  if (messageJson.image && messageJson.image?.contentInfo?.fileUrl) {
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
    text: 'Unsupported message type',
  };
}
