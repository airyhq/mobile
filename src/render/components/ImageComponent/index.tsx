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
          {images.map(image => {
            return (
              <ImageWithFallback
                src={image.imageUrl}
                key={image.imageUrl}
                alt={image.altText ?? 'image in a conversation in Airy Inbox'}
                imageStyle={{
                  ...styles.messageListItemImageBlock,
                  ...styles.image,
                }}
              />
            );
          })}
        </View>
      ) : (
        <ImageWithFallback
          imageStyle={styles.messageListItemImageBlock}
          src={imageUrl}
          alt={altText ?? 'image in a conversation in Airy Inbox'}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 5,
    width: 'auto',
  },
  imagesContainer: {
    height: '100%',
  },
  image: {
    marginTop: 8,
  },
  messageListItemImageBlock: {
    width: Dimensions.get('window').width / 2,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
});
