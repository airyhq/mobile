import React from 'react';
import { StyleSheet, View } from 'react-native';

interface NoConversationsProps {
  conversations: number;
}

const NoConversations = (props: NoConversationsProps) => {
  return props.conversations === 0 ? (
    <View style={styles.component}>
      <strong>Your new messages will appear here</strong>
      <p>
        We start showing messages from the moment you connect a channel. Your conversations will appear here as soon as
        your contacts message you.
      </p>
    </View>
  ) : (
    <View style={styles.component}>
      <strong>Nothing found</strong>
      <p>We could not find a conversation matching your criterias.</p>
    </View>
  );
};

export default NoConversations;

const styles = StyleSheet.create({
    component: {},
  });
