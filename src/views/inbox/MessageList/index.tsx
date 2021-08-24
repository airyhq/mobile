import React from 'react';
import {Dimensions, View, StyleSheet, SafeAreaView} from 'react-native';
import {AttachmentBar} from '../../../components/AttachmentBar';
import {InputBar} from '../../../components/InputBar';
import { MessageBar } from '../../../components/MessageBar';

type MessageListProps = {
  route: any;
};

const MessageList = (props: MessageListProps) => {
  const {route} = props;
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.messageList} />
        <View style={styles.contentBar}>
          <MessageBar conversationId={route.params.conversationId}/>
        </View>
      </View>
    </SafeAreaView>
  );
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
    position: 'relative',
    width: width,
    flex: 0.77,
    backgroundColor: 'white',
  },
  contentBar: {
    position: 'absolute',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    left: 0,
    bottom: 150,
    flexDirection: 'row',
  },
});
