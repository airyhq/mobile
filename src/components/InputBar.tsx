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
import {getOutboundMapper} from '../render/outbound';
import {RealmDB} from '../storage/realm';

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
  const extendAnimation = useRef(new Animated.Value(collapsedWidth)).current;
  const collapseAnimation = useRef(new Animated.Value(extendedWidth)).current;
  const realm = RealmDB.getInstance();

  useEffect(() => {
    if (input.length >= 20 && !extended) {
      setExtended(!extended);
      // onExpand();
    }
    if (input.length < 10 && extended) {
      setExtended(!extended);
      // onCollapse();
    }
  }, [input, setInput]);

  const conversation: any = realm.objectForPrimaryKey(
    'Conversation',
    conversationId,
  );

  const source: any = conversation && conversation.channel.source;

  const outboundMapper: any = getOutboundMapper(source);

  const sendMessage = (conversationId: string, message: string) => {
    if (message.length === 0) return;

    HttpClientInstance.sendMessages({
      conversationId: conversation.id,
      message: outboundMapper.getTextPayload(input),
    })
      .then((response: any) => {
        realm.write(() => {
          const conversation = realm.objectForPrimaryKey(
            'Message',
            conversationId,
          );

          if (conversation) {
            realm.delete(conversation);
          }
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
        console.log('Error: SEND', error);
      });
    setInput('');
  };

  const onCollapse = () => {
    Animated.timing(collapseAnimation, {
      toValue: 300,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const onExpand = () => {
    Animated.timing(extendAnimation, {
      toValue: 300,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          {
            height: inputHeight < 20 ? 33 : inputHeight + 15,
            width: extended ? extendedWidth : collapsedWidth,
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
          autoFocus={true}
          onContentSizeChange={e =>
            setInputHeight(e.nativeEvent.contentSize.height)
          }
        />
        <TouchableOpacity
          onPress={() => sendMessage(conversationId, input)}
          style={styles.sendButton}
          disabled={input.length === 0}>
          <Paperplane width={16} height={16} fill="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width * 0.65,
    justifyContent: 'center',
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
    marginRight: 16,
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
