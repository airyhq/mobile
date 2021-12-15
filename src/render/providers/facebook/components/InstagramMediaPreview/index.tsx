import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text,
  ActivityIndicator,
} from 'react-native';
import {colorTextGray} from '../../../../../assets/colors';
import Video from 'react-native-video';

type InstagramMediaPreviewProps = {
  mediaUrl: string;
  fromContact: boolean;
  updateStoryUnavailableText?: () => void;
  isInstagramStory?: boolean;
};

export const InstagramMediaPreview = ({
  mediaUrl,
  fromContact,
  updateStoryUnavailableText,
  isInstagramStory,
}: InstagramMediaPreviewProps) => {
  const [videoLoading, setVideoLoading] = useState(true);
  const [isVideoFailed, setVideoFailed] = useState(false);
  const [postUnavailable, setPostUnavailable] = useState(false);

  useEffect(() => {
    if (postUnavailable && updateStoryUnavailableText) {
      updateStoryUnavailableText();
    }
  }, [postUnavailable, updateStoryUnavailableText]);

  const handleOnLoadEnd = () => {
    setVideoLoading(false);
  };

  const handleOnError = () => {
    setVideoFailed(true);
    setVideoLoading(false);
  };

  return (
    <View
      style={[
        styles.wrapper,
        fromContact ? styles.contactContent : styles.memberContent,
      ]}>
      {postUnavailable && isVideoFailed && (
        <View
          style={[
            styles.fallbackPreview,
            isInstagramStory ? styles.story : styles.post,
          ]}>
          <Text style={styles.previewUnavaiblable}>
            media {'\n'}unavaiblable
          </Text>
        </View>
      )}

      {isVideoFailed && !postUnavailable && (
        <Image
          style={[
            styles.previewStyle,
            isInstagramStory ? styles.story : styles.post,
          ]}
          source={{
            uri: mediaUrl,
          }}
          onError={() => setPostUnavailable(true)}
        />
      )}

      {!isVideoFailed && !postUnavailable && (
        <Video
          source={{uri: mediaUrl}}
          onError={handleOnError}
          style={[
            styles.previewStyle,
            isInstagramStory ? styles.story : styles.post,
          ]}
          resizeMode={'contain'}
          paused={true}
          onLoad={handleOnLoadEnd}
          controls
        />
      )}

      {videoLoading && (
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
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 5,
    height: 'auto',
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
  previewStyle: {
    borderRadius: 22,
  },
  story: {
    height: Dimensions.get('window').width / (16 / 9),
    width: Dimensions.get('window').width / (16 / 9) / (16 / 9),
  },
  post: {
    width: 150,
    height: 150,
  },
  fallbackPreview: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colorTextGray,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    backgroundColor: 'white',
  },
  previewUnavaiblable: {
    fontStyle: 'italic',
    color: colorTextGray,
    textAlign: 'center',
  },
});
