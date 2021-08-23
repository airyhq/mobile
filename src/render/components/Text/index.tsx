import React from 'react';
import {StyleSheet, Text} from 'react-native';
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
  return(
    <Hyperlink linkDefault={true} linkStyle={styles.messageLink}>
    <Text style={fromContact ? styles.contactContent : styles.memberContent}>
      {text}
    </Text>
  </Hyperlink>
  ) 
};

const styles = StyleSheet.create({
  textMessage: {
    display: 'flex',
    maxWidth: 500,
    padding: 10,
    marginTop: 5,
    fontFamily: 'Lato',
  },
  contactContent: {
    display: 'flex',
    maxWidth: 500,
    padding: 10,
    marginTop: 5,
    fontFamily: 'Lato',
    backgroundColor: colorBackgroundBlue,
    color: colorTextContrast,
  },
  memberContent: {
    display: 'flex',
    maxWidth: 500,
    padding: 10,
    marginTop: 5,
    fontFamily: 'Lato',
    backgroundColor: colorAiryBlue,
    color: 'white',
  },
  messageLink: {
    fontWeight: 'normal',
  },
});
