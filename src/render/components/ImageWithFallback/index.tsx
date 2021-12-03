import React, {useEffect, useState} from 'react';
import {Image, StyleProp, ImageStyle} from 'react-native';
import {SvgUri} from 'react-native-svg';

type ImageRenderProps = {
  src: string;
  alt?: string;
  imageStyle?: StyleProp<ImageStyle>;
};

const failedUrls = [];

export const ImageWithFallback = ({src, imageStyle}: ImageRenderProps) => {
  const [imageFailed, setImageFailed] = useState(failedUrls.includes(src));

  useEffect(() => {
    setImageFailed(failedUrls.includes(src));
  }, [src]);

  const loadingFailed = () => {
    failedUrls.push(src);
    setImageFailed(true);
  };

  return (
    <>
      {imageFailed ? (
        <SvgUri
          width="70"
          height="70"
          uri="https://s3.amazonaws.com/assets.airy.co/fallbackMediaImage.svg"
        />
      ) : (
        <Image
          style={imageStyle}
          source={{
            uri: src,
          }}
          onError={() => loadingFailed()}
        />
      )}
    </>
  );
};
