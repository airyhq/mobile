import React from 'react';
import {RenderPropsUnion} from '../../props';
import {TextComponent} from '../../components/Text';
import {ButtonTemplate} from './components/ButtonTemplate';
import {GenericTemplate} from './components/GenericTemplate';
import {MediaTemplate} from './components/MediaTemplate';
import {
  ContentUnion,
  SimpleAttachment,
  ButtonAttachment,
  GenericAttachment,
  MediaAttachment,
  AttachmentUnion,
} from './facebookModel';
import {VideoComponent} from '../../components/VideoComponent';
import {ImageComponent} from '../../components/ImageComponent';
import {AudioComponent} from '../../components/AudioComponent';
import {FileComponent} from '../../components/FileComponent';
import {
  QuickReplies,
  FallbackAttachment,
  StoryMention,
  StoryReplies,
  DeletedMessage,
  Share,
} from './components';

export const FacebookRender = (props: RenderPropsUnion) => {
  const message = props.message;
  const content = message.fromContact
    ? facebookInbound(message)
    : facebookOutbound(message);
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

    case 'postback':
      return (
        <TextComponent
          fromContact={props.message.fromContact || false}
          text={content.title ?? content.payload}
        />
      );

    case 'image':
      return <ImageComponent imageUrl={content.imageUrl} />;

    case 'images':
      return <ImageComponent images={content.images} />;

    case 'video':
      return <VideoComponent videoUrl={content.videoUrl} />;

    case 'audio':
      return <AudioComponent audioUrl={content.audioUrl} />;

    case 'file':
      return (
        <FileComponent fileUrl={content.fileUrl} fileName={content.fileName} />
      );

    case 'fallback':
      return (
        <FallbackAttachment
          fromContact={props.message.fromContact || false}
          content={content}
        />
      );

    case 'quickReplies':
      return (
        <QuickReplies
          fromContact={props.message.fromContact || false}
          text={content.text}
          attachment={content.attachment}
          quickReplies={content.quickReplies}
        />
      );

    case 'buttonTemplate':
      return <ButtonTemplate template={content} />;

    case 'genericTemplate':
      return <GenericTemplate template={content} />;

    case 'mediaTemplate':
      return <MediaTemplate template={content} />;

    //Instagram-specific
    case 'story_mention':
      return (
        <StoryMention
          url={content.url}
          sentAt={content.sentAt}
          fromContact={props.message.fromContact || false}
        />
      );

    case 'story_replies':
      return (
        <StoryReplies
          url={content.url}
          text={content.text}
          sentAt={content.sentAt}
          fromContact={props.message.fromContact || false}
        />
      );
    case 'share':
      return (
        <Share
          url={content.url}
          fromContact={props.message.fromContact || false}
        />
      );

    case 'deletedMessage':
      return (
        <DeletedMessage fromContact={props.message.fromContact || false} />
      );

    default:
      return null;
  }
}

const parseAttachment = (
  attachment:
    | SimpleAttachment
    | ButtonAttachment
    | GenericAttachment
    | MediaAttachment,
): AttachmentUnion => {
  if (attachment?.type === 'image') {
    return {
      type: 'image',
      imageUrl: attachment.payload.url,
    };
  }

  if (attachment.type === 'audio') {
    return {
      type: 'audio',
      audioUrl: attachment.payload.url,
    };
  }

  if (attachment.type === 'file') {
    return {
      type: 'file',
      fileUrl: attachment.payload.url,
    };
  }

  if (attachment?.type === 'video') {
    return {
      type: 'video',
      videoUrl: attachment.payload.url,
    };
  }

  if (attachment?.type === 'fallback') {
    return {
      type: 'fallback',
      title: attachment.payload?.title ?? attachment.title,
      url: attachment.payload?.url ?? attachment.url,
    };
  }

  if (
    attachment?.type === 'template' &&
    attachment.payload.template_type === 'button'
  ) {
    return {
      type: 'buttonTemplate',
      text: attachment.payload.text ?? attachment.title,
      buttons: attachment.payload.buttons,
    };
  }

  if (
    attachment?.type === 'template' &&
    attachment.payload.template_type === 'generic'
  ) {
    return {
      type: 'genericTemplate',
      elements: attachment.payload.elements,
    };
  }

  if (
    attachment?.type === 'template' &&
    attachment.payload.template_type === 'media'
  ) {
    return {
      type: 'mediaTemplate',
      media_type: attachment.payload.elements[0].media_type,
      url: attachment.payload.elements[0].url ?? null,
      attachment_id: attachment.payload.elements[0].attachment_id ?? null,
      buttons: attachment.payload.elements[0].buttons,
    };
  }

  if (attachment.type === 'share') {
    return {
      type: 'share',
      url: attachment.payload.url,
    };
  }

  return {
    type: 'text',
    text: 'Unsupported message type',
  };
};

function facebookInbound(message): ContentUnion {
  const messageJson = message.content?.message ?? message.content;

  if (messageJson?.type === 'button') {
    return parseAttachment(messageJson.buttonAttachment);
  }

  if (messageJson?.type === 'generic') {
    return parseAttachment(messageJson.genericAttachment);
  }

  if (messageJson?.type === 'media') {
    return parseAttachment(messageJson.mediaAttachment);
  }

  if (messageJson.quick_replies) {
    if (messageJson.quick_replies.length > 13) {
      messageJson.quick_replies = messageJson.quick_replies.slice(0, 13);
    }

    if (messageJson.attachment || messageJson.attachments) {
      return {
        type: 'quickReplies',
        attachment: parseAttachment(
          messageJson.attachment || messageJson.attachments,
        ),
        quickReplies: messageJson.quick_replies,
      };
    }

    return {
      type: 'quickReplies',
      text: messageJson.text,
      quickReplies: messageJson.quick_replies,
    };
  }

  if (
    messageJson?.attachment?.type === 'fallback' ||
    (messageJson?.attachments &&
      messageJson?.attachments.length > 0 &&
      messageJson?.attachments?.[0].type === 'fallback')
  ) {
    return {
      text: messageJson?.attachments?.[0].title ?? messageJson.text,
      ...parseAttachment(messageJson.attachment || messageJson.attachments[0]),
    };
  }

  if (messageJson.postback) {
    return {
      type: 'postback',
      title: messageJson.postback.title,
      payload: messageJson.postback.payload,
    };
  }

  if (
    messageJson?.attachments &&
    messageJson?.attachments.length > 0 &&
    messageJson?.attachments?.[0].type === 'image'
  ) {
    return {
      type: 'images',
      images: messageJson.attachments.map(image => {
        return parseAttachment(image);
      }),
    };
  }

  //Instagram-specific
  if (
    (messageJson &&
      messageJson?.attachments &&
      messageJson?.attachments?.[0]?.type === 'story_mention') ||
    messageJson?.attachment?.type === 'story_mention'
  ) {
    return {
      type: 'story_mention',
      url:
        messageJson?.attachments?.[0]?.payload?.url ??
        messageJson?.attachment?.payload?.url,
      sentAt: message.sentAt,
    };
  }

  if (messageJson.storyReplies) {
    return {
      type: 'story_replies',
      text: messageJson.storyReplies.text,
      url: messageJson.storyReplies.url,
      sentAt: message.sentAt,
    };
  }

  if (messageJson.type === 'isDeleted') {
    return {
      type: 'deletedMessage',
    };
  }

  if (
    messageJson?.attachment ||
    (messageJson?.attachments && messageJson?.attachments.length > 0)
  ) {
    return parseAttachment(
      messageJson.attachment || messageJson?.attachments[0],
    );
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
  const messageJson = message.content?.message ?? message.content;

  if (messageJson?.type === 'button') {
    return parseAttachment(messageJson.buttonAttachment);
  }

  if (messageJson?.type === 'generic') {
    return parseAttachment(messageJson.genericAttachment);
  }

  if (messageJson?.type === 'media') {
    return parseAttachment(messageJson.mediaAttachment);
  }

  if (messageJson?.quick_replies) {
    if (messageJson.quick_replies.length > 13) {
      messageJson.quick_replies = messageJson.quick_replies.slice(0, 13);
    }

    if (
      messageJson.attachment ||
      (messageJson.attachments && messageJson.attachments.length > 0)
    ) {
      return {
        type: 'quickReplies',
        attachment: parseAttachment(messageJson.attachment),
        quickReplies: messageJson.quick_replies,
      };
    }

    return {
      type: 'quickReplies',
      text: messageJson.text,
      quickReplies: messageJson.quick_replies,
    };
  }

  if (
    (messageJson?.attachment && messageJson?.attachment?.type === 'fallback') ||
    (messageJson?.attachments &&
      messageJson?.attachments?.[0] &&
      messageJson?.attachments?.[0].type &&
      messageJson.attachments[0].type === 'fallback')
  ) {
    return {
      text: messageJson?.attachments?.[0]?.title ?? messageJson?.text,
      ...parseAttachment(messageJson.attachment || messageJson.attachments[0]),
    };
  }

  if (
    messageJson?.attachments &&
    messageJson?.attachments?.length > 0 &&
    messageJson?.attachments?.[0]?.type === 'image'
  ) {
    return {
      type: 'images',
      images: messageJson.attachments.map(image => {
        return parseAttachment(image);
      }),
    };
  }

  //Postback
  if (messageJson.postback) {
    return {
      type: 'postback',
      title:
        messageJson.postback.title === false
          ? null
          : messageJson.postback.title,
      payload: messageJson.postback.payload,
    };
  }

  //Instagram-specific
  if (
    (messageJson &&
      messageJson?.attachments &&
      messageJson?.attachments?.[0]?.type === 'story_mention') ||
    messageJson?.attachment?.type === 'story_mention'
  ) {
    return {
      type: 'story_mention',
      url:
        messageJson?.attachments?.[0]?.payload?.url ??
        messageJson?.attachment?.payload?.url,
      sentAt: message.sentAt,
    };
  }

  if (messageJson.storyReplies) {
    return {
      type: 'story_replies',
      text: messageJson.storyReplies.text,
      url: messageJson.storyReplies.url,
      sentAt: message.sentAt,
    };
  }

  if (messageJson.type === 'isDeleted') {
    return {
      type: 'deletedMessage',
    };
  }

  if (
    messageJson.attachment ||
    (messageJson.attachments && messageJson?.attachments.length > 0)
  ) {
    return parseAttachment(
      messageJson.attachment || messageJson.attachments[0],
    );
  }

  if (messageJson.text) {
    return {
      type: 'text',
      text: messageJson.text,
    };
  }

  return {
    type: 'text',
    text: 'Unsupported message type',
  };
}
