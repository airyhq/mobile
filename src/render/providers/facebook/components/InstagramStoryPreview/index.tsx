import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Linking,
  TouchableOpacity,
} from 'react-native';
import Video from 'react-native-video';
import {ImageWithFallback} from '../../../../components/ImageWithFallback';

type InstagramStoryPreviewProps = {
  storyUrl: string;
  fromContact: boolean;
};

const failedUrls = [];

export const InstagramStoryPreview = ({
  storyUrl,
  fromContact,
}: InstagramStoryPreviewProps) => {
  const [isVideoFailed, setVideoFailed] = useState(
    failedUrls.includes(storyUrl),
  );

  useEffect(() => {
    setVideoFailed(failedUrls.includes(storyUrl));
  }, [storyUrl]);

  const loadingFailed = () => {
    failedUrls.push(storyUrl);
    setVideoFailed(true);
  };

  return (
    <View
      style={[
        styles.wrapper,
        fromContact ? styles.contactContent : styles.memberContent,
      ]}>
      {isVideoFailed ? (
        <TouchableOpacity onPress={() => Linking.openURL(storyUrl)}>
          <ImageWithFallback
            src={storyUrl}
            imageStyle={styles.instagramStoryPreviewSize}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => Linking.openURL(storyUrl)}>
          <Video
            source={{uri: storyUrl}}
            onError={loadingFailed}
            style={styles.instagramStoryPreviewSize}
            resizeMode={'contain'}
            controls
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 5,
  },
  contactContent: {
    alignSelf: 'flex-start',
  },
  memberContent: {
    alignSelf: 'flex-end',
  },
  container: {
    flexDirection: 'row',
  },
  instagramStoryPreviewSize: {
    height: Dimensions.get('window').width / (16 / 9),
    width: Dimensions.get('window').width / (16 / 9) / (16 / 9),
    borderRadius: 22,
  },
});
