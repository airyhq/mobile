import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Emoji} from '../../../../../componentsLib/general/Emoji';
import {
  colorTextContrast,
  colorTemplateGray,
} from '../../../../../assets/colors';

export const SurveyResponse = ({rating}) => (
  <View style={styles.surveyContainer}>
    <Text>
      <Emoji symbol={'📝'} />
    </Text>
    <Text style={styles.text}>
      This user{' '}
      {rating === 'NO' ? 'negatively' : rating === 'YES' ? 'positively' : ''}{' '}
      rated the experience with the response &#39;{rating}&#39;.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  surveyContainer: {
    padding: 10,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colorTemplateGray,
    color: colorTextContrast,
    borderRadius: 8,
  },
  text: {
    fontFamily: 'Lato',
    marginLeft: 5,
  },
});
