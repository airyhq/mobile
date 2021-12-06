import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Linking,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import Video from 'react-native-video';

type InstagramStoryPreviewProps = {
  storyUrl: string;
  fromContact: boolean;
};

export const InstagramStoryPreview = ({
  storyUrl,
  fromContact,
}: InstagramStoryPreviewProps) => {
  const [isVideoFailed, setVideoFailed] = useState(false);
  const [postUnavailable, setPostUnavailable] = useState(false);

  return (
    <View
      style={[
        styles.wrapper,
        fromContact ? styles.contactContent : styles.memberContent,
      ]}>
      {postUnavailable && isVideoFailed && (
        <Text style={styles.previewUnavaiblable}>Story unavaiblable</Text>
      )}

      {isVideoFailed && !postUnavailable && (
        <TouchableOpacity onPress={() => Linking.openURL(storyUrl)}>
          <Image
            style={styles.instagramStoryPreviewSize}
            source={{
              uri: storyUrl,
            }}
            onError={() => setPostUnavailable(true)}
          />
        </TouchableOpacity>
      )}

      {!isVideoFailed && !postUnavailable && (
        <TouchableOpacity onPress={() => Linking.openURL(storyUrl)}>
          <Video
            source={{uri: storyUrl}}
            onError={() => setVideoFailed(true)}
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
  instagramStoryPreviewSize: {
    height: Dimensions.get('window').width / (16 / 9),
    width: Dimensions.get('window').width / (16 / 9) / (16 / 9),
    borderRadius: 22,
  },
  previewUnavaiblable: {
    fontStyle: 'italic',
  },
});
