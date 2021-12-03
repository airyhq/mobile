import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Conversation, Message} from '../model';
import RichCardIcon from '../assets/images/icons/richCardIcon.svg';
import AttachmentTemplate from '../assets/images/icons/attachmentTemplate.svg';
import AttachmentImage from '../assets/images/icons/attachmentImage.svg';
import AttachmentVideo from '../assets/images/icons/attachmentVideo.svg';
import AttachmentAudio from '../assets/images/icons/file-audio.svg';
import AttachmentFile from '../assets/images/icons/file-download.svg';
import {decodeURIComponentMessage} from '../services/message';
import {getAttachmentType} from '../services/attachments';
import {Emoji} from '../componentsLib/general/Emoji';

interface SourceMessagePreviewProps {
  conversation: Conversation;
}

interface FormattedMessageProps {
  message: Message;
}

const FormattedMessage = ({message}: FormattedMessageProps) => {
  if (message?.content) {
    return (
      <Text>
        {message.content.message?.text ||
          message.content.text ||
          message?.content?.Body}
      </Text>
    );
  }
  return <Text />;
};

const isImageFromGoogleSource = (messageText?: string) => {
  if (!messageText) {
    return false;
  }

  return (
    messageText.includes('https://storage.googleapis.com') &&
    messageText.toLowerCase().includes('x-goog-algorithm') &&
    messageText.toLowerCase().includes('x-goog-credential')
  );
};

export const SourceMessagePreview = (props: SourceMessagePreviewProps) => {
  const {conversation} = props;

  const lastMessageIsText = (conversation: Conversation) => {
    const lastMessageContent = conversation.lastMessage.content;
    const googleLiveAgentRequest =
      lastMessageContent?.userStatus?.requestedLiveAgent;
    const googleSurveyResponse = lastMessageContent?.surveyResponse;

    const instagramStoryMention =
      lastMessageContent?.attachments?.[0]?.type === 'story_mention';
    const instagramStoryReplies = lastMessageContent?.storyReplies;
    const instagramDeletedMessage = lastMessageContent?.isDeleted;
    const instagramShare =
      lastMessageContent?.attachment?.share ||
      lastMessageContent?.attachments?.[0]?.share;

    if (instagramStoryMention) {
      return (
        <>
          <Text>story mention</Text>
        </>
      );
    }

    if (instagramStoryReplies) {
      return (
        <>
          <Text>story reply</Text>
        </>
      );
    }

    if (instagramDeletedMessage) {
      return (
        <>
          <Text>deleted message</Text>
        </>
      );
    }

    if (instagramShare) {
      return (
        <>
          <Text>shared post</Text>
        </>
      );
    }

    if (googleLiveAgentRequest) {
      return (
        <>
          <Text>
            <Emoji symbol={'👋'} /> Live Agent request
          </Text>
        </>
      );
    }

    if (googleSurveyResponse) {
      return (
        <>
          <Text>
            <Emoji symbol={'📝'} /> Survey response
          </Text>
        </>
      );
    }

    if (typeof lastMessageContent === 'string') {
      let text;

      if (lastMessageContent.includes('&Body=' && '&FromCountry=')) {
        const contentStart = '&Body=';
        const contentEnd = '&FromCountry=';
        text = decodeURIComponentMessage(
          lastMessageContent,
          contentStart,
          contentEnd,
        );
      } else if (lastMessageContent.includes('&Body=' && '&To=whatsapp')) {
        const contentStart = '&Body=';
        const contentEnd = '&To=whatsapp';
        text = decodeURIComponentMessage(
          lastMessageContent,
          contentStart,
          contentEnd,
        );
      }

      return <Text>{text}</Text>;
    }

    if (
      (lastMessageContent.text ||
        lastMessageContent.message?.text ||
        (lastMessageContent?.Body &&
          typeof lastMessageContent?.Body === 'string')) &&
      !isImageFromGoogleSource(lastMessageContent.message?.text)
    ) {
      return <FormattedMessage message={conversation.lastMessage} />;
    }

    if (lastMessageContent.suggestionResponse) {
      return (
        <Text>{conversation.lastMessage.content.suggestionResponse.text}</Text>
      );
    }
  };

  const lastMessageIsIcon = (conversation: Conversation) => {
    const lastMessageContent = conversation.lastMessage.content;
    const source = conversation.channel.source;

    const twilioWhatsAppOutboundMediaUrl = lastMessageContent?.MediaUrl;

    const twilioWhatsAppInboundImage =
      typeof lastMessageContent === 'string' &&
      lastMessageContent.includes('MediaContentType0=image');
    const twilioWhatsAppInboundFile =
      typeof lastMessageContent === 'string' &&
      (lastMessageContent.includes('MediaContentType0=application%2Fpdf') ||
        lastMessageContent.includes('MediaContentType0=text%2Fvcard'));
    const twilioWhatsAppInboundAudio =
      typeof lastMessageContent === 'string' &&
      lastMessageContent.includes('MediaContentType0=audio');
    const twilioWhatsAppInboundVideo =
      typeof lastMessageContent === 'string' &&
      lastMessageContent.includes('MediaContentType0=video');

    if (twilioWhatsAppOutboundMediaUrl) {
      const attachmentType = getAttachmentType(
        twilioWhatsAppOutboundMediaUrl,
        source,
      );

      if (attachmentType === 'image') {
        return (
          <View style={styles.richCard}>
            <AttachmentImage
              style={{height: '24px', width: '24px', margin: '0px'}}
            />
          </View>
        );
      }

      if (attachmentType === 'video') {
        return (
          <View style={styles.richCard}>
            <AttachmentVideo
              style={{height: '24px', width: '24px', margin: '0px'}}
            />
          </View>
        );
      }

      if (attachmentType === 'audio') {
        return (
          <View style={styles.richCard}>
            <AttachmentAudio
              style={{height: '24px', width: '24px', margin: '0px'}}
            />
          </View>
        );
      }

      if (attachmentType === 'file') {
        return (
          <View style={styles.richCard}>
            <AttachmentFile
              style={{height: '24px', width: '24px', margin: '0px'}}
            />
          </View>
        );
      }
    }

    if (
      lastMessageContent.message?.attachments?.[0].type === 'image' ||
      lastMessageContent.attachments?.[0]?.type === 'image' ||
      lastMessageContent?.attachment?.type === 'image' ||
      isImageFromGoogleSource(lastMessageContent.message?.text) ||
      twilioWhatsAppInboundImage
    ) {
      return (
        <View style={styles.richCard}>
          <AttachmentImage style={{height: '24px', width: '24px'}} />
        </View>
      );
    }

    if (
      lastMessageContent.message?.attachments?.[0].type === 'video' ||
      lastMessageContent?.attachments?.[0]?.type === 'video' ||
      lastMessageContent?.attachment?.type === 'video' ||
      twilioWhatsAppInboundVideo
    ) {
      return (
        <View style={styles.richCard}>
          <AttachmentVideo
            style={{height: '24px', width: '24px', margin: '0px'}}
          />
        </View>
      );
    }

    if (
      lastMessageContent.message?.attachments?.[0].type === 'audio' ||
      lastMessageContent?.attachments?.[0]?.type === 'audio' ||
      lastMessageContent?.attachment?.type === 'audio' ||
      twilioWhatsAppInboundAudio
    ) {
      return (
        <View style={styles.richCard}>
          <AttachmentAudio
            style={{height: '24px', width: '24px', margin: '0px'}}
          />
        </View>
      );
    }

    if (
      lastMessageContent.message?.attachments?.[0]?.type === 'file' ||
      lastMessageContent.attachments?.[0]?.type === 'file' ||
      lastMessageContent?.attachment?.type === 'file' ||
      twilioWhatsAppInboundFile
    ) {
      return (
        <View style={styles.richCard}>
          <AttachmentFile
            style={{height: '24px', width: '24px', margin: '0px'}}
          />
        </View>
      );
    }

    if (
      (lastMessageContent.text || lastMessageContent.message?.text) &&
      !isImageFromGoogleSource(lastMessageContent.message?.text)
    ) {
      return (
        <Text numberOfLines={1}>
          {lastMessageContent?.message?.text || lastMessageContent?.text}
        </Text>
      );
    }

    if (lastMessageContent.suggestionResponse) {
      return (
        <Text numberOfLines={1}>
          {lastMessageContent.suggestionResponse?.text}
        </Text>
      );
    }

    if (lastMessageContent?.image) {
      return (
        <View style={styles.richCard}>
          <RichCardIcon width={24} height={24} fill="#737373" />
        </View>
      );
    }

    if (lastMessageContent?.richCard) {
      return (
        <View style={styles.richCard}>
          <RichCardIcon width={24} height={24} fill="#737373" />
        </View>
      );
    }

    return (
      <View>
        <AttachmentTemplate width={18} height={18} />
      </View>
    );
  };

  return (
    <>{lastMessageIsText(conversation) || lastMessageIsIcon(conversation)}</>
  );
};

const styles = StyleSheet.create({
  richCard: {
    margin: 0,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});
