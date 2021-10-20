import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {ImageWithFallback} from '../ImageWithFallback';
import {ImageContent} from '../../providers/facebook/facebookModel';

type ImageRenderProps = {
  imageUrl?: string;
  images?: ImageContent[];
  altText?: string;
};

export const ImageComponent = ({
  imageUrl,
  altText,
  images,
}: ImageRenderProps) => {
  return (
    <View style={styles.wrapper}>
      {images ? (
        <View style={styles.imagesContainer}>
          {images.map(image => (
            <ImageWithFallback
              src={image.imageUrl}
              key={image.imageUrl}
              alt={image.altText ?? 'conversation in Airy Inbox'}
              imageStyle={`${styles.messageListItemImageBlock} ${styles.images}`}
            />
          ))}
        </View>
      ) : (
        <ImageWithFallback
          imageStyle={styles.messageListItemImageBlock}
          src={imageUrl}
          alt={altText ?? 'conversation in Airy Inbox'}
        />
      )}
    </View>
  );
};

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
    width: Dimensions.get('window').width / 2,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
});
