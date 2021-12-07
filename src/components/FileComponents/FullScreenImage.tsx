import React from 'react';
import {StyleSheet} from 'react-native';
import {ImageWithFallback} from '../../render/components/ImageWithFallback';

type FullScreenImageProps = {
  imageUrl: string;
  route: any;
};

export const FullScreenImage = (props: FullScreenImageProps) => {
  const {imageUrl, route} = props;

  return (
    <ImageWithFallback
      src={route.params.imageUrl}
      key={imageUrl}
      imageStyle={styles.image}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'contain',
    backgroundColor: 'white',
  },
});
