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
};

/**
 * This is a global list of videos that failed to load.
 * Sadly the render component is not able to fix wrong payloads in the
 * redux store and this is the only way for it to remember failed states
 * and not start flickering on every redraw of the messages
 */
const failedUrls = [];

export const InstagramStoryPreview = ({
  storyUrl,
}: InstagramStoryPreviewProps) => {
  const [isVideoFailed, setVideoFailed] = useState(
    failedUrls.includes(storyUrl),
  );

  storyUrl =
    'https://lookaside.fbsbx.com/ig_messaging_cdn/?asset_id=17889599717523682&signature=Abzuqy-J3VkNy1g04OwS6iMp8TeXW1qIdHysWv46jy_urtl04SmOy5o9yrAXKBz1jZj0sJvr0TFABM6rKhKQOX1s2q-E4T2c3wt0XSBT5FAkQmaZbSxM3_BrFJ7soKczljTxOI_K42ZVydd8ER1ThCHAdqZUXSTBgViievX_gjpUCKwG2A';

  useEffect(() => {
    setVideoFailed(failedUrls.includes(storyUrl));
  }, [storyUrl]);

  const loadingFailed = () => {
    failedUrls.push(storyUrl);
    setVideoFailed(true);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.item}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 5,
    borderRadius: 22,
  },
  item: {
    width: '100%',
    alignSelf: 'flex-end',
  },
  itemMember: {
    marginTop: 5,
    justifyContent: 'flex-end',
    width: '100%',
    textAlign: 'right',
  },
  itemMemberVideo: {
    position: 'relative',
    textAlign: 'left',
    borderRadius: 8,
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
  },
  itemUser: {
    position: 'relative',
    alignSelf: 'flex-start',
    textAlign: 'left',
  },
  itemUserVideo: {
    marginTop: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  instagramStoryPreviewSize: {
    height: Dimensions.get('window').width / (16 / 9),
    width: Dimensions.get('window').width / (16 / 9) / (16 / 9),
    borderRadius: 22,
  },
});
