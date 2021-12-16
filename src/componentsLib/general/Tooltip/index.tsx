import React from 'react';
import {StyleSheet, View, Text, Linking} from 'react-native';
import {colorTextContrast} from '../../../assets/colors';

type TooltipProps = {
  text: string;
  textColor?: string;
  backgroundColorContainer?: string;
  externalLinkUrl?: string;
};

export const Tooltip = ({
  text,
  textColor,
  backgroundColorContainer,
  externalLinkUrl,
}: TooltipProps) => {
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: backgroundColorContainer ?? colorTextContrast},
      ]}>
      {externalLinkUrl ? (
        <Text
          style={[styles.text, styles.link, {color: textColor ?? 'white'}]}
          onPress={() => Linking.openURL(externalLinkUrl)}>
          {text}
        </Text>
      ) : (
        <Text style={[styles.text, {color: textColor ?? 'white'}]}>{text}</Text>
      )}
      <View
        style={[
          styles.arrow,
          {borderTopColor: backgroundColorContainer ?? colorTextContrast},
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 'auto',
    width: 'auto',
    maxWidth: 400,
    maxHeight: 200,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
  text: {
    textAlign: 'center',
    fontFamily: 'Lato',
  },
  link: {
    textDecorationLine: 'underline',
  },
  arrow: {
    position: 'absolute',
    bottom: -10,
    marginLeft: -5,
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 0,
    borderLeftWidth: 10,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
});
