import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Keyboard,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {View, StyleSheet} from 'react-native';
import {sendMessage} from '../../../api/Message';
import {
  colorAiryAccent,
  colorAiryBlue,
  colorBackgroundGray,
  colorLightGray,
} from '../../../assets/colors';
import PaperPlane from '../../../assets/images/icons/paperplane.svg';
import Microphone from '../../../assets/images/icons/microphone.svg';
import MicrophoneFilled from '../../../assets/images/icons/microphone_filled.svg';
import {Conversation} from '../../../model';
import {getOutboundMapper} from '../../../render/outbound';
import {OutboundMapper} from '../../../render/outbound/mapper';
import {RealmDB} from '../../../storage/realm';
import {ATTACHMENT_BAR_ITEM_WIDTH, ATTACHMENT_BAR_ITEM_PADDING} from './config';
import { useTheme } from '@react-navigation/native';

type InputBarProps = {
  conversationId: string;
  width: number;
  attachmentBarWidth: number;
  extendedInputBar: boolean;
  setExtendedAttachments: (extended: boolean) => void;
  channelConnected: boolean;
  isRecordingAudio: boolean;
  setIsRecordScreenVisible: (visible: boolean) => void;
  setCloseRecord: (close: boolean) => void;
};

const INITIAL_INPUT_HEIGHT = 33;

export const Input = (props: InputBarProps) => {
  const {
    conversationId,
    width,
    attachmentBarWidth,
    extendedInputBar,
    setExtendedAttachments,
    channelConnected,
    isRecordingAudio,
    setCloseRecord,
  } = props;
  const [input, setInput] = useState('');
  const [inputHeight, setInputHeight] = useState(INITIAL_INPUT_HEIGHT);
  const [recordScreenVisible, setRecordScreenVisible] = useState(false);
  const extendedInputBarRef = useRef<boolean>();
  const inputBarRef = useRef<TextInput>();
  const {colors} = useTheme();

  const realm = RealmDB.getInstance();
  const conversation: Conversation | undefined = realm.objectForPrimaryKey(
    'Conversation',
    conversationId,
  );

  const inputBarWidth = extendedInputBar
    ? width - (ATTACHMENT_BAR_ITEM_WIDTH + ATTACHMENT_BAR_ITEM_PADDING)
    : width - attachmentBarWidth;
  const expandAnimation = useRef(new Animated.Value(inputBarWidth)).current;
  const source = conversation && conversation.channel.source;
  const outboundMapper: OutboundMapper = getOutboundMapper(source);

  useEffect(() => {
    if (
      !extendedInputBar &&
      extendedInputBarRef.current &&
      input.length >= 20
    ) {
      expandInputBar();
      setTimeout(() => {
        setInputHeight(0);
      }, 100);
    }
    extendedInputBarRef.current = extendedInputBar;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extendedInputBar]);

  useEffect(() => {
    if (input.length >= 20 && !extendedInputBar) {
      setExtendedAttachments(false);
    } else if (input.length < 10 && extendedInputBar) {
      setExtendedAttachments(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, setInput]);

  const onSendMessage = (message: string) => {
    if (message.length === 0) {
      return;
    }
    sendMessage(conversation.id, outboundMapper.getTextPayload(input));
    setInput('');
  };

  const expandInputBar = () => {
    Animated.timing(expandAnimation, {
      toValue: width - attachmentBarWidth,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const handleMicrophonePress = () => {
    setRecordScreenVisible(!recordScreenVisible);
    props.setIsRecordScreenVisible(!recordScreenVisible);
    inputBarRef?.current?.isFocused() && Keyboard.dismiss();
  };

  return (
    <Animated.View style={[styles.container, {width: expandAnimation, backgroundColor: colors.background}]}>
      <View
        style={[
          {
            height:
              Platform.OS === 'ios'
                ? inputHeight < 20
                  ? 33
                  : inputHeight + 16
                : 'auto',
            alignItems: 'flex-end',
            backgroundColor: colors.notification,
            borderColor: colors.border
          },
          styles.inputBar,
        ]}>
        <TextInput
          ref={inputBarRef}
          style={[
            {
              height:
                Platform.OS === 'ios'
                  ? inputHeight < 20
                    ? 33
                    : inputHeight + 16
                  : 'auto',
              width: '80%',
              color: colors.text
            },
            styles.textInput,
          ]}
          placeholder="Message"
          placeholderTextColor={colors.border}
          onFocus={() => {
            setCloseRecord(true), setRecordScreenVisible(false);
          }}
          onBlur={() => setCloseRecord(false)}
          value={input}
          onChangeText={(text: string) => setInput(text)}
          multiline={true}
          autoFocus={false}
          onContentSizeChange={e =>
            setInputHeight(e.nativeEvent.contentSize.height)
          }
          editable={channelConnected}
          selectTextOnFocus={channelConnected}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            right: 0,
            bottom: 0,
          }}>
          <TouchableOpacity
            style={{marginBottom: 4, marginRight: 6}}
            onPress={handleMicrophonePress}>
            {isRecordingAudio ? (
              <MicrophoneFilled
                height={23}
                width={14}
                color={colorAiryAccent}
              />
            ) : (
              <Microphone height={23} width={14} color={colorAiryAccent} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onSendMessage(input)}
            style={[
              styles.sendButton,
              {
                backgroundColor:
                  channelConnected && input.length !== 0
                    ? colorAiryBlue
                    : colors.border,
                marginBottom: Platform.OS === 'ios' ? 4 : 6,
              },
            ]}
            disabled={input.length === 0}>
            <PaperPlane width={16} height={16} fill="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
  },
  inputBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    paddingLeft: 10,
  },
  textInput: {
    fontFamily: 'Lato',
    alignSelf: 'center',
    alignItems: 'center',
    fontSize: 16,
    paddingTop: Platform.OS === 'ios' ? 7 : 4,
    paddingBottom: Platform.OS === 'ios' ? 0 : 4,
  },
  sendButton: {
    borderRadius: 50,
    height: 24,
    width: 24,
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
  },
});
