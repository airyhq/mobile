import React from 'react';
import {StyleSheet, View, Text, Linking} from 'react-native';
import LinkIcon from '../../../../../assets/images/icons/external-link.svg';
import {timeElapsedInHours} from '../../../../../services/dates';
import {
  colorBackgroundBlue,
  colorTextContrast,
  colorAiryBlue,
} from '../../../../../assets/colors';
import {InstagramStoryPreview} from '../InstagramStoryPreview';

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
        <InstagramStoryPreview storyUrl="https://lookaside.fbsbx.com/ig_messaging_cdn/?asset_id=17889599717523682&signature=Abzuqy-J3VkNy1g04OwS6iMp8TeXW1qIdHysWv46jy_urtl04SmOy5o9yrAXKBz1jZj0sJvr0TFABM6rKhKQOX1s2q-E4T2c3wt0XSBT5FAkQmaZbSxM3_BrFJ7soKczljTxOI_K42ZVydd8ER1ThCHAdqZUXSTBgViievX_gjpUCKwG2A" />
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
});
