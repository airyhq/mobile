import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setVideoFailed(failedUrls.includes(videoUrl));
  }, [videoUrl]);

  const loadingFailed = () => {
    failedUrls.push(videoUrl);
    setVideoFailed(true);
  };

  const handleOnLoadEnd = () => {
    setLoading(false);
  };
  return (
    <>
      <View style={styles.wrapper}>
        <View style={styles.item}>
          {isVideoFailed ? (
            <Text>Loading of video failed</Text>
          ) : (
            <Video
              source={{uri: videoUrl}}
              onError={loadingFailed}
              onLoad={handleOnLoadEnd}
              style={styles.video}
              resizeMode={'cover'}
              paused={true}
              controls
            />
          )}
        </View>
      </View>
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
    display: 'flex',
    width: '80%',
    flex: 1,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
  },
  item: {
    flex: 1,
    alignSelf: 'flex-end',
    width: '100%',
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
    borderRadius: 12,
  },
});
