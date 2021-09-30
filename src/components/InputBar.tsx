import React, {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, TextInput, TouchableOpacity} from 'react-native';
import {View, StyleSheet} from 'react-native';
import {
  colorAiryBlue,
  colorBackgroundGray,
  colorLightGray,
} from '../assets/colors';
import Paperplane from '../assets/images/icons/paperplane.svg';
import {Conversation} from '../model/Conversation';
import {getOutboundMapper} from '../render/outbound';
import {RealmDB} from '../storage/realm';
import {api} from '../api';

type InputBarProps = {
  conversationId: string;
  extended: boolean;
  setExtended: (extended: boolean) => void;
};

export const InputBar = (props: InputBarProps) => {
  const {conversationId, extended, setExtended} = props;
  const [input, setInput] = useState('');
  const [inputHeight, setInputHeight] = useState(33);
  const collapsedWidth = width * 0.65;
  const extendedWidth = width * 0.83;
  const expandAnimation = useRef(new Animated.Value(collapsedWidth)).current;
  const realm = RealmDB.getInstance();

  useEffect(() => {
    const onCollapse = () => {
      Animated.timing(expandAnimation, {
        toValue: collapsedWidth,
        duration: 400,
        useNativeDriver: false,
      }).start();
    };

    const onExpand = () => {
      Animated.timing(expandAnimation, {
        toValue: extendedWidth,
        duration: 400,
        useNativeDriver: false,
      }).start();
    };

    if (input.length >= 20 && !extended) {
      setExtended(!extended);
      onExpand();
    }
    if (input.length < 10 && extended) {
      setExtended(!extended);
      onCollapse();
    }
  }, [
    input,
    setInput,
    extended,
    setExtended,
    collapsedWidth,
    extendedWidth,
    expandAnimation,
  ]);

  const conversation: Conversation | undefined = realm.objectForPrimaryKey(
    'Conversation',
    conversationId,
  );

  const source = conversation && conversation.channel.source;

  const outboundMapper: any = getOutboundMapper(source);

  const sendMessage = (message: string) => {
    if (message.length === 0) {
      return;
    }

    api
      .sendMessages({
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
      });
    setInput('');
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          {
            height: inputHeight < 20 ? 33 : inputHeight + 15,
            width: expandAnimation,
          },
          styles.inputBar,
        ]}>
        <TextInput
          style={[
            {
              height: inputHeight < 20 ? 33 : inputHeight + 15,
              width: extended ? '85%' : '80%',
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
      </Animated.View>
    </View>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  inputBar: {
    backgroundColor: colorBackgroundGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colorLightGray,
    marginRight: 12,
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
