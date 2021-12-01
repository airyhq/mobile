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
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingRight: 10,
    paddingBottom: 8,
    paddingLeft: 10,
    marginTop: 5,
  },
  contactContent: {
    fontFamily: 'Lato',
    fontSize: 16,
    backgroundColor: colorBackgroundBlue,
    color: colorTextContrast,
    alignItems: 'baseline',
  },
  memberContent: {
    fontFamily: 'Lato',
    fontSize: 16,
    backgroundColor: colorAiryBlue,
    color: 'white',
    alignItems: 'baseline',
  },
  messageLink: {
    fontWeight: 'normal',
  },
});
