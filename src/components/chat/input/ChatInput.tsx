import React, {useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Source} from '../../../model';
import {Conversation} from '../../../model';
import {RealmDB} from '../../../storage/realm';
import {AttachmentPicker} from './AttachmentPicker';
import {Input} from './Input';
import {
  ATTACHMENT_BAR_ITEM_PADDING,
  ATTACHMENT_BAR_ITEM_WIDTH,
  getAttachments,
} from './config';

type ChatInputProps = {
  conversationId: string;
};

export const MESSAGE_BAR_STANDARD_PADDING = 30;

const windowWidth = Dimensions.get('window').width;

export const ChatInput = (props: ChatInputProps) => {
  const {conversationId} = props;

  const realm = RealmDB.getInstance();
  const source = realm.objectForPrimaryKey<Conversation>(
    'Conversation',
    conversationId,
  ).channel.source;

  const [extendedAttachments, setExtendedAttachments] = useState<boolean>(true);

  const attachmentBarWidth =
    getAttachments(Source[source]).length *
    (ATTACHMENT_BAR_ITEM_WIDTH + ATTACHMENT_BAR_ITEM_PADDING);

  return (
    <View style={styles.contentBar}>
      <AttachmentPicker
        attachmentTypes={getAttachments(Source[source])}
        attachmentBarWidth={attachmentBarWidth}
        extendedAttachments={extendedAttachments}
        setExtendedAttachments={setExtendedAttachments}
      />
      <Input
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
    width: windowWidth,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
});
