import React from 'react';
import {StyleSheet, View, Text, Linking, Dimensions} from 'react-native';
import {colorTextContrast} from '../../../assets/colors';

export const Tooltip = ({
  text,
  textColor,
  icon,
  containerBackgroundColor,
  link,
}: any) => {
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: containerBackgroundColor ?? 'white'},
      ]}>
      <Text style={{color: textColor ?? colorTextContrast}}>{text}</Text>
      <View style={styles.arrow} />
    </View>
  );
};

//width: calculate with Dimensions 
//height: calculate with Dimensions 
//make arrow 
//svg: you can pass the name of the svg and then the component imports and displays it 

//    width: Dimensions.get('window').width / 4,
//height: Dimensions.get('window').height / 12,

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
  },
  arrow: {
    top: 0,
    left: '50%',
    marginLeft: '-5px',
    borderWidth: 1,
    borderBottomColor: 'red',
    borderBottomWidth: 2,
  }
});
