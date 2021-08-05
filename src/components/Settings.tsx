import React from 'react';
import {SafeAreaView, StyleSheet, Dimensions} from 'react-native';

export const Settings = () => {
  return <SafeAreaView style={styles.container}></SafeAreaView>;
};

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: height,
    width: width,
  },
});
