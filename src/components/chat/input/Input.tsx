import React, {useEffect, useRef, useState} from 'react';
import {Animated, TextInput, TouchableOpacity} from 'react-native';
import {View, StyleSheet} from 'react-native';
import {sendMessage} from '../../../api/Messages';
import {
  colorAiryBlue,
  colorBackgroundGray,
  colorLightGray,
} from '../../../assets/colors';
import PaperPlane from '../../../assets/images/icons/paperplane.svg';
import {Conversation} from '../../../model';
import {getOutboundMapper} from '../../../render/outbound';
import {OutboundMapper} from '../../../render/outbound/mapper';
import {RealmDB} from '../../../storage/realm';
import {ATTACHMENT_BAR_ITEM_WIDTH, ATTACHMENT_BAR_ITEM_PADDING} from './config';

type InputBarProps = {
  conversationId: string;
  width: number;
  attachmentBarWidth: number;
  extendedInputBar: boolean;
  setExtendedAttachments: (extended: boolean) => void;
};

const INITIAL_INPUT_HEIGHT = 33;

export const Input = ({
  conversationId,
  width,
  attachmentBarWidth,
  extendedInputBar,
  setExtendedAttachments,
}: InputBarProps) => {
  const [input, setInput] = useState('');
  const [inputHeight, setInputHeight] = useState(INITIAL_INPUT_HEIGHT);

  const extendedInputBarRef = useRef<boolean>();
  const inputBarRef = useRef<TextInput>();

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
      collapseInputBar();
    } else if (input.length < 10 && extendedInputBar) {
      setExtendedAttachments(true);
      expandInputBar();
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

  const collapseInputBar = () => {
    Animated.timing(expandAnimation, {
      toValue:
        width - (ATTACHMENT_BAR_ITEM_WIDTH + ATTACHMENT_BAR_ITEM_PADDING),
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Animated.View style={[styles.container, {width: expandAnimation}]}>
      <View
        style={[
          {
            height: inputHeight < 20 ? 33 : inputHeight + 16,
          },
          styles.inputBar,
        ]}>
        <TextInput
          ref={inputBarRef}
          style={[
            {
              height: inputHeight < 20 ? 33 : inputHeight + 16,
              width: extendedInputBar ? '85%' : '80%',
            },
            styles.textInput,
          ]}
          placeholder="Message"
          value={input}
          onChangeText={(text: string) => setInput(text)}
          multiline={true}
          autoFocus={false}
          onContentSizeChange={e =>
            setInputHeight(e.nativeEvent.contentSize.height)
          }
        />
        <TouchableOpacity
          onPress={() => onSendMessage(input)}
          style={styles.sendButton}
          disabled={input.length === 0}>
          <PaperPlane width={16} height={16} fill="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
  },
  inputBar: {
    backgroundColor: colorBackgroundGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colorLightGray,
    paddingLeft: 10,
  },
  textInput: {
    fontFamily: 'Lato',
    alignSelf: 'flex-end',
    fontSize: 16,
    paddingTop: 8,
  },
  sendButton: {
    borderRadius: 50,
    backgroundColor: colorAiryBlue,
    height: 24,
    width: 24,
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
    marginBottom: 4,
  },
});
