import React, {useState, useEffect} from 'react';
import {Image, ImageStyle, StyleProp, StyleSheet} from 'react-native';

type AvatarProps = {
  avatarUrl: string;
  small?: boolean;
  style?: StyleProp<ImageStyle>;
};

const failedUrls = [];

export const Avatar = ({avatarUrl, small, style}: AvatarProps) => {
  const [imageFailed, setImageFailed] = useState(
    failedUrls.includes(avatarUrl),
  );

  useEffect(() => {
    setImageFailed(failedUrls.includes(avatarUrl));
  }, [avatarUrl]);

  const loadingFailed = () => {
    failedUrls.push(avatarUrl);
    setImageFailed(true);
  };

  return (
    <>
      {imageFailed || !avatarUrl ? (
        <Image
          style={[small ? styles.avatarImageSmall : styles.avatarImage, style]}
          source={{
            uri: 'https://s3.amazonaws.com/assets.airy.co/unknown.png',
          }}
        />
      ) : (
        <Image
          style={[small ? styles.avatarImageSmall : styles.avatarImage, style]}
          source={{
            uri: avatarUrl,
          }}
          onError={() => loadingFailed()}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  avatarImage: {
    height: 60,
    width: 60,
    borderRadius: 50,
  },
  avatarImageSmall: {
    height: 40,
    width: 40,
    borderRadius: 50,
  },
});
