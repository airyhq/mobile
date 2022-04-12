import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Linking,
  Animated,
  PanResponder,
  Vibration,
  Platform,
} from 'react-native';
import Microphone from '../assets/images/icons/microphone.svg';
import MicrophoneFilled from '../assets/images/icons/microphone_filled.svg';
import {colorAiryAccent, colorRedAlert} from '../assets/colors';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import SoundRecorder from 'react-native-sound-recorder';
import {formatSecondsAsTime} from '../services/dates/format';
import {sendMessage, uploadMedia} from '../api/Message';
import RNFS, {ReadDirItem} from 'react-native-fs';
import {OutboundMapper} from '../render/outbound/mapper';
import {getOutboundMapper} from '../render/outbound';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {hapticFeedbackOptions} from '../services/hapticFeedback';
import {debounce} from 'lodash-es';
import {useTheme} from '@react-navigation/native';

type RecordAudioProps = {
  setRecording: (recording: boolean) => void;
  setRecordVisible: (visible: boolean) => void;
  conversationId: string;
  source: string;
};

export const RecordAudio = (props: RecordAudioProps) => {
  const [recordText, setRecordText] = useState(
    'Hold to record and send a voice message \n Swipe left to cancel your message',
  );
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const countRef = useRef(null);
  let currentTranslationX = useRef(0).current;
  let translateX = useRef(new Animated.Value(0)).current;
  let hasPermissions = useRef(false).current;
  let recording = useRef(false).current;
  const outboundMapper: OutboundMapper = getOutboundMapper(props.source);
  const filePath = RNFS.DocumentDirectoryPath + '/newFile.aac';
  const {colors} = useTheme();

  const requestMicrophonePermission = () => {
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.MICROPHONE
        : PERMISSIONS.ANDROID.RECORD_AUDIO,
    ).then(result => {
      result === 'granted' && (hasPermissions = true);
      result === 'blocked' &&
        Alert.alert(
          '',
          'To record a voice message, Airy needs access to your microphone. Tap settings and turn on microphone',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Settings', onPress: () => Linking.openSettings()},
          ],
        );
    });
  };

  useEffect(() => {
    isRecording
      ? setRecordText('Stop holding the button to send your voice message')
      : setRecordText(
          'Hold to record and send a voice message \n Swipe left to cancel your message',
        );
  }, [isRecording]);

  useEffect(() => {
    checkMicrophonePermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkMicrophonePermission = () => {
    check(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.MICROPHONE
        : PERMISSIONS.ANDROID.RECORD_AUDIO,
    )
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

  const vibrate = () => {
    ReactNativeHapticFeedback.trigger('impactHeavy', hapticFeedbackOptions);
  };

  const startRecord = debounce(
    () => {
      hasPermissions === false
        ? requestMicrophonePermission()
        : (vibrate(),
          (recording = true),
          (setIsRecording(true),
          props.setRecording(true),
          props.setRecordVisible(true),
          SoundRecorder.start(filePath, {
            audioRecordOptions,
          }))
            .then(() => {
              handleStartTimer();
            })
            .catch((error: Error) => {
              console.error(error);
            }));
    },
    1500,
    {leading: true, trailing: false},
  );

  const stopRecord = (deleted?: boolean) => {
    recording &&
      (deleted
        ? (SoundRecorder.stop(),
          (recording = false),
          setIsRecording(false),
          props.setRecording(false))
        : SoundRecorder.stop().then(() => {
            recording = false;
            setIsRecording(false);
            props.setRecording(false);
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
                          deleteRecord();
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
          }));
  };

  const deleteRecord = () => {
    return RNFS.unlink(filePath);
  };

  const panResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: () => {
        startRecord();
      },
      onPanResponderMove: (evt, gestureState) => {
        currentTranslationX = gestureState.dx;
        translateX.setValue(gestureState.dx);

        currentTranslationX <= -80 &&
          setRecordText(
            'Hold to record and send a voice message Swipe left to cancel your message',
          );
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: () => {
        currentTranslationX <= -80
          ? (stopRecord(true), deleteRecord(), Vibration.vibrate())
          : stopRecord();
        currentTranslationX = 0;
        translateX.setValue(0);
        handleResetTimer();
      },
      onShouldBlockNativeResponder: () => {
        return true;
      },
    }),
  ).current;

  const handleStartTimer = () => {
    countRef.current = setInterval(() => {
      setTimer(timer => timer + 1);
    }, 1000);
  };

  const handleResetTimer = () => {
    clearInterval(countRef.current);
    setTimer(0);
  };

  const transitionColor = translateX.interpolate({
    inputRange: [-200, -130, 0, 200],
    outputRange: [
      colorRedAlert,
      colorRedAlert,
      colorAiryAccent,
      colorAiryAccent,
    ],
  });

  const opacityTransitionTime = translateX.interpolate({
    inputRange: [-80, 0],
    outputRange: [0, 1],
  });

  const opacityTransitionCancel = translateX.interpolate({
    inputRange: [-140, -80, 0],
    outputRange: [1, 0, 0],
  });

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Animated.Text
        style={[
          styles.text,
          {opacity: opacityTransitionTime, color: colors.text},
        ]}>
        {recordText}
      </Animated.Text>
      <Animated.Text
        style={[
          styles.cancel,
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
            color: colors.text,
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
    paddingTop: 20,
  },
  text: {
    fontFamily: 'Lato',
    fontSize: 16,
    textAlign: 'center',
    height: 60,
    marginHorizontal: 20,
  },
  timer: {
    position: 'relative',
    bottom: 40,
    fontFamily: 'Lato',
    fontSize: 16,
    marginTop: 15,
  },
  cancel: {
    position: 'relative',
    bottom: 7,
    fontFamily: 'Lato',
    fontSize: 16,
    marginTop: 15,
  },
  circle: {
    position: 'absolute',
    bottom: 0,
    height: 126,
    width: 126,
    borderRadius: 126,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
