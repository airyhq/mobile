import React, {useEffect, useRef, useState} from 'react';
import {Animated, TextInput, TouchableOpacity} from 'react-native';
import {View, StyleSheet} from 'react-native';
import { sendMessageAPI } from '../api/conversation';
import {
  colorAiryBlue,
  colorBackgroundGray,
  colorLightGray,
} from '../assets/colors';
import Paperplane from '../assets/images/icons/paperplane.svg';
import {Conversation} from '../model/Conversation';
import {getOutboundMapper} from '../render/outbound';
import { OutboundMapper } from '../render/outbound/mapper';
import {RealmDB} from '../storage/realm';
import { ATTACHMENT_BAR_ITEM_PADDING, ATTACHMENT_BAR_ITEM_WIDTH } from './MessageBar';

type InputBarProps = {
  conversationId: string;
  width: number;
  attachmentBarWidth: number;
  extendedInputBar: boolean;
  setExtendedAttachments: (extended: boolean) => void;  
};

export const InputBar = (props: InputBarProps) => {
  const {conversationId, width, attachmentBarWidth, extendedInputBar, setExtendedAttachments} = props;
  const [input, setInput] = useState('');
  const [inputHeight, setInputHeight] = useState(33);
  
  const extendedInputBarRef = useRef<boolean>();

  const realm = RealmDB.getInstance();
  const conversation: Conversation | undefined = realm.objectForPrimaryKey(
    'Conversation',
    conversationId,
  );
  
  const inputBarWidth = extendedInputBar ? width - (ATTACHMENT_BAR_ITEM_WIDTH + ATTACHMENT_BAR_ITEM_PADDING) : width - attachmentBarWidth;
  const expandAnimation = useRef(new Animated.Value(inputBarWidth)).current;
  const source = conversation && conversation.channel.source;
  const outboundMapper: OutboundMapper = getOutboundMapper(source);

  useEffect(() => {    
    if (!extendedInputBar && extendedInputBarRef.current && input.length >= 20) {      
      expandInputBar();
    }    
    extendedInputBarRef.current = extendedInputBar;
  }, [extendedInputBar]) 

  useEffect(() => {
    if (input.length >= 20 && !extendedInputBar) {
      setExtendedAttachments(false);
      collapseInputBar();
    } else if (input.length < 10 && extendedInputBar) {      
      setExtendedAttachments(true);
      expandInputBar();      
    }   
  }, [input, setInput]);  

  const sendMessage = (message: string) => {
    if (message.length === 0) return;
    sendMessageAPI(conversation.id, outboundMapper.getTextPayload(input))    
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
      toValue: width - 36,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Animated.View style={[styles.container, {width: expandAnimation}]}>
      <View
        style={[
          {
            height: inputHeight < 20 ? 33 : inputHeight + 15,
          },
          styles.inputBar,
        ]}>
        <TextInput
          style={[
            {
              height: inputHeight < 20 ? 33 : inputHeight + 15,
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
          onPress={() => sendMessage(input)}
          style={styles.sendButton}
          disabled={input.length === 0}>
          <Paperplane width={16} height={16} fill="white" />
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
    borderRadius: 16,
    paddingTop: 10,
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
