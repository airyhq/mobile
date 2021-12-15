import React from 'react';
import {View, StyleSheet} from 'react-native';
import Markdown from 'react-native-markdown-display';
import {
  colorTextContrast,
  colorBackgroundBlue,
  colorAiryBlue,
} from '../../../../../assets/colors';

type RichTextRenderProps = {
  text: string;
  fromContact?: boolean;
};

export const RichText = (props: RichTextRenderProps) => {
  const {text, fromContact} = props;
  return (
    <View style={fromContact ? styles.contactContent : styles.memberContent}>
      <Markdown>{text}</Markdown>
    </View>
  );
};

const styles = StyleSheet.create({
  contactContent: {
    width: '100%',
    padding: 10,
    marginTop: 5,
    backgroundColor: colorBackgroundBlue,
    color: colorTextContrast,
    borderRadius: 8,
  },
  memberContent: {
    width: '100%',
    padding: 10,
    marginTop: 5,
    backgroundColor: colorAiryBlue,
    color: 'white',
    borderRadius: 8,
  },
});
