import React, {SyntheticEvent} from 'react';
import {Contact} from '../model/Contact';
import { Image, StyleSheet } from 'react-native';

type AvatarProps = {
  contact?: Contact;
};

const fallbackAvatar = 'https://s3.amazonaws.com/assets.airy.co/unknown.png';

const fallbackAvatarImage = (event: any) => {
  event.currentTarget.src = fallbackAvatar;
  event.currentTarget.alt = 'fallback avatar';
};

export const Avatar = ({contact}: AvatarProps) => {
  return (
    <Image
      style={styles.avatarImage}
      source={{uri: 'https://s3.amazonaws.com/assets.airy.co/unknown.png'}}
      onError={(event: React.SyntheticEvent<HTMLImageElement, Event>) => fallbackAvatarImage(event)}
    />
  );
};

const styles = StyleSheet.create({
    avatarImage: {
      display: 'flex',
      
      backgroundColor: 'black'
    },
});
