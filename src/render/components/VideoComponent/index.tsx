import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import Video from 'react-native-video';

type VideoRenderProps = {
  videoUrl: string;
};

/**
 * This is a global list of videos that failed to load.
 * Sadly the render component is not able to fix wrong payloads in the
 * redux store and this is the only way for it to remember failed states
 * and not start flickering on every redraw of the messages
 */
const failedUrls = [];

export const VideoComponent = ({videoUrl}: VideoRenderProps) => {
  const [isVideoFailed, setVideoFailed] = useState(
    failedUrls.includes(videoUrl),
  );

  useEffect(() => {
    setVideoFailed(failedUrls.includes(videoUrl));
  }, [videoUrl]);

  const loadingFailed = () => {
    failedUrls.push(videoUrl);
    setVideoFailed(true);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.item}>
        {isVideoFailed ? (
          <Text>Loading of video failed</Text>
        ) : (
          <Video
            source={{uri: videoUrl}}
            onError={loadingFailed}
            style={styles.video}
            resizeMode={'contain'}
            controls
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flex: 1,
    marginTop: 5,
    backgroundColor: 'blue',
  },
  item: {
    display: 'flex',
    alignSelf: 'flex-end',
    width: '100%',
    backgroundColor: 'red',
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
    display: 'flex',
    flexDirection: 'row',
  },
  itemUser: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    position: 'relative',
  },
  itemUserVideo: {
    marginTop: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  video: {
    width: Dimensions.get('window').width / 2,
    height: 100,
  },
});
