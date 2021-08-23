import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';

type AvatarProps = {
  avatarUrl: string;
  small?: boolean;
};
const fallbackAvatar = 'https://s3.amazonaws.com/assets.airy.co/unknown.png';

export const Avatar = ({avatarUrl, small}: AvatarProps) => {
  return (
    <Image
      style={small ? styles.avatarImageSmall : styles.avatarImage}
      source={avatarUrl ? {uri: `${avatarUrl}`} : {uri: `${fallbackAvatar}`}}
    />
  );
};
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  avatarImage: {
    display: 'flex',
    height: 60,
    width: 60,
    borderRadius: 50,
  },
  avatarImageSmall: {
    display: 'flex',
    height: 40,
    width: 40,
    borderRadius: 50,
  },
});