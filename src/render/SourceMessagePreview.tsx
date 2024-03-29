import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Conversation, Message, DeliveryState} from '../model';
import {decodeURIComponentMessage} from '../services/message';
import AttachmentRichCardCarousel from '../assets/images/icons/attachmentRichCardCarousel.svg';
import AttachmentTemplate from '../assets/images/icons/attachmentTemplate.svg';
import AttachmentImage from '../assets/images/icons/attachmentImage.svg';
import AttachmentVideo from '../assets/images/icons/attachmentVideo.svg';
import AttachmentAudio from '../assets/images/icons/attachmentAudio.svg';
import AttachmentFile from '../assets/images/icons/attachmentFile.svg';
import {Emoji} from '../componentsLib/general/Emoji';
import {colorTextGray, colorRedAlert} from '../assets/colors';
import ErrorIcon from '../assets/images/icons/error.svg';
import {useTheme} from '@react-navigation/native';

interface SourceMessagePreviewProps {
  conversation: Conversation;
}

interface FormattedMessageProps {
  message: Message;
}

const FormattedMessage = ({message}: FormattedMessageProps) => {
  if (message?.content) {
    return (
      <Text numberOfLines={1}>
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
  const {colors} = useTheme();
  const lastMessage = (conversation: Conversation) => {
    const lastMessageContent = conversation.lastMessage.content;

    const failedLastMessage =
      conversation.lastMessage.deliveryState === DeliveryState.failed;

    //Icons

    //Failed deliveryState
    if (failedLastMessage) {
      return (
        <View style={styles.icon}>
          <ErrorIcon height={20} width={20} fill={colorRedAlert} />
        </View>
      );
    }

    //Image
    if (
      lastMessageContent?.image ||
      lastMessageContent?.images?.length > 1 ||
      lastMessageContent.message?.attachments?.[0].type === 'image' ||
      lastMessageContent.attachments?.[0]?.type === 'image' ||
      lastMessageContent?.attachment?.type === 'image' ||
      isImageFromGoogleSource(lastMessageContent.message?.text) ||
      lastMessageContent?.text?.includes('MediaContentType0=image')
    ) {
      return (
        <View style={styles.icon}>
          <AttachmentImage height={20} width={20} color={colorTextGray} />
          <Text style={[styles.text, {marginLeft: 4, color: colors.text}]}>
            Photo
          </Text>
        </View>
      );
    }

    //Video
    if (
      lastMessageContent.message?.attachments?.[0].type === 'video' ||
      lastMessageContent?.attachments?.[0]?.type === 'video' ||
      lastMessageContent?.attachment?.type === 'video' ||
      lastMessageContent?.text?.includes('MediaContentType0=video')
    ) {
      return (
        <View style={styles.icon}>
          <AttachmentVideo height={24} width={24} color={colorTextGray} />
          <Text style={[styles.text, {marginLeft: 4, color: colors.text}]}>
            Video
          </Text>
        </View>
      );
    }

    //Audio
    if (
      lastMessageContent.message?.attachments?.[0].type === 'audio' ||
      lastMessageContent?.attachments?.[0]?.type === 'audio' ||
      lastMessageContent?.attachment?.type === 'audio' ||
      lastMessageContent?.text?.includes('MediaContentType0=audio') ||
      (lastMessageContent?.text?.includes('MediaUrl') &&
        lastMessageContent?.text?.includes('.aac'))
    ) {
      return (
        <View style={styles.icon}>
          <AttachmentAudio height={24} width={24} color={colorTextGray} />
          <Text style={[styles.text, {marginLeft: 4, color: colors.text}]}>
            Audio
          </Text>
        </View>
      );
    }

    //File
    if (
      lastMessageContent.message?.attachments?.[0]?.type === 'file' ||
      lastMessageContent.attachments?.[0]?.type === 'file' ||
      lastMessageContent?.attachment?.type === 'file' ||
      lastMessageContent?.text?.includes('MediaContentType0=application%2Fpdf')
    ) {
      return (
        <View style={styles.icon}>
          <AttachmentFile height={24} width={24} color={colorTextGray} />
          <Text style={[styles.text, {marginLeft: 2, color: colors.text}]}>
            File
          </Text>
        </View>
      );
    }

    //Template
    if (
      lastMessageContent.message?.attachments?.[0]?.type === 'template' ||
      lastMessageContent.genericAttachment?.type === 'template' ||
      lastMessageContent.buttonAttachment?.type === 'template' ||
      lastMessageContent.attachments?.[0]?.type === 'template' ||
      lastMessageContent?.attachment?.type === 'template'
    ) {
      return (
        <View style={styles.icon}>
          <AttachmentTemplate width={18} height={18} color={colorTextGray} />
          <Text style={[styles.text, {marginLeft: 4, color: colors.text}]}>
            Template
          </Text>
        </View>
      );
    }

    //RichCard
    if (
      lastMessageContent?.richCard ||
      lastMessageContent?.richCardCarousel ||
      lastMessageContent.genericTemplate
    ) {
      return (
        <View style={styles.icon}>
          <AttachmentRichCardCarousel
            width={24}
            height={24}
            color={colorTextGray}
          />
          <Text style={[styles.text, {marginLeft: 4, color: colors.text}]}>
            RichCard
          </Text>
        </View>
      );
    }

    if (lastMessageContent.richText) {
      return (
        <Text style={[styles.text, {color: colors.text}]} numberOfLines={1}>
          {lastMessageContent?.richText?.text}
        </Text>
      );
    }

    //Text
    if (
      (lastMessageContent.text || lastMessageContent.message?.text) &&
      !isImageFromGoogleSource(lastMessageContent.message?.text) &&
      !lastMessageContent.richText &&
      !lastMessageContent?.text?.includes('&Body=' && '&To=whatsapp') &&
      !lastMessageContent?.text?.includes('&Body=' && '&FromCountry=')
    ) {
      const textMessage =
        lastMessageContent?.text || lastMessageContent.message?.text;
      return (
        <Text style={[styles.text, {color: colors.text}]} numberOfLines={1}>
          {textMessage.trimStart()}
        </Text>
      );
    }

    if (lastMessageContent.suggestionResponse) {
      const suggestionResponseText = lastMessageContent.suggestionResponse.text;
      return (
        <Text style={[styles.text, {color: colors.text}]} numberOfLines={1}>
          {suggestionResponseText.trimStart()}
        </Text>
      );
    }

    //Source-specific

    //google
    const googleLiveAgentRequest =
      lastMessageContent?.type === 'requestedLiveAgent';
    const googleAuthResponseSuccess =
      lastMessageContent?.type === 'authResponseSuccess';
    const googleAuthResponseFailed =
      lastMessageContent?.type === 'authResponseFailure';
    const googleSurveyResponse = lastMessageContent?.surveyResponse;
    const googleRichText = lastMessageContent?.richText;
    const googleSuggestion = lastMessageContent?.suggestions?.length > 0;

    if (googleLiveAgentRequest) {
      return (
        <>
          <Text style={[styles.text, {color: colors.text}]} numberOfLines={1}>
            <Emoji symbol={'👋'} /> Live Agent request
          </Text>
        </>
      );
    }

    if (googleAuthResponseSuccess) {
      return (
        <>
          <Text>
            <Emoji symbol={'✅'} /> Auth successful
          </Text>
        </>
      );
    }

    if (googleAuthResponseFailed) {
      return (
        <>
          <Text>
            <Emoji symbol={'❌'} /> Auth failed
          </Text>
        </>
      );
    }

    if (googleSurveyResponse) {
      return (
        <>
          <Text style={[styles.text, {color: colors.text}]} numberOfLines={1}>
            <Emoji symbol={'📝'} /> Survey response
          </Text>
        </>
      );
    }

    if (googleRichText) {
      return (
        <>
          <Text style={{color: colors.text}}>Rich text</Text>
        </>
      );
    }

    if (googleSuggestion) {
      return (
        <>
          <Text style={{color: colors.text}}>Suggestion</Text>
        </>
      );
    }

    //instagram
    const instagramStoryMention =
      lastMessageContent?.attachments?.[0]?.type === 'story_mention';
    const instagramStoryReplies = lastMessageContent?.storyReplies;
    const instagramDeletedMessage = lastMessageContent?.type === 'isDeleted';
    const instagramShare =
      lastMessageContent?.attachment?.type === 'share' ||
      lastMessageContent?.attachments?.[0]?.type === 'share';

    if (instagramStoryMention) {
      return (
        <>
          <Text style={[styles.text, {color: colors.text}]} numberOfLines={1}>
            story mention
          </Text>
        </>
      );
    }

    //storyReplies
    if (instagramStoryReplies) {
      return (
        <>
          <Text style={[styles.text, {color: colors.text}]} numberOfLines={1}>
            story reply
          </Text>
        </>
      );
    }

    //deletedMessages
    if (instagramDeletedMessage) {
      return (
        <>
          <Text style={[styles.text, {color: colors.text}]} numberOfLines={1}>
            deleted message
          </Text>
        </>
      );
    }

    //instaShare
    if (instagramShare) {
      return (
        <>
          <Text style={[styles.text, {color: colors.text}]} numberOfLines={1}>
            shared post
          </Text>
        </>
      );
    }

    //Facebook

    //Facebook Postback
    if (lastMessageContent?.postback) {
      return (
        <Text style={[styles.text, {color: colors.text}]} numberOfLines={1}>
          {lastMessageContent?.postback?.title ??
            lastMessageContent?.postback?.payload}
        </Text>
      );
    }

    //Facebook fallback attachment not available
    if (
      (lastMessageContent.message?.attachments?.[0]?.type === 'fallback' ||
        lastMessageContent.attachments?.[0]?.type === 'fallback') &&
      (lastMessageContent.message?.attachments?.[0]?.title ||
        lastMessageContent.attachments?.[0]?.title)
    ) {
      const title =
        lastMessageContent.message?.attachments?.[0]?.title ||
        lastMessageContent.attachments?.[0]?.title;
      return (
        <Text style={[styles.text, {color: colors.text}]} numberOfLines={1}>
          {title}
        </Text>
      );
    }

    //Twilio

    //Text SMS
    let text: string;

    if (lastMessageContent?.text?.includes('&Body=' && '&FromCountry=')) {
      const contentStart = '&Body=';
      const contentEnd = '&FromCountry=';
      text = decodeURIComponentMessage(
        lastMessageContent.text,
        contentStart,
        contentEnd,
      );

      return (
        <Text style={[styles.text, {color: colors.text}]} numberOfLines={1}>
          {text}
        </Text>
      );
    }

    //Text Whatsapp
    if (lastMessageContent?.text?.includes('&Body=' && '&To=whatsapp')) {
      const contentStart = '&Body=';
      const contentEnd = '&To=whatsapp';
      text = decodeURIComponentMessage(
        lastMessageContent.text,
        contentStart,
        contentEnd,
      );
      return (
        <Text style={[styles.text, {color: colors.text}]} numberOfLines={1}>
          {text}
        </Text>
      );
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

    //SuggestionResponse
    if (lastMessageContent.suggestionResponse) {
      return (
        <Text style={[styles.text, {color: colors.text}]} numberOfLines={1}>
          {conversation.lastMessage.content.suggestionResponse.text}
        </Text>
      );
    }
  };

  return <>{lastMessage(props.conversation)}</>;
};

const styles = StyleSheet.create({
  icon: {
    margin: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Lato',
    textAlignVertical: 'center',
    padding: 0,
    margin: 0,
  },
});
