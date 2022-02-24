import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Linking,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import Microphone from '../assets/images/icons/microphone.svg';
import MicrophoneFilled from '../assets/images/icons/microphone_filled.svg';
import {colorAiryAccent, colorRedAlert, colorTextGray} from '../assets/colors';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import SoundRecorder from 'react-native-sound-recorder';
import {formatSecondsAsTime} from '../services/dates/format';
import {sendMessage, uploadMedia, uploadMediaBlob} from '../api/Message';
import RNFS, {ReadDirItem} from 'react-native-fs';
import {OutboundMapper} from '../render/outbound/mapper';
import {getOutboundMapper} from '../render/outbound';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {hapticFeedbackOptions} from '../services/HapticFeedback';

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
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const countRef = useRef(null);
  let currentTranslationX = useRef(0).current;
  let translateXColor = useRef(new Animated.Value(0)).current;
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
        }))
          .then(() => {
            console.log('started recording');
            handleStartTimer();
          })
          .catch((error: Error) => {
            console.error(error);
          });
  };

  const stopRecord = (deleted?: boolean) => {
    console.log('stopped recording'),
      setIsRecording(false),
      props.setRecording(false),
      deleted
        ? SoundRecorder.stop()
        : SoundRecorder.stop().then(() => {
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
                      )
                        .then(() => {
                          // deleteRecord();
                        })
                        .catch((error: Error) => {
                          console.error(error);
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
    console.log('DELETED recording');
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
        translateXColor.setValue(gestureState.dx);

        currentTranslationX <= -80 &&
          setRecordText(
            'Tap and hold to record and send voice messages Swip to the left side to cancel your message',
          );
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        currentTranslationX <= -80
          ? (stopRecord(true), deleteRecord())
          : stopRecord();
        currentTranslationX = 0;
        translateXColor.setValue(0);
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

  const transitionColor = translateXColor.interpolate({
    inputRange: [-200, -130, 0, 200],
    outputRange: [
      colorRedAlert,
      colorRedAlert,
      colorAiryAccent,
      colorAiryAccent,
    ],
  });

  const opacityTransitionTime = translateXColor.interpolate({
    inputRange: [-80, 0],
    outputRange: [0, 1],
  });

  const opacityTransitionCancel = translateXColor.interpolate({
    inputRange: [-140, -80, 0],
    outputRange: [1, 0, 0],
  });

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, {opacity: opacityTransitionTime}]}>
        {recordText}
      </Animated.Text>
      <Animated.Text
        style={[
          styles.timer,
          {
            color: colorRedAlert,
            opacity: opacityTransitionCancel,
          },
        ]}>
        Cancel
      </Animated.Text>
      <Animated.Text
        style={[
          styles.timer,
          {
            opacity: opacityTransitionTime,
          },
        ]}>
        {formatSecondsAsTime(timer)}
      </Animated.Text>
      <Animated.View
        style={[styles.circle, {backgroundColor: transitionColor}]}
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
    marginTop: 26,
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
    position: 'absolute',
    bottom: 180,
    left: Dimensions.get('screen').width / 2 - 21,
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
