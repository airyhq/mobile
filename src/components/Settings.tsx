import React from 'react';
import {SafeAreaView, StyleSheet, Dimensions, View} from 'react-native';

export const Settings = () => {
  return (
  <SafeAreaView >
    <View style={styles.container}>
    </View>
  </SafeAreaView>);
};

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    height: height,
    width: width,
  },
});
