import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
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
      imageStyle={{flex: 1, resizeMode: 'contain', backgroundColor: 'white'}}
      //   setLoading={handleSetLoading}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink',
  },
});
