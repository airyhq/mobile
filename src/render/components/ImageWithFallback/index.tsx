import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import {SvgUri} from 'react-native-svg';

type ImageRenderProps = {
  src: string;
  alt?: string;
  style?: any;
};

/**
 * This is a global list of images that failed to load.
 * Sadly the render component is not able to fix wrong payloads in the
 * redux store and this is the only way for it to remember failed states
 * and not start flickering on every redraw of the messages
 */
const failedUrls = [];

export const ImageWithFallback = ({src, style}: ImageRenderProps) => {
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
          style={style}
          source={{
            uri: src,
          }}
          onError={() => loadingFailed()}
        />
      )}
    </>
  );
};
