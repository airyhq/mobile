import React from 'react';
import {Dimensions, View} from 'react-native';
import {StyleSheet, SafeAreaView} from 'react-native';
import { InputBar } from '../../../components/InputBar';

type MessageListProps = {
  route: any
};

const MessageList = (props: MessageListProps) => {
  const {route} = props;
  return <SafeAreaView style={styles.container}>
    <View style={styles.messageList} />
    <InputBar conversationId={route.params.conversationId}/>
  </SafeAreaView>;
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
