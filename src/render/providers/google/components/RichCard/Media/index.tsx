import React from 'react';
import {StyleSheet} from 'react-native';
import {MediaHeight} from '../../../googleModel';
import {ImageWithFallback} from '../../../../../components/ImageWithFallback';

export type MediaRenderProps = {
  height: MediaHeight;
  altText?: string;
  fileUrl: string;
};

const getHeight = (height: MediaHeight): Object => {
  switch (height) {
    case MediaHeight.short:
      return styles.short;
    case MediaHeight.medium:
      return styles.medium;
    case MediaHeight.tall:
      return styles.tall;
    default:
      return styles.medium;
  }
};

export const Media = ({height, altText, fileUrl}: MediaRenderProps) => (
  <ImageWithFallback
    src={fileUrl}
    alt={altText}
    imageStyle={{...styles.mediaImage, ...getHeight(height)}}
  />
);

const styles = StyleSheet.create({
  mediaImage: {
    width: 'auto',
    resizeMode: 'cover',
    overflow: 'hidden',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  small: {
    width: 136,
  },
  big: {
    width: 280,
  },
  tall: {
    height: 210,
  },
  medium: {
    height: 168,
  },
  short: {
    height: 112,
  },
});
