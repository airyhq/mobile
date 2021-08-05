import React from 'react';
import {Text} from 'react-native';
import {Conversation} from '../model';
interface SourceMessagePreviewProps {
  conversation: Conversation;
}

const isImageFromGoogleSource = (messageText: string | undefined) => {
  if (!messageText) return false;

  return (
    messageText.includes('https://storage.googleapis.com') &&
    messageText.toLowerCase().includes('x-goog-algorithm') &&
    messageText.toLowerCase().includes('x-goog-credential')
  );
};

export const SourceMessagePreview = (props: SourceMessagePreviewProps) => {
  const {conversation} = props;

  const lastMessageIsText = (conversation: Conversation) => {
    const lastMessageContent: any = conversation.lastMessage.content;

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
        return text;
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
        return text;
      }
    }

    if (
      (lastMessageContent.text || lastMessageContent.message?.text) &&
      !isImageFromGoogleSource(lastMessageContent.message?.text)
    ) {
      return (
        <Text>
          {lastMessageContent?.message?.text || lastMessageContent?.text}
        </Text>
      );
    } else if (lastMessageContent.suggestionResponse) {
      return <Text>{lastMessageContent.suggestionResponse?.text}</Text>;
    } else {
      return <Text> Type not supported </Text>;
    }
  };

  return <>{lastMessageIsText(conversation)}</>;
};
