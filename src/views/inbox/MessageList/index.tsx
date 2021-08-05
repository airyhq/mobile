import React from 'react';
import {Dimensions} from 'react-native';
import {StyleSheet, SafeAreaView} from 'react-native';

type MessageListProps = {};

const MessageList = (props: MessageListProps) => {
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
