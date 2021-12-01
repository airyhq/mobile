import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  colorBackgroundBlue,
  colorTextContrast,
  colorAiryBlue,
} from '../../../../../assets/colors';

interface DeletedMessageProps {
  fromContact?: boolean;
}

export const DeletedMessage = ({fromContact}: DeletedMessageProps) => {
  return (
    <View
      style={[
        styles.bubble,
        fromContact ? styles.contactContent : styles.memberContent,
      ]}>
      <Text
        style={[
          styles.text,
          fromContact ? styles.contactContentText : styles.memberContentText,
        ]}>
        Message deleted
      </Text>
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
    backgroundColor: colorBackgroundBlue,
    alignItems: 'baseline',
  },
  memberContent: {
    backgroundColor: colorAiryBlue,
    alignItems: 'baseline',
  },
  text: {
    fontStyle: 'italic',
    fontFamily: 'Lato',
    fontSize: 16,
  },
  contactContentText: {
    color: colorTextContrast,
  },
  memberContentText: {
    color: 'white',
  },
});
