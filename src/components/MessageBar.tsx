import React, {useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import { Source } from '../model/Channel';
import {Conversation} from '../model/Conversation';
import {RealmDB} from '../storage/realm';
import {AttachmentBar} from './AttachmentBar';
import {InputBar} from './InputBar';

type MessageBarProps = {
  conversationId: string;
  items: number;
};

export enum SupportedType {
  photo = 'photo',
  file = 'file',
  template = 'template',
}

export const MESSAGE_BAR_STANDARD_PADDING = 30;
export const ATTACHMENT_BAR_ITEM_WIDTH = 24;
export const ATTACHMENT_BAR_ITEM_HEIGHT = 24;
export const ATTACHMENT_BAR_ITEM_PADDING = 12;

const windowWidth = Dimensions.get('window').width;

export const MessageBar = (props: MessageBarProps) => {
  const {conversationId} = props;

  const realm = RealmDB.getInstance();
  const source = realm.objectForPrimaryKey<Conversation>(
    'Conversation',
    conversationId,
  ).channel.source;

  const [extendedAttachments, setExtendedAttachments] = useState<boolean>(true);
  
  const attachmentBarWidth = getAttachments(Source[source]).length * (ATTACHMENT_BAR_ITEM_WIDTH + ATTACHMENT_BAR_ITEM_PADDING);    

  return (
    <View style={styles.contentBar}>
      <AttachmentBar
        attachmentTypes={getAttachments(Source[source])}
        attachmentBarWidth={attachmentBarWidth}
        extendedAttachments={extendedAttachments}
        setExtendedAttachments={setExtendedAttachments}
      />
      <InputBar
        width={windowWidth - MESSAGE_BAR_STANDARD_PADDING}
        attachmentBarWidth={attachmentBarWidth}
        conversationId={conversationId}
        extendedInputBar={!extendedAttachments}
        setExtendedAttachments={setExtendedAttachments}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contentBar: {
    backgroundColor: 'red',
    width: windowWidth,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
});

const getAttachments = (source: Source): SupportedType[] => {
  const attachmentArray: SupportedType[] = []
  switch (source) {
    case Source.facebook:
      attachmentArray.push(
        SupportedType.photo,
        SupportedType.template,
        SupportedType.file,
      );
      break;
    case Source.google:
      attachmentArray.push(SupportedType.file, SupportedType.photo);
      break;
    case Source.chatplugin:
      attachmentArray.push(SupportedType.template, SupportedType.file);
      break;
    case Source.viber:
      attachmentArray.push(SupportedType.template);
      break;
    case Source.instagram:
      attachmentArray.push(SupportedType.template);
      break;
    case Source.unknown:
      attachmentArray.push(SupportedType.template);
      break;
    case Source.twilioSms:
    case Source.twilioWhatsapp:
      attachmentArray.push(SupportedType.template);
      break;
  }
  return attachmentArray;
}