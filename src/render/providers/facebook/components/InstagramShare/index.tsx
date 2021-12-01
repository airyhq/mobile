import React from 'react';
import {StyleSheet, Text, View, Linking, TouchableOpacity} from 'react-native';
import RightArrowIcon from '../../../../../assets/images/icons/rightArrow.svg';
import {
  colorBackgroundBlue,
  colorTextContrast,
  colorAiryBlue,
} from '../../../../../assets/colors';
import {ImageWithFallback} from '../../../../components/ImageWithFallback';

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
        <View style={styles.container}>
          <Text style={styles.shareText} onPress={() => Linking.openURL(url)}>
            Shared Post
          </Text>
          <RightArrowIcon fill={colorTextContrast} style={styles.icon} />
        </View>
      </View>

      <TouchableOpacity onPress={() => Linking.openURL(url)}>
        <ImageWithFallback src={url} imageStyle={styles.sharedPost} />
      </TouchableOpacity>
    </>
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareText: {
    color: colorTextContrast,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
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
  },
});
