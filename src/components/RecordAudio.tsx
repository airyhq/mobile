import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Linking,
  Animated,
  PanResponder,
} from 'react-native';
import Microphone from '../assets/images/icons/microphone.svg';
import MicrophoneFilled from '../assets/images/icons/microphone_filled.svg';
import {colorAiryAccent, colorRedAlert, colorTextGray} from '../assets/colors';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import SoundRecorder from 'react-native-sound-recorder';
import {formatSecondsAsTime} from '../services/dates/format';
import {sendMessage, uploadMedia} from '../api/Message';
import RNFS, {ReadDirItem} from 'react-native-fs';
import {OutboundMapper} from '../render/outbound/mapper';
import {getOutboundMapper} from '../render/outbound';
import {Buffer} from 'buffer';

type RecordAudioProps = {
  setRecording: (recording: boolean) => void;
  setRecordVisible: (visible: boolean) => void;
  conversationId: string;
  source: string;
};

export const RecordAudio = (props: RecordAudioProps) => {
  const [recordText, setRecordText] = useState(
    'Tap and hold to record and send voice messages Swip to the left side to cancel your message',
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cancelAudioRecord, setCancelAudioRecord] = useState(false);
  const [recordButtonBackground, setRecordButtonBackground] =
    useState(colorAiryAccent);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const countRef = useRef(null);
  let currentTranslationX = useRef(0).current;
  let hasPermissions = useRef(false).current;
  const outboundMapper: OutboundMapper = getOutboundMapper(props.source);
  const filePath = RNFS.DocumentDirectoryPath + '/newFile.aac';

  const requestMicrophonePermission = () => {
    request(PERMISSIONS.IOS.MICROPHONE).then(result => {
      result === 'granted' && (hasPermissions = true);
      result === 'blocked' &&
        Alert.alert(
          'To record a Voice Message, Airy needs access to your microphone. Tap Settings and turn on Microphone',
          '',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Settings', onPress: () => Linking.openSettings()},
          ],
        );
    });
  };

  useEffect(() => {
    isRecording
      ? setRecordText('Stop to hold the button to send the vocal message')
      : setRecordText(
          'Tap and hold to record and send voice messages Swip to the left side to cancel your message',
        );
  }, [isRecording]);

  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = () => {
    check(PERMISSIONS.IOS.MICROPHONE)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
          case RESULTS.DENIED:
          case RESULTS.BLOCKED:
            hasPermissions = false;
            break;
          case RESULTS.LIMITED:
          case RESULTS.GRANTED:
            hasPermissions = true;
            break;
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const audioRecordOptions = {
    sampleRate: 44100, // default 44100
    channels: 1, // 1 or 2, default 1
    bitRate: 16, // 8 or 16, default 16
    quality: 'QUALITY_MAX',
  };

  const startRecord = () => {
    hasPermissions === false
      ? requestMicrophonePermission()
      : (setIsRecording(true),
        props.setRecording(true),
        props.setRecordVisible(true),
        SoundRecorder.start(filePath, {
          audioRecordOptions,
        }).then(() => {
          console.log('started recording');
          handleStartTimer();
        }));
  };

  const stopRecord = (deleted?: boolean) => {
    setIsRecording(false);
    props.setRecording(false);
    deleted
      ? SoundRecorder.stop()
      : SoundRecorder.stop().then(() => {
          handlePauseTimer();
          return RNFS.readDir(RNFS.DocumentDirectoryPath)
            .then((res: ReadDirItem[]) => {
              let newFile: ReadDirItem;
              res.forEach((file: ReadDirItem) => {
                if (file.name === 'newFile.aac') {
                  newFile = file;
                }
              });
              newFile &&
                uploadMedia(newFile)
                  .then(res => {
                    sendMessage(
                      props.conversationId,
                      outboundMapper.getAttachmentPayload(res),
                    ).then(() => {
                      return RNFS.unlink(filePath);
                    });
                  })
                  .catch((error: Error) => {
                    console.error(error);
                  });
            })
            .catch((error: Error) => {
              console.error(error);
            });
        });
  };

  const deleteRecord = () => {
    return RNFS.unlink(filePath);
  };

  const panResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        startRecord();
      },
      onPanResponderMove: (evt, gestureState) => {
        currentTranslationX = gestureState.dx;
        currentTranslationX <= -80 &&
          setRecordText(
            'Tap and hold to record and send voice messages Swip to the left side to cancel your message',
          );

        currentTranslationX <= -80
          ? (setRecordButtonBackground(colorRedAlert),
            setCancelAudioRecord(true))
          : (setRecordButtonBackground(colorAiryAccent),
            setCancelAudioRecord(false));
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        currentTranslationX <= -80
          ? (stopRecord(true),
            deleteRecord(),
            setRecordButtonBackground(colorAiryAccent),
            setCancelAudioRecord(false))
          : stopRecord();
        currentTranslationX = 0;
        handleResetTimer();
      },
      onPanResponderTerminate: (evt, gestureState) => {},
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    }),
  ).current;

  const handleStartTimer = () => {
    setIsActive(true);
    setIsPaused(true);
    countRef.current = setInterval(() => {
      setTimer(timer => timer + 1);
    }, 1000);
  };

  const handlePauseTimer = () => {
    clearInterval(countRef.current);
    setIsPaused(false);
  };

  // const handleResumeTimer = () => {
  //   setIsPaused(true);
  //   countRef.current = setInterval(() => {
  //     setTimer(timer => timer + 1);
  //   }, 1000);
  // };

  const handleResetTimer = () => {
    clearInterval(countRef.current);
    setIsActive(false);
    setIsPaused(false);
    setTimer(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{recordText}</Text>
      {cancelAudioRecord ? (
        <Text style={[styles.timer, {color: colorRedAlert}]}>Cancel</Text>
      ) : (
        <Text style={styles.timer}>{timer}</Text>
      )}
      <Animated.View
        style={[styles.circle, {backgroundColor: recordButtonBackground}]}
        {...panResponder.panHandlers}>
        {isRecording ? (
          <MicrophoneFilled height={58} width={35} color="white" />
        ) : (
          <Microphone height={58} width={35} color="white" />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 270,
    marginTop: 46,
  },
  text: {
    fontFamily: 'Lato',
    fontSize: 16,
    textAlign: 'center',
    color: colorTextGray,
    minHeight: 60,
    marginHorizontal: 16,
  },
  timer: {
    fontFamily: 'Lato',
    fontSize: 16,
    marginTop: 15,
    color: colorTextGray,
  },
  circle: {
    position: 'absolute',
    bottom: 17,
    height: 126,
    width: 126,
    borderRadius: 126,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
