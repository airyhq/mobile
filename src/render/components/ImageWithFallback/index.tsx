import React, {useEffect, useState} from 'react';
import {Image, StyleProp, ImageStyle, Text} from 'react-native';
import {SvgUri} from 'react-native-svg';
import {colorTextGray} from '../../../assets/colors';

type ImageRenderProps = {
  src: string;
  alt?: string;
  imageStyle?: StyleProp<ImageStyle>;
  setLoading: (loading: boolean) => void;
};

const failedUrls = [];

export const ImageWithFallback = ({
  src,
  setLoading,
  imageStyle,
}: ImageRenderProps) => {
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
        <Image
          onLoad={() => setLoading(false)}
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
