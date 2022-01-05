import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Linking} from 'react-native';
import {InstagramMediaPreview} from '../InstagramMediaPreview';
import LinkIcon from '../../../../../assets/images/icons/external-link.svg';
import {
  colorBackgroundBlue,
  colorAiryBlue,
  colorTextGray,
  colorTextContrast,
} from '../../../../../assets/colors';

interface InstagramShareProps {
  url: string;
  fromContact?: boolean;
}

export const Share = ({url, fromContact}: InstagramShareProps) => {
  return (
    <>
      <View
        style={[
          styles.bubble,
          fromContact ? styles.contactContent : styles.memberContent,
        ]}>
        <TouchableOpacity
          style={styles.container}
          onPress={() => Linking.openURL(url)}>
          <Text
            style={[
              styles.shareText,
              {color: fromContact ? colorTextContrast : 'white'},
            ]}>
            Shared Post{' '}
          </Text>
          <LinkIcon fill={fromContact ? colorTextContrast : 'white'} />
        </TouchableOpacity>
      </View>

      <InstagramMediaPreview mediaUrl={url} fromContact={fromContact} />
    </>
  );
};

const styles = StyleSheet.create({
  bubble: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingRight: 10,
    paddingBottom: 8,
    paddingLeft: 10,
    marginTop: 5,
    borderRadius: 20,
  },
  contactContent: {
    alignItems: 'baseline',
    backgroundColor: colorBackgroundBlue,
    color: colorTextContrast,
    fontFamily: 'Lato',
    fontSize: 16,
  },
  memberContent: {
    alignItems: 'baseline',
    fontFamily: 'Lato',
    fontSize: 16,
    backgroundColor: colorAiryBlue,
    color: 'white',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareText: {
    fontStyle: 'italic',
  },
  icon: {
    marginLeft: 4,
    marginRight: 0,
    width: 15,
    height: 15,
  },
  sharedPost: {
    borderRadius: 22,
    width: 150,
    height: 150,
    marginTop: 5,
  },
  fallbackPost: {
    borderWidth: 1,
    borderColor: colorTextGray,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    backgroundColor: 'white',
  },
  previewUnavaiblable: {
    fontStyle: 'italic',
  },
});
