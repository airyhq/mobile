import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Emoji} from '../../../../../componentsLib/general/Emoji';

export const SurveyResponse = ({rating}) => (
  <View style={styles.text}>
    <Emoji symbol={'📝'} /> This user{' '}
    {rating === 'NO' ? 'negatively' : rating === 'YES' ? 'positively' : ''}{' '}
    rated the experience with the response &#39;{rating}&#39;.
  </View>
);

const styles = StyleSheet.create({
  text: {
    borderRadius: 8,
  },
});
