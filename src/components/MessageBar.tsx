import React, {useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {AttachmentBar} from './AttachmentBar';
import {InputBar} from './InputBar';

type MessageBarProps = {
  conversationId: string;
};

export const MessageBar = (props: MessageBarProps) => {
  const {conversationId} = props;
  const [extended, setExtended] = useState<boolean>();

  const extend = (extended: boolean) => {
    setExtended(extended);
  };

  return (
    <View style={styles.contentBar}>
      <AttachmentBar extended={!extended} setExtended={extend} />
      <InputBar
        conversationId={conversationId}
        extended={!!extended}
        setExtended={extend}
      />
    </View>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  contentBar: {
    width: width,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
});
