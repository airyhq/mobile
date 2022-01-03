import React, {useEffect, useState} from 'react';
import {StyleProp, Text} from 'react-native';
import {SvgUri} from 'react-native-svg';
import {colorTextGray} from '../../../assets/colors';
import FastImage from 'react-native-fast-image';

type ImageRenderProps = {
  src: string;
  alt?: string;
  imageStyle?: StyleProp<any>;
  setLoading?: (loading: boolean) => void;
  coverResizeMode?: boolean;
};

const failedUrls = [];

export const ImageWithFallback = ({
  src,
  setLoading,
  imageStyle,
  coverResizeMode,
}: ImageRenderProps) => {
  const [imageFailed, setImageFailed] = useState(failedUrls.includes(src));

  useEffect(() => {
    setImageFailed(failedUrls.includes(src));
  }, [src]);

  const loadingFailed = () => {
    failedUrls.push(src);
    setImageFailed(true);
  };

  const handleOnLoad = () => {
    setLoading && setLoading(false);
  };

  return (
    <>
      {imageFailed ? (
        <>
          <SvgUri
            width="70"
            height="70"
            uri="https://s3.amazonaws.com/assets.airy.co/fallbackMediaImage.svg"
            fill={colorTextGray}
          />
          <Text> media unavailable</Text>
        </>
      ) : (
        <FastImage
          onLoad={handleOnLoad}
          style={imageStyle}
          source={{
            uri: src,
          }}
          onError={() => loadingFailed()}
          resizeMode={
            coverResizeMode
              ? FastImage.resizeMode.cover
              : FastImage.resizeMode.contain
          }
        />
      )}
    </>
  );
};
