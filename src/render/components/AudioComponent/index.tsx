import React, {useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import AttachmentAudio from '../../../assets/images/icons/attachmentAudio.svg';
import PlayButton from '../../../assets/images/icons/play.svg';
import StopButton from '../../../assets/images/icons/pause.svg';
import {
  colorAiryBlue,
  colorBackgroundBlue,
  colorLightGray,
} from '../../../assets/colors';
import Video from 'react-native-video';
import {formatSecondsAsTime} from '../../../services/dates/format';

type AudioComponentProps = {
  audioUrl: string;
};

export const AudioComponent = (props: AudioComponentProps) => {
  const {audioUrl} = props;
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [duration, setDuration] = useState<string>('--:--');
  const audioRef = useRef(null);

  const handleOnPress = () => {
    setIsPaused(!isPaused);
  };

  const handleDuration = (time: number) => {
    const totalTime = Math.round(time);
    const formattedTotalTime = formatSecondsAsTime(totalTime);
    setDuration(formattedTotalTime);
  };

  const handleCurrentTime = (time: number) => {
    const currentTime = Math.round(time);
    const formattedCurrentTime = formatSecondsAsTime(currentTime);
    setDuration(formattedCurrentTime);
  };

  const handleOnEnd = () => {
    setIsPaused(true);
    setTimeout(() => {
      audioRef.current.seek(0);
    }, 500);
  };

  return (
    <TouchableOpacity onPress={handleOnPress} style={styles.container}>
      <AttachmentAudio height={24} width={24} color={colorAiryBlue} />
      {isPaused ? (
        <PlayButton width={24} height={24} color={colorAiryBlue} />
      ) : (
        <StopButton width={24} height={24} color={colorAiryBlue} />
      )}
      <View style={styles.durationContainer}>
        <Text>{duration}</Text>
      </View>
      <Video
        source={{uri: audioUrl}}
        ref={audioRef}
        audioOnly={true}
        paused={isPaused}
        ignoreSilentSwitch="ignore"
        onLoad={e => handleDuration(e.duration)}
        onProgress={e => handleCurrentTime(e.currentTime)}
        onEnd={handleOnEnd}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
    marginTop: 5,
    minWidth: 150,
    backgroundColor: colorBackgroundBlue,
    borderColor: colorLightGray,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
  },
  durationContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    marginLeft: 8,
  },
});
