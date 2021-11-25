import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {ImageWithFallback} from '../ImageWithFallback';
import {ImageContent} from '../../providers/facebook/facebookModel';

type ImageRenderProps = {
  imageUrl?: string;
  images?: ImageContent[];
  altText?: string;
};

export const ImageComponent = ({
  imageUrl,
  altText,
  images,
}: ImageRenderProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const handleOnPress = () => {};

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleSetLoading = (loading: boolean) => {
    setLoading(loading);
  };

  return (
    <>
      <Pressable onPress={handleOnPress} style={styles.wrapper}>
        {images ? (
          <View style={styles.imagesContainer}>
            {images.map(image => {
              return (
                <ImageWithFallback
                  src={image.imageUrl}
                  key={image.imageUrl}
                  setLoading={handleSetLoading}
                  alt={image.altText ?? 'image in a conversation in Airy Inbox'}
                  imageStyle={{
                    ...styles.messageListItemImageBlock,
                    ...styles.image,
                  }}
                />
              );
            })}
          </View>
        ) : (
          <ImageWithFallback
            imageStyle={styles.messageListItemImageBlock}
            setLoading={handleSetLoading}
            src={imageUrl}
            alt={altText ?? 'image in a conversation in Airy Inbox'}
          />
        )}
      </Pressable>
      <>
        {loading && (
          <ActivityIndicator
            style={{
              position: 'absolute',
              top: 35,
              left: 70,
              right: 70,
              height: 50,
            }}
          />
        )}
      </>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 5,
    width: 'auto',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
  },
  imagesContainer: {
    height: '100%',
  },
  image: {
    marginTop: 8,
  },
  messageListItemImageBlock: {
    width: Dimensions.get('window').width / 2,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
});
