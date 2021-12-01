import React from 'react';
import {StyleSheet, View, Text, Linking} from 'react-native';
import PlayCircleIcon from '../../../../../assets/images/icons/play-circle.svg';
import {timeElapsedInHours} from '../../../../../services/dates';
import {TextComponent} from '../../../../components/Text';
import {InstagramStoryPreview} from '../InstagramStoryPreview';
import {colorTextContrast, colorTextGray} from '../../../../../assets/colors';

type InstagramRepliesProps = {
  url: string;
  text: string;
  sentAt: Date;
  fromContact: boolean;
};

export const StoryReplies = ({
  url,
  text,
  sentAt,
  fromContact,
}: InstagramRepliesProps) => {
  return (
    <>
      <Text style={styles.storyResponse}>In response to a&nbsp;</Text>
      {timeElapsedInHours(sentAt) <= 24 ? (
        <View style={styles.storyLink}>
          <PlayCircleIcon style={styles.icon} />
          <Text style={styles.activeStory} onPress={() => Linking.openURL(url)}>
            story
          </Text>
        </View>
      ) : (
        <Text style={styles.expiredStory}> story (expired)</Text>
      )}

      {timeElapsedInHours(sentAt) <= 24 && (
        <InstagramStoryPreview storyUrl={url} />
      )}

      <TextComponent fromContact={fromContact} text={text} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  expiredStory: {
    fontFamily: 'Lato',
    fontSize: 14,
    color: colorTextGray,
  },
  storyResponse: {
    color: colorTextGray,
  },
  storyLink: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    marginRight: 2,
    marginLeft: 2,
  },
  activeStory: {
    fontFamily: 'Lato',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationStyle: 'solid',
    color: colorTextContrast,
  },
});
