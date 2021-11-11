import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Conversation} from '../model';
import RichCardIcon from '../assets/images/icons/richCardIcon.svg';
import AttachmentTemplate from '../assets/images/icons/attachmentTemplate.svg';

interface SourceMessagePreviewProps {
  conversation: Conversation;
}

const isImageFromGoogleSource = (messageText: string | undefined) => {
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

  const lastMessageIsText = (currentConversation: Conversation) => {
    const lastMessageContent: any = currentConversation.lastMessage.content;

    if (typeof lastMessageContent.text === 'string') {
      if (
        typeof lastMessageContent.text === 'string' &&
        lastMessageContent.text.includes('&Body=' && '&FromCountry=')
      ) {
        const startText = lastMessageContent.text.search('&Body=');
        const endText = lastMessageContent.text.search('&FromCountry=');
        const textLength = endText - startText;
        const enCodedText = lastMessageContent.text.substring(
          startText + 6,
          startText + textLength,
        );
        const replaced = enCodedText.split('+').join(' ');
        const text = decodeURIComponent(replaced);
        return <Text>{text}</Text>;
      } else if (lastMessageContent.text.includes('&Body=' && '&To=whatsapp')) {
        const startText = lastMessageContent.text.search('&Body=');
        const endText = lastMessageContent.text.search('&To=whatsapp');
        const textLength = endText - startText;
        const enCodedText = lastMessageContent.text.substring(
          startText + 6,
          startText + textLength,
        );
        const replaced = enCodedText.split('+').join(' ');
        const text = decodeURIComponent(replaced);
        return <Text>{text}</Text>;
      }
    }

    if (lastMessageContent.richCard || lastMessageContent.richCardCarousel) {
      return (
        <View style={styles.richCard}>
          <RichCardIcon width={24} height={24} fill="#737373" />
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

    return (
      <View>
        <AttachmentTemplate width={18} height={18} />
      </View>
    );
  };

  return <>{lastMessageIsText(conversation)}</>;
};

const styles = StyleSheet.create({
  richCard: {
    margin: 0,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});
