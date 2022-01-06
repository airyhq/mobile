import React from 'react';
import {StyleSheet, View, Text, Linking} from 'react-native';
import {colorTextContrast} from '../../../assets/colors';

export enum TooltipArrowPosition {
  top = 'top',
  right = 'right',
  bottom = 'bottom',
  left = 'left',
}

type TooltipProps = {
  text: string;
  textColor?: string;
  backgroundColorContainer?: string;
  externalLinkUrl?: string;
  arrowPosition?: TooltipArrowPosition;
  arrow?: boolean;
};

export const Tooltip = ({
  text,
  textColor,
  backgroundColorContainer,
  externalLinkUrl,
  arrowPosition,
  arrow,
}: TooltipProps) => {
  const tooltipBackgroundColor = backgroundColorContainer ?? colorTextContrast;
  const arrowBorderStyle = (position: TooltipArrowPosition) => {
    if (position === 'top') {
      return {borderBottomColor: tooltipBackgroundColor};
    }

    if (position === 'right') {
      return {borderLeftColor: tooltipBackgroundColor};
    }

    if (position === 'bottom') {
      return {borderTopColor: tooltipBackgroundColor};
    }

    if (position === 'left') {
      return {borderRightColor: tooltipBackgroundColor};
    }
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={[styles.container, {backgroundColor: tooltipBackgroundColor}]}>
        {externalLinkUrl ? (
          <Text
            style={[styles.text, styles.link, {color: textColor ?? 'white'}]}
            onPress={() => Linking.openURL(externalLinkUrl)}>
            {text}
          </Text>
        ) : (
          <Text style={[styles.text, {color: textColor ?? 'white'}]}>
            {text}
          </Text>
        )}
        {arrow && (
          <View
            style={[
              styles.arrow,
              arrowPosition ? styles[arrowPosition] : styles.bottom,
              arrowBorderStyle(arrowPosition),
            ]}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    height: 'auto',
    width: 'auto',
    maxWidth: 350,
    maxHeight: 200,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    shadowColor: colorTextContrast,
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
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  top: {
    top: -10,
    borderTopWidth: 0,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  right: {
    right: -10,
    borderTopWidth: 10,
    borderRightWidth: 0,
    borderBottomWidth: 10,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  bottom: {
    marginLeft: -5,
    bottom: -10,
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 0,
    borderLeftWidth: 10,
  },
  left: {
    left: -10,
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 0,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
});
