import React from 'react';
import {View} from 'react-native';

export type Props = {
  label?: string;
  className?: any;
  symbol: string;
};

export const Emoji = ({label, symbol, className}: Props) => (
  <View
    style={className}
    accessibilityRole="image"
    aria-label={label ? label : ''}
    aria-hidden={label ? 'false' : 'true'}>
    {symbol}
  </View>
);
