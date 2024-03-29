import {useTheme} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colorAiryBlue} from '../assets/colors';
import FilterIcon from '../assets/images/icons/emptyStateFilter.svg';

export const EmptyFilterResults = () => {
  const {colors} = useTheme();
  return (
    <View style={styles.container}>
      <FilterIcon width={104} height={104} fill={colorAiryBlue} />
      <Text style={[styles.title, {color: colors.text}]}>Nothing found</Text>
      <Text style={[styles.subtitle, {color: colors.text}]}>
        We could not find a conversation matching your criterias.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: '16%',
    marginLeft: 32,
    marginRight: 32,
  },
  title: {
    fontFamily: 'Lato',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Lato',
    fontSize: 14,
    textAlign: 'center',
  },
});
