import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colorAiryBlue} from '../assets/colors';
import FilterIcon from '../assets/images/icons/emptyStateFilter.svg';

export const EmptyFilterResults = () => {
  return (
    <View style={styles.container}>
      <FilterIcon width={104} height={104} fill={colorAiryBlue} />
      <Text style={styles.title}>Nothing found</Text>
      <Text style={styles.subtitle}>
        We could not find a conversation matching your criterias.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 32,
    marginRight: 32,
  },
  title: {
    fontFamily: 'Lato',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  },
  subtitle: {
    fontFamily: 'Lato',
    fontSize: 14,
    textAlign: 'center'
  },
});
