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
import {useNavigation} from '@react-navigation/core';

type ImageRenderProps = {
  imageUrl?: string;
  images?: ImageContent[];
  altText?: string;
  imageName?: string;
};

export const ImageComponent = ({
  imageUrl,
  altText,
  images,
}: ImageRenderProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  const handleOnPress = () => {
    navigation.navigate('FullScreenImage', {
      imageUrl: imageUrl,
    });
  };

  const handleSetLoading = (isLoading: boolean) => {
    setLoading(isLoading);
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
