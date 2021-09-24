import React, {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, TextInput, TouchableOpacity} from 'react-native';
import {View, StyleSheet} from 'react-native';
import {
  colorAiryBlue,
  colorBackgroundGray,
  colorLightGray,
} from '../assets/colors';
import Paperplane from '../assets/images/icons/paperplane.svg';
import {HttpClientInstance} from '../InitializeAiryApi';
import {Conversation} from '../model/Conversation';
import {getOutboundMapper} from '../render/outbound';
import {RealmDB} from '../storage/realm';

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
  const realm = RealmDB.getInstance();

  console.log(extendedInputBar);
  
  const inputBarWidth = extendedInputBar ? width - 36 : width - attachmentBarWidth;
  const expandAnimation = useRef(new Animated.Value(inputBarWidth)).current;

  useEffect(() => {
    if (input.length >= 20 && !extendedInputBar) {
      setExtendedAttachments(false);
      onExpand();
    } else if (input.length < 10 && extendedInputBar) {      
      setExtendedAttachments(true);
      onCollapse();      
    }
  }, [input, setInput]);

  const conversation: Conversation | undefined = realm.objectForPrimaryKey(
    'Conversation',
    conversationId,
  );

  const source = conversation && conversation.channel.source;

  const outboundMapper: any = getOutboundMapper(source);

  const sendMessage = (message: string) => {
    if (message.length === 0) return;

    HttpClientInstance.sendMessages({
      conversationId: conversation.id,
      message: outboundMapper.getTextPayload(input),
    })
      .then((response: any) => {
        realm.write(() => {
          realm.create('Message', {
            id: response.id,
            content: {text: response.content.text},
            deliveryState: response.deliveryState,
            fromContact: response.fromContact,
            sentAt: response.sentAt,
            metadata: response.metadata,
          });
        });
      })
      .catch((error: Error) => {
        console.log('Error: ', error);
      });
    setInput('');
  };

  const onCollapse = () => {
    Animated.timing(expandAnimation, {
      toValue: width - attachmentBarWidth,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const onExpand = () => {
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
    backgroundColor: 'green',
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
