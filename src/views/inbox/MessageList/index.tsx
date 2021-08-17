import React from 'react';
<<<<<<< HEAD
import {useEffect} from 'react';
import {Dimensions} from 'react-native';
import {StyleSheet, SafeAreaView} from 'react-native';
import {HttpClientInstance} from '../../../InitializeAiryApi';

type MessageListProps = {
  route: any;
};

const listMessages = (
  conversationId: string,
  cursor?: string,
  page_size?: string,
) => {
  HttpClientInstance.listMessages({conversationId})
    .then((response: any) => {})
    .catch((error: Error) => {
      console.log('Error: ', error);
    });
=======
import {Dimensions, View} from 'react-native';
import {StyleSheet, SafeAreaView} from 'react-native';
import { InputBar } from '../../../components/InputBar';

type MessageListProps = {
  route: any
>>>>>>> c10546d (created inputBar)
};

const MessageList = (props: MessageListProps) => {
  const {route} = props;
<<<<<<< HEAD
  const conversationId = route.params.conversationId;

  useEffect(() => {
    listMessages(conversationId);
  }, []);

  return <SafeAreaView style={styles.container}></SafeAreaView>;
=======
  return <SafeAreaView style={styles.container}>
    <View style={styles.messageList} />
    <InputBar conversationId={route.params.conversationId}/>
  </SafeAreaView>;
>>>>>>> c10546d (created inputBar)
};

export default MessageList;

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: 'white',
  },
  messageList: {
    flex: 0.5,
    backgroundColor: 'blue'
  }
});
