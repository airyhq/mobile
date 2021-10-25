import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';

export const Carousel = ({children}) => {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={styles.carouselChildren}>
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  carouselChildren: {
    height: 'auto',
    marginTop: 10,
    width: '100%',
  },
});
