import React from 'react';
import {StyleSheet, View, Text, Linking} from 'react-native';
import LinkIcon from '../../../../../assets/images/icons/external-link.svg';
import {timeElapsedInHours} from '../../../../../services/dates';
import {
  colorBackgroundBlue,
  colorTextContrast,
  colorAiryBlue,
} from '../../../../../assets/colors';
import {VideoComponent} from '../../../../components/VideoComponent';

type StoryMentionProps = {
  url: string;
  sentAt: Date;
  fromContact: boolean;
};

export const StoryMention = ({url, sentAt, fromContact}: StoryMentionProps) => {
  return (
    <>
      <View
        style={[fromContact ? styles.contactContent : styles.memberContent]}>
        {timeElapsedInHours(sentAt) <= 24 ? (
          <>
            <View style={styles.activeStory}>
              <Text
                style={[
                  fromContact
                    ? styles.linkContactContent
                    : styles.linkMemberContent,
                ]}
                onPress={() => Linking.openURL(url)}>
                mentioned in an active Instagram story{' '}
                <LinkIcon fill={fromContact ? colorTextContrast : 'white'} />
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.expiredStory}>
            {' '}
            mentioned in an expired Instagram story
          </Text>
        )}
      </View>

      {timeElapsedInHours(sentAt) <= 24 && (
        <View style={styles.videoContainer}>
          <VideoComponent videoUrl={url} size="instagramStory" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  activeStory: {
    alignItems: 'center',
  },
  expiredStory: {
    fontStyle: 'italic',
  },
  contactContent: {
    maxWidth: 500,
    padding: 10,
    marginTop: 5,
    backgroundColor: colorBackgroundBlue,
    color: colorTextContrast,
    fontFamily: 'Lato',
    fontSize: 16,
  },
  linkContactContent: {
    color: colorTextContrast,
    fontStyle: 'italic',
  },
  memberContent: {
    backgroundColor: colorAiryBlue,
    color: 'white',
    fontFamily: 'Lato',
    fontSize: 16,
  },
  linkMemberContent: {
    color: 'white',
    fontStyle: 'italic',
  },
  videoContainer: {
    marginTop: 5,
    marginBottom: 0,
    borderRadius: 22,
  },
});
