import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import LottieView from 'lottie-react-native';
import {useTheme} from '@react-navigation/native';

export const AiryLoader = () => {
  const {colors} = useTheme();

  return (
    <View style={[styles.wrapper, {backgroundColor: colors.background}]}>
      <LottieView source={require('./data')} autoPlay loop />
    </View>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
});
