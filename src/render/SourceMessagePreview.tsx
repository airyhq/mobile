import React from 'react';
// import AttachmentTemplate from '../assets/images/icons/attachmentTemplate.svg';
// import AttachmentImage from '../assets/images/icons/attachmentImage.svg';
// import AttachmentVideo from '../assets/images/icons/attachmentVideo.svg';
// import RichCardIcon from '../assets/images/icons/richCardIcon.svg';
import {View, Text} from 'react-native';
import {Conversation, Message} from '../model';
interface SourceMessagePreviewProps {
  conversation: Conversation;
}
interface FormattedMessageProps {
  message: Message;
}

const FormattedMessage = ({message}: FormattedMessageProps) => {

  if (message?.content) {
    return <>{message.content.text}</>;
  }
  return <>{message.content.text}</>;
};

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
    const lastMessageContent:any = conversation.lastMessage.content;

    if (typeof lastMessageContent === 'string') {
      if (typeof lastMessageContent === 'string' && lastMessageContent.includes('&Body=' && '&FromCountry=')) {
        const startText = lastMessageContent.search('&Body=');
        const endText = lastMessageContent.search('&FromCountry=');
        const textLength = endText - startText;
        const enCodedText = lastMessageContent.substring(startText + 6, startText + textLength);
        const replaced = enCodedText.split('+').join(' ');
        const text = decodeURIComponent(replaced);
        return text;
      } else if (lastMessageContent.includes('&Body=' && '&To=whatsapp')) {
        const startText = lastMessageContent.search('&Body=');
        const endText = lastMessageContent.search('&To=whatsapp');
        const textLength = endText - startText;
        const enCodedText = lastMessageContent.substring(startText + 6, startText + textLength);
        const replaced = enCodedText.split('+').join(' ');
        const text = decodeURIComponent(replaced);
        return text;
      }
    }

    if (
      (lastMessageContent.text || lastMessageContent.message?.text) &&
      !isImageFromGoogleSource(lastMessageContent.message?.text)
    ) {
      return <Text><FormattedMessage message={conversation.lastMessage} /></Text>;
    } else {
      return <Text> Type not supported </Text>;
    }

    // else if (lastMessageContent.suggestionResponse) {
    //   return <Text>{conversation.lastMessage?.content?.suggestionResponse?.text}</Text>;
  };

  // const lastMessageIsIcon = (conversation: Conversation) => {
  //   const lastMessageContent = conversation.lastMessage.content;

  //   //console.log('icon', lastMessageIsIcon)

  //   if (!lastMessageContent.attachment && lastMessageContent !== {}) {
  //     if (
  //       lastMessageContent.message?.attachments?.[0].type === 'image' ||
  //       isImageFromGoogleSource(lastMessageContent.message?.text)
  //     ) {
  //       return <AttachmentImage />;
  //     } else if (lastMessageContent.message?.attachments?.[0].type === 'video') {
  //       return <AttachmentVideo style={{height: '24', width: '24', margin: '0%'}} />;
  //     } else if (lastMessageContent.suggestionResponse) {
  //       return <>{conversation.lastMessage.content.suggestionResponse.text}</>;
  //     } else if (lastMessageContent.image) {
  //       return <AttachmentImage />;
  //     } else if (lastMessageContent.richCard) {
  //       return <RichCardIcon style={{height: '24', width: '24', margin: '0%'}} />;
  //     } 
        
  //   }

  //   return <AttachmentTemplate />;

   
  // };

  return <>{lastMessageIsText(conversation)}</>;
};