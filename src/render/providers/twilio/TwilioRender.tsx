import React from 'react';
import {decodeURIComponentMessage} from '../../../services/types/decodeURIComponentMessage';
import {AudioComponent} from '../../components/AudioComponent';
import {FileComponent} from '../../components/FileComponent';
import {ImageComponent} from '../../components/ImageComponent';
import {TextComponent} from '../../components/Text';
import {VideoComponent} from '../../components/VideoComponent';
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

    case 'image':
      return <ImageComponent imageUrl={content.imageUrl} />;

    case 'video':
      return <VideoComponent videoUrl={content.videoUrl} />;

    case 'audio':
      return <AudioComponent audioUrl={content.audioUrl} />;

    case 'file':
      return (
        <FileComponent fileUrl={content.fileUrl} fileName={content.fileName} />
      );
  }
}

const inboundContent = (message): ContentUnion => {
  const messageContent = message.content.text;
  let contentStart: string;
  let contentEnd: string;

  if (messageContent.includes('MediaContentType0=image')) {
    contentStart = 'MediaUrl0=';
    contentEnd = '&ApiVersion=';
    const imageUrl = decodeURIComponentMessage(
      messageContent,
      contentStart,
      contentEnd,
    );
    let textCaption;

    if (messageContent.includes('&Body=' && '&To=whatsapp')) {
      contentStart = '&Body=';
      contentEnd = '&To=whatsapp';
      textCaption = decodeURIComponentMessage(
        messageContent,
        contentStart,
        contentEnd,
      );
    }

    return {
      type: 'image',
      imageUrl: imageUrl,
      text: textCaption ?? null,
    };
  }

  //video (with optional text caption)
  if (messageContent.includes('MediaContentType0=video')) {
    contentStart = 'MediaUrl0=';
    contentEnd = '&ApiVersion=';
    const videoUrl = decodeURIComponentMessage(
      messageContent,
      contentStart,
      contentEnd,
    );
    let textCaption: string;

    if (messageContent.includes('&Body=' && '&To=whatsapp')) {
      contentStart = '&Body=';
      contentEnd = '&To=whatsapp';
      textCaption = decodeURIComponentMessage(
        messageContent,
        contentStart,
        contentEnd,
      );
    }

    return {
      type: 'video',
      videoUrl: videoUrl,
      text: textCaption ?? null,
    };
  }

  //audio
  if (messageContent.includes('MediaContentType0=audio')) {
    contentStart = 'MediaUrl0=';
    contentEnd = '&ApiVersion=';
    const audioUrl = decodeURIComponentMessage(
      messageContent,
      contentStart,
      contentEnd,
    );

    return {
      type: 'audio',
      audioUrl: audioUrl,
    };
  }

  //file: pdf or vcf
  if (
    messageContent.includes('MediaContentType0=application%2Fpdf') ||
    messageContent.includes('MediaContentType0=text%2Fvcard')
  ) {
    let fileName = '';

    contentStart = 'MediaUrl0=';
    contentEnd = '&ApiVersion=';
    const fileUrl = decodeURIComponentMessage(
      messageContent,
      contentStart,
      contentEnd,
    );

    if (messageContent.includes('&Body=' && '&To=whatsapp')) {
      contentStart = '&Body=';
      contentEnd = '&To=whatsapp';
      fileName = decodeURIComponentMessage(
        messageContent,
        contentStart,
        contentEnd,
      );
    }

    let type;

    if (messageContent.includes('MediaContentType0=application%2Fpdf')) {
      type = 'pdf';
    }

    if (messageContent.includes('MediaContentType0=text%2Fvcard')) {
      type = 'vcf';
    }

    return {
      type: 'file',
      fileType: type ?? null,
      fileName: fileName,
      fileUrl: fileUrl,
    };
  }

  //currentLocation (Live Location is not currently supported by Twilio)
  if (
    messageContent.includes('Latitude') &&
    messageContent.includes('Longitude')
  ) {
    const latitudeStartIndex = messageContent.includes('Latitude=');
    const latitudeStartLength = 'Latitude='.length;
    const latitudeEndIndex = messageContent.includes('&Longitude=');
    const latitude = messageContent.substring(
      latitudeStartIndex + latitudeStartLength,
      latitudeEndIndex,
    );

    const longitudeStartIndex = messageContent.includes('&Longitude=');
    const longitudeStartLength = '&Longitude='.length;
    const longitudeEndIndex = messageContent.includes('&SmsMessageSid=');
    const longitude = messageContent.substring(
      longitudeStartIndex + longitudeStartLength,
      longitudeEndIndex,
    );

    const formattedLatitude = parseFloat(latitude).toFixed(6);
    const formattedLongitude = parseFloat(longitude).toFixed(6);

    return {
      type: 'currentLocation',
      latitude: formattedLatitude,
      longitude: formattedLongitude,
    };
  }

  //text
  if (
    messageContent.includes('&Body=' && '&FromCountry=') ||
    messageContent.includes('&Body=' && '&To=whatsapp')
  ) {
    let text: string;

    if (messageContent.includes('&Body=' && '&FromCountry=')) {
      contentStart = '&Body=';
      contentEnd = '&FromCountry=';
      text = decodeURIComponentMessage(
        messageContent,
        contentStart,
        contentEnd,
      );
    } else if (messageContent.includes('&Body=' && '&To=whatsapp')) {
      contentStart = '&Body=';
      contentEnd = '&To=whatsapp';
      text = decodeURIComponentMessage(
        messageContent,
        contentStart,
        contentEnd,
      );
    }

    if (!text || text === '') {
      text = 'Unsupported message type';
    }

    return {
      type: 'text',
      text: text,
    };
  }
};

const outboundContent = (message): ContentUnion => {
  const messageContent =
    message?.content?.message ?? message?.content ?? message;
  const messageContentMedia =
    messageContent.text.includes('MediaUrl') &&
    JSON.parse(messageContent?.text);

  //media
  if (messageContentMedia?.MediaUrl) {
    const mediaUrl = messageContentMedia?.MediaUrl;

    return {
      type: 'audio',
      audioUrl: mediaUrl,
    };
  }

  //text
  return {
    type: 'text',
    text:
      messageContent?.Body ??
      messageContent?.text ??
      'Unsupported message type',
  };
};
