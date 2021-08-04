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

    if (typeof lastMessageContent === 'string') {
      if (
        typeof lastMessageContent === 'string' &&
        lastMessageContent.includes('&Body=' && '&FromCountry=')
      ) {
        const startText = lastMessageContent.search('&Body=');
        const endText = lastMessageContent.search('&FromCountry=');
        const textLength = endText - startText;
        const enCodedText = lastMessageContent.substring(
          startText + 6,
          startText + textLength,
        );
        const replaced = enCodedText.split('+').join(' ');
        const text = decodeURIComponent(replaced);
        return text;
      } else if (lastMessageContent.includes('&Body=' && '&To=whatsapp')) {
        const startText = lastMessageContent.search('&Body=');
        const endText = lastMessageContent.search('&To=whatsapp');
        const textLength = endText - startText;
        const enCodedText = lastMessageContent.substring(
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
          {lastMessageContent?.message?.text ||
            conversation.lastMessage.content.text}
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
