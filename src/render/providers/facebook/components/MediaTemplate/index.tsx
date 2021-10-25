import React from 'react';
import {StyleSheet, View, Text, Linking} from 'react-native';
import {MediaTemplate as MediaTemplateModel} from '../../facebookModel';
import {Buttons} from '../Buttons';
import {colorLightGray, colorAiryBlue} from '../../../../../assets/colors';

type MediaTemplateProps = {
  template: MediaTemplateModel;
};

export const MediaTemplate = ({
  template: {media_type, url, attachment_id, buttons},
}: MediaTemplateProps) => {
  return (
    <View style={styles.mediaTemplate}>
      <View
        style={[
          styles.media,
          buttons ? styles.mediaBorder : styles.mediaNoBorder,
        ]}>
        {url && (
          <Text onPress={() => Linking.openURL(url)}>
            see the {media_type} on Facebook
          </Text>
        )}

        {attachment_id && (
          <Text style={styles.mediaInfo}> {media_type} posted on Facebook</Text>
        )}
      </View>
      {buttons && <Buttons buttons={buttons} mediaTemplate={true} />}
    </View>
  );
};

const styles = StyleSheet.create({
  mediaTemplate: {
    maxWidth: '100%',
    marginTop: 5,
    marginBottom: 5,
    marginRight: 0,
    marginLeft: 0,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colorLightGray,
  },
  media: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  mediaBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colorLightGray,
  },
  mediaNoBorder: {
    borderBottomWidth: 0,
  },
  mediaInfo: {
    color: colorAiryBlue,
  },
});
