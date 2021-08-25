import React from 'react';
import {Image, ImageStyle, StyleProp, StyleSheet} from 'react-native';

type AvatarProps = {
  avatarUrl: string;
  small?: boolean;
  style?: StyleProp<ImageStyle>;
};
const fallbackAvatar = 'https://s3.amazonaws.com/assets.airy.co/unknown.png';

export const Avatar = ({avatarUrl, small, style}: AvatarProps) => {
  return (
    <Image
      style={[small ? styles.avatarImageSmall : styles.avatarImage, style]}
      source={avatarUrl ? {uri: `${avatarUrl}`} : {uri: `${fallbackAvatar}`}}
    />
  );
};

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
