import React from 'react';
import {RouteProp} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import {ImageWithFallback} from '../../render/components/ImageWithFallback';

type FullScreenImageProps = {
  route: RouteProp<{params: {imageUrl: string}}, 'params'>;
};

export const FullScreenImage = (props: FullScreenImageProps) => {
  const {route} = props;

  return (
    <ImageWithFallback
      src={route.params.imageUrl}
      key={route.params.imageUrl}
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
