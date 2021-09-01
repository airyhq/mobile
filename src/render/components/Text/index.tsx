import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Hyperlink from 'react-native-hyperlink';
import {
  colorBackgroundBlue,
  colorTextContrast,
  colorAiryBlue,
} from '../../../assets/colors';

type TextRenderProps = {
  text: string;
  fromContact?: boolean;
};

export const TextComponent = ({text, fromContact}: TextRenderProps) => {
  return (
    <View
      style={[
        styles.bubble,
        fromContact ? styles.contactContent : styles.memberContent,
      ]}>
      <Hyperlink linkDefault={true} linkStyle={styles.messageLink}>
        <Text
          style={fromContact ? styles.contactContent : styles.memberContent}>
          {text}
        </Text>
      </Hyperlink>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 5,
    paddingLeft: 10,
    marginTop: 5,
  },
  contactContent: {
    fontFamily: 'Lato',
    backgroundColor: colorBackgroundBlue,
    color: colorTextContrast,
  },
  memberContent: {
    fontFamily: 'Lato',
    backgroundColor: colorAiryBlue,
    color: 'white',
  },
  messageLink: {
    fontWeight: 'normal',
  },
});
