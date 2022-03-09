import React, {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, StyleSheet, View} from 'react-native';
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
import {RecordAudio} from '../../RecordAudio';

type ChatInputProps = {
  conversationId: string;
};

export const MESSAGE_BAR_STANDARD_PADDING = 30;

const windowWidth = Dimensions.get('window').width;

export const ChatInput = (props: ChatInputProps) => {
  const {conversationId} = props;
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordVisible, setRecordVisible] = useState(false);
  const [closeRecordContainer, setCloseRecordContainer] = useState(false);
  const slideInAnim = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    closeRecordContainer && slideIn().then(() => setRecordVisible(false));
  }, [closeRecordContainer]);

  const handleIsRecording = (recording: boolean) => {
    setIsRecordingAudio(recording);
  };
  const handleIsVisible = (visible: boolean) => {
    visible
      ? slideOut()
          .then(() => setRecordVisible(true))
          .catch((error: Error) => {
            console.error(error);
          })
      : slideIn()
          .then(() => setRecordVisible(false))
          .catch((error: Error) => {
            console.error(error);
          });
  };

  const handleCloseRecord = (closed: boolean) => {
    setCloseRecordContainer(closed);
  };

  const slideIn = () => {
    return new Promise(resolve => {
      Animated.timing(slideInAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        resolve('resolve');
      });
    });
  };

  const slideOut = () => {
    return new Promise(resolve => {
      Animated.timing(slideInAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: false,
      }).start();
      resolve('resolve');
    });
  };

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
        {/* <AttachmentPicker
          attachmentTypes={getAttachments(Source[source])}
          attachmentBarWidth={attachmentBarWidth}
          extendedAttachments={extendedAttachments}
          setExtendedAttachments={setExtendedAttachments}
        /> */}
        <Input
          width={windowWidth - MESSAGE_BAR_STANDARD_PADDING}
          // attachmentBarWidth={attachmentBarWidth}
          attachmentBarWidth={0}
          conversationId={conversationId}
          extendedInputBar={!extendedAttachments}
          setExtendedAttachments={setExtendedAttachments}
          channelConnected={channelConnected}
          isRecordingAudio={isRecordingAudio}
          setIsRecordScreenVisible={handleIsVisible}
          setCloseRecord={handleCloseRecord}
        />
      </View>
      {recordVisible && (
        <Animated.View
          style={{
            height: slideInAnim,
          }}>
          <RecordAudio
            setRecording={handleIsRecording}
            setRecordVisible={handleIsVisible}
            conversationId={conversationId}
            source={source}
          />
        </Animated.View>
      )}
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
