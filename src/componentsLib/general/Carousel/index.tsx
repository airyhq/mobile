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
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
  },
});
