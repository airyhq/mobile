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
  fallback: string;
  fromContact?: boolean;
};

export const RichText = (props: RichTextRenderProps) => {
  const {text, fallback, fromContact} = props;
  return (
    <View
      style={[
        styles.bubble,
        fromContact ? styles.contactContent : styles.memberContent,
      ]}>
      <Markdown
        style={{text: fromContact ? styles.contactText : styles.memberText}}>
        {text || fallback}
      </Markdown>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginTop: 5,
  },
  contactContent: {
    backgroundColor: colorBackgroundBlue,
    alignSelf: 'flex-start',
  },
  contactText: {
    fontFamily: 'Lato',
    fontSize: 16,
    color: colorTextContrast,
    alignSelf: 'flex-start',
  },
  memberContent: {
    backgroundColor: colorAiryBlue,
    alignSelf: 'flex-end',
  },
  memberText: {
    fontFamily: 'Lato',
    fontSize: 16,
    color: 'white',
    alignSelf: 'flex-start',
  },
});
