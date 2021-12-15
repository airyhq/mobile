import React from 'react';
import {RenderPropsUnion} from '../../props';
import {ContentUnion} from './googleModel';
import {TextComponent} from '../../components/Text';
import {ImageComponent} from '../../components/ImageComponent';
import {
  Suggestions,
  RichCard,
  RichCardCarousel,
  RequestedLiveAgent,
  SurveyResponse,
  RichText,
  AuthResponse,
} from './components';

const maxNumberOfGoogleSuggestions = 13;

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

    case 'richText':
      return (
        <RichText
          fromContact={props.message.fromContact || false}
          text={content.text}
        />
      );

    case 'requestedLiveAgent':
      return <RequestedLiveAgent />;

    case 'surveyResponse':
      return <SurveyResponse rating={content.rating} />;

    case 'authResponse':
      return <AuthResponse status={content.status} />;

    case 'image':
      return (
        <ImageComponent
          imageUrl={content.imageUrl}
          altText="sent via Google Business Messages"
        />
      );
    case 'suggestions':
      return (
        <Suggestions
          fromContact={props.message.fromContact || false}
          text={content.text}
          image={content.image}
          fallback={content.fallback}
          suggestions={content.suggestions}
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

  //RichText
  if (messageJson?.richText) {
    return {
      type: 'richText',
      text: messageJson.richText,
    };
  }

  //RichCard
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

  //RichCardCarousel
  if (messageJson.richCardCarousel?.carouselCard) {
    return {
      type: 'richCardCarousel',
      cardWidth: messageJson.richCardCarousel.carouselCard.cardWidth,
      cardContents: messageJson.richCardCarousel.carouselCard.cardContents,
    };
  }

  //Suggestions
  if (messageJson.suggestions.length > 0) {
    if (messageJson.suggestions.length > maxNumberOfGoogleSuggestions) {
      messageJson.suggestions = messageJson.suggestions.slice(
        0,
        maxNumberOfGoogleSuggestions,
      );
    }

    if (messageJson.text) {
      return {
        type: 'suggestions',
        text: messageJson.text,
        suggestions: messageJson.suggestions,
      };
    }

    if (messageJson.image) {
      return {
        type: 'suggestions',
        image: {
          fileUrl: messageJson?.image?.contentInfo?.fileUrl,
          altText: messageJson?.image?.contentInfo?.altText,
        },
        suggestions: messageJson.suggestions,
      };
    }

    if (messageJson.fallback) {
      return {
        type: 'suggestions',
        fallback: messageJson.fallback,
        suggestions: messageJson.suggestions,
      };
    }
  }

  //Image
  if (messageJson.image !== null) {
    return {
      type: 'image',
      imageUrl: messageJson.image.contentInfo.fileUrl,
      altText: messageJson.image.contentInfo.altText,
    };
  }

  //Image (sent by users to the agent as text message)
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

  //Live Agent request
  if (messageJson?.type === 'requestedLiveAgent') {
    return {
      type: 'requestedLiveAgent',
    };
  }

  //Survey Response
  if (messageJson?.surveyResponse) {
    return {
      type: 'surveyResponse',
      rating: messageJson?.surveyResponse,
    };
  }

  //Auth Response failed
  if (messageJson?.type === 'authResponseFailure') {
    return {
      type: 'authResponse',
      status: 'failed',
    };
  }

  //Auth Response successful
  if (messageJson?.type === 'authResponseSuccess') {
    return {
      type: 'authResponse',
      status: 'successful',
    };
  }

  //Text
  if (messageJson.text) {
    return {
      type: 'text',
      text: messageJson.text,
    };
  }

  //Unsupported
  return {
    type: 'text',
    text: 'Unkown message type',
  };
}

function googleOutbound(message: any): ContentUnion {
  const messageJson = message.content.message ?? message.content;

  //RichText
  if (messageJson?.richText) {
    return {
      type: 'richText',
      text: messageJson.richText,
    };
  }

  //RichCard
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

  //RichCardCarousel
  if (messageJson.richCardCarousel?.carouselCard) {
    return {
      type: 'richCardCarousel',
      cardWidth: messageJson.richCardCarousel.carouselCard.cardWidth,
      cardContents: messageJson.richCardCarousel.carouselCard.cardContents,
    };
  }

  //Suggestions
  if (messageJson.suggestions.length > 0) {
    if (messageJson.suggestions.length > maxNumberOfGoogleSuggestions) {
      messageJson.suggestions = messageJson.suggestions.slice(
        0,
        maxNumberOfGoogleSuggestions,
      );
    }

    if (messageJson.text) {
      return {
        type: 'suggestions',
        text: messageJson.text,
        suggestions: messageJson.suggestions,
      };
    }

    if (messageJson.image) {
      return {
        type: 'suggestions',
        image: {
          fileUrl: messageJson.image.contentInfo.fileUrl,
          altText: messageJson.image.contentInfo.altText,
        },
        suggestions: messageJson.suggestions,
      };
    }

    if (messageJson.fallback) {
      return {
        type: 'suggestions',
        fallback: messageJson.fallback,
        suggestions: messageJson.suggestions,
      };
    }
  }

  //Image
  if (messageJson.image && messageJson.image?.contentInfo?.fileUrl) {
    return {
      type: 'image',
      imageUrl: messageJson.image.contentInfo.fileUrl,
      altText: messageJson?.image?.contentInfo?.altText,
    };
  }

  //Requested Live Agent
  if (messageJson?.type === 'requestedLiveAgent') {
    return {
      type: 'requestedLiveAgent',
    };
  }

  //Survey Response
  if (messageJson?.surveyResponse) {
    return {
      type: 'surveyResponse',
      rating: messageJson?.surveyResponse,
    };
  }

  //Auth response failure
  if (messageJson?.type === 'authResponseFailure') {
    return {
      type: 'authResponse',
      status: 'failed',
    };
  }

  //Auth response successful
  if (messageJson?.type === 'authResponseSuccess') {
    return {
      type: 'authResponse',
      status: 'successful',
    };
  }

  //Text
  if (messageJson.text !== null) {
    return {
      type: 'text',
      text: messageJson.text,
    };
  }

  //Fallback
  if (messageJson.fallback !== null) {
    return {
      type: 'text',
      text: messageJson.fallback,
    };
  }

  //Unsupported
  return {
    type: 'text',
    text: 'Unsupported message type',
  };
}
