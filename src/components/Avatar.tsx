import React from 'react';
import {Contact} from '../model/Contact';
import {Image, StyleSheet} from 'react-native';

type AvatarProps = {
  contact: Contact;
};

const fallbackAvatar = 'https://s3.amazonaws.com/assets.airy.co/unknown.png';

export const Avatar = ({contact}: AvatarProps) => {
  return (
    <Image
      style={styles.avatarImage}
      source={contact.avatarUrl ? {uri: `${contact.avatarUrl}`} : {uri: `${fallbackAvatar}`}}
    />
  );
};

const styles = StyleSheet.create({
  avatarImage: {
    display: 'flex',
    height: 60,
    width: 60,
    borderRadius: 50
  },
});
