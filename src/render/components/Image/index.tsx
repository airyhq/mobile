import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ImageWithFallback} from '../ImageWithFallback';
import {ImageContent} from '../../providers/facebook/facebookModel';

type ImageRenderProps = {
  imageUrl?: string;
  images?: ImageContent[];
};

export const Image = ({imageUrl, images}: ImageRenderProps) => (
  <View style={styles.wrapper}>
    {images ? (
      <View style={styles.imagesContainer}>
        {images.map(image => (
          <ImageWithFallback
            style={`${styles.messageListItemImageBlock} ${styles.images}`}
            src={image.imageUrl}
            key={image.imageUrl}
          />
        ))}
      </View>
    ) : (
      <ImageWithFallback
        style={styles.messageListItemImageBlock}
        src={imageUrl}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flex: 1,
    marginTop: 5,
  },
  imagesContainer: {
    display: 'flex',
  },
  images: {
    marginTop: 5,
  },
  messageListItemImageBlock: {
    height: 150,
    width: 150,
    resizeMode: 'contain',
    borderRadius: 8,
  },
});
