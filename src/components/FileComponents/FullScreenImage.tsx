import React from 'react';
import {RouteProp, useTheme} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import {ImageWithFallback} from '../../render/components/ImageWithFallback';

type FullScreenImageProps = {
  route: RouteProp<{params: {imageUrl: string}}, 'params'>;
};

export const FullScreenImage = (props: FullScreenImageProps) => {
  const {route} = props;
  const {colors} = useTheme();

  return (
    <ImageWithFallback
      src={route.params.imageUrl}
      key={route.params.imageUrl}
      imageStyle={[styles.image, {backgroundColor: colors.background}]}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
});
