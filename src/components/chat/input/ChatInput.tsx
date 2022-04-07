import React, {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, StyleSheet, View} from 'react-native';
import {Conversation} from '../../../model';
import {RealmDB} from '../../../storage/realm';
import {Input} from './Input';
import {Tooltip} from '../../../componentsLib';
import {RecordAudio} from '../../RecordAudio';
import { useTheme } from '@react-navigation/native';

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
  const {colors} = useTheme();

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

  useEffect(() => {
    closeRecordContainer && slideIn().then(() => setRecordVisible(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <View style={[styles.contentBar, {backgroundColor: colors.background}]}>
        <Input
          width={windowWidth - MESSAGE_BAR_STANDARD_PADDING}
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
