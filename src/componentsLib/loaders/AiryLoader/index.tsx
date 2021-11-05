import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import LottieView from 'lottie-react-native';

export const AiryLoader = () => (
  <View style={styles.wrapper}>
    <LottieView source={require('./data')} autoPlay loop />
  </View>
);

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'white',
  },
});
