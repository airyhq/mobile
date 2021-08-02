import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import NoChat from '../../../assets/images/icons/chat_icon.svg';

interface NoConversationsProps {
  conversations: number;
}

export const NoConversations = (props: NoConversationsProps) => {
  return props.conversations === 0 ? (
    <View style={styles.component}>
      <NoChat width={100} height={100} fill="#1578d4" />
      <Text style={styles.boldText}>Your new messages will appear here</Text>
      <Text style={styles.text}>
        We start showing messages from the moment you connect a channel. Your
        conversations will appear here as soon as your contacts message you.
      </Text>
    </View>
  ) : (
    <View style={styles.component}>
      <Text style={styles.boldText}>Nothing found</Text>
      <Text style={styles.text}>
        We could not find a conversation matching your criterias.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  component: {
    alignItems: 'center',
    marginLeft: 32,
    marginRight: 32,
  },
  boldText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  text: {
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'center',
  },
});
