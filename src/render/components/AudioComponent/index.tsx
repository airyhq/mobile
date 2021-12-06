import React, {useState} from 'react';
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

type AudioComponentProps = {
  audioUrl: string;
};

export const AudioComponent = (props: AudioComponentProps) => {
  const {audioUrl} = props;
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [duration, setDuration] = useState<number>(0);

  const handleOnPress = () => {
    setIsPaused(!isPaused);
  };

  return (
    <TouchableOpacity onPress={handleOnPress} style={styles.container}>
      <AttachmentAudio height={24} width={24} color={colorAiryBlue} />
      {isPaused ? <PlayButton /> : <StopButton />}
      <Text>{duration}</Text>
      <Video
        source={{uri: audioUrl}}
        audioOnly={true}
        paused={isPaused}
        ignoreSilentSwitch="ignore"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
    marginTop: 5,
    minWidth: '60%',
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
  text: {
    marginLeft: 8,
  },
});
