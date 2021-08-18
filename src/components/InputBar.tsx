import React, {useState} from 'react';
import {Dimensions, Pressable, TextInput} from 'react-native';
import {View, StyleSheet} from 'react-native';
import {
  colorAiryBlue,
  colorBackgroundGray,
  colorLightGray,
} from '../assets/colors';
import Paperplane from '../assets/images/icons/paperplane.svg';
import {HttpClientInstance} from '../InitializeAiryApi';
import {parseToRealmMessage} from '../model';
import { getOutboundMapper } from '../render/outbound';
import {RealmDB} from '../storage/realm';

type InputBarProps = {
  conversationId: string;
};

export const InputBar = (props: InputBarProps) => {
  const {conversationId} = props;
  const [input, setInput] = useState('');
  const [inputHeight, setInputHeight] = useState(33);
  const realm = RealmDB.getInstance();

  const conversation:any = realm.objectForPrimaryKey(
    'Conversation',
    conversationId,
  );

  const source:any = conversation && conversation.channel.source

  const outboundMapper:any = getOutboundMapper(source);

  const sendMessage = (conversationId: string, message: string) => {

    if(message.length === 0) return; 

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
          realm.create(
            'Message',
            {
                id: response.id,
                content: {'text': response.content.text},
                deliveryState: response.deliveryState,
                fromContact: response.fromContact,
                sentAt: response.sentAt,
                metadata: response.metadata,
              },
          );
        });
      })
      .catch((error: Error) => {
        console.log('Error: SEND', error);
      });
    setInput('');
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          {height: inputHeight < 20 ? 33 : inputHeight + 15},
          styles.inputBar,
        ]}>
        <TextInput
          style={[
            {height: inputHeight < 20 ? 33 : inputHeight + 15},
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
        <Pressable
          onPress={() => sendMessage(conversationId, input)}
          style={styles.sendButton}>
          <Paperplane width={16} height={16} fill="white" />
        </Pressable>
      </View>
    </View>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 200,
    left: 0,
    width: width,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  inputBar: {
    backgroundColor: `${colorBackgroundGray}`,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${colorLightGray}`,
    marginLeft: 8,
    marginRight: 8,
    paddingLeft: 10,
  },
  textInput: {
    alignSelf: 'flex-end',
    width: '90%',
    borderRadius: 16,
    paddingTop: 10,
  },
  sendButton: {
    borderRadius: 50,
    backgroundColor: `${colorAiryBlue}`,
    height: 24,
    width: 24,
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
    marginBottom: 4,
  },
});
