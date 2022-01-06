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
import {Tooltip} from '../../../componentsLib';

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

  const channelConnected = realm.objectForPrimaryKey<Conversation>(
    'Conversation',
    conversationId,
  ).channel.connected;

  const [extendedAttachments, setExtendedAttachments] = useState<boolean>(true);

  const attachmentBarWidth =
    getAttachments(Source[source]).length *
    (ATTACHMENT_BAR_ITEM_WIDTH + ATTACHMENT_BAR_ITEM_PADDING);

  return (
    <>
      {!channelConnected && (
        <View style={styles.tooltipContainer}>
          <Tooltip
            text="Sending messages is disabled because this channel was disconnected."
            arrow
          />
        </View>
      )}
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
          channelConnected={channelConnected}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  contentBar: {
    width: windowWidth,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  tooltipContainer: {
    bottom: 50,
    right: 0,
    left: 0,
    position: 'absolute',
  },
});
