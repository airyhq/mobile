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
      <Text style={styles.deletedMessageText}>Message deleted</Text>
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
  deletedMessageText: {
    fontStyle: 'italic',
  },
});
