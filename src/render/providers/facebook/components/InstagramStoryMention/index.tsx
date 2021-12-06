import React, {useState} from 'react';
import {StyleSheet, View, Text, Linking} from 'react-native';
import LinkIcon from '../../../../../assets/images/icons/external-link.svg';
import {timeElapsedInHours} from '../../../../../services/dates';
import {
  colorBackgroundBlue,
  colorTextContrast,
  colorAiryBlue,
} from '../../../../../assets/colors';
import {InstagramMediaPreview} from '../InstagramMediaPreview';

type StoryMentionProps = {
  url: string;
  sentAt: Date;
  fromContact: boolean;
};

export const StoryMention = ({url, sentAt, fromContact}: StoryMentionProps) => {
  const [storyUnavailable, setStoryUnavailable] = useState(false);

  const updateStoryUnavailableText = () => setStoryUnavailable(true);

  return (
    <>
      <View
        style={[fromContact ? styles.contactContent : styles.memberContent]}>
        {timeElapsedInHours(sentAt) <= 24 ? (
          <>
            <View style={styles.activeStory}>
              <Text
                style={[
                  styles.text,
                  fromContact
                    ? styles.contactContentText
                    : styles.memberContentText,
                ]}
                onPress={() => Linking.openURL(url)}>
                {!storyUnavailable
                  ? 'mentioned in an active Instagram story'
                  : 'mentioned in an Instagram story'}{' '}
                <LinkIcon fill={fromContact ? colorTextContrast : 'white'} />
              </Text>
            </View>
          </>
        ) : (
          <Text
            style={[
              styles.text,
              fromContact
                ? styles.contactContentText
                : styles.memberContentText,
            ]}>
            {' '}
            mentioned in an expired Instagram story
          </Text>
        )}
      </View>

      {timeElapsedInHours(sentAt) <= 24 && (
        <InstagramMediaPreview
          mediaUrl={url}
          fromContact={fromContact}
          updateStoryUnavailableText={updateStoryUnavailableText}
          isInstagramStory
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  activeStory: {
    alignItems: 'center',
  },
  text: {
    fontStyle: 'italic',
    fontFamily: 'Lato',
    fontSize: 16,
  },
  contactContent: {
    maxWidth: 500,
    padding: 10,
    marginTop: 5,
    backgroundColor: colorBackgroundBlue,
    borderRadius: 20,
  },
  contactContentText: {
    color: colorTextContrast,
  },
  memberContent: {
    maxWidth: 500,
    padding: 10,
    marginTop: 5,
    backgroundColor: colorAiryBlue,
    color: 'white',
    fontSize: 16,
    borderRadius: 20,
  },
  memberContentText: {
    color: 'white',
  },
});
