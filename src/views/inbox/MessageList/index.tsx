import React from 'react';
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
};

const MessageList = (props: MessageListProps) => {
  const {route} = props;
  const conversationId = route.params.conversationId;

  useEffect(() => {
    listMessages(conversationId);
  }, []);

  return <SafeAreaView style={styles.container}></SafeAreaView>;
};

export default MessageList;

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: 'white',
  },
});
