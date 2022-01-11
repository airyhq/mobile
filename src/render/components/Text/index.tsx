import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
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

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingRight: 10,
    paddingBottom: 8,
    paddingLeft: 10,
    marginTop: 5,
    maxWidth: windowWidth / 1.5,
  },
  contactContent: {
    fontFamily: 'Lato',
    fontSize: 16,
    backgroundColor: colorBackgroundBlue,
    color: colorTextContrast,
    alignSelf: 'flex-start',
  },
  memberContent: {
    fontFamily: 'Lato',
    fontSize: 16,
    backgroundColor: colorAiryBlue,
    color: 'white',
    alignSelf: 'flex-end',
  },
  messageLink: {
    fontWeight: 'normal',
  },
});
