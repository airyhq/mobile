import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Emoji} from '../../../../../componentsLib/general/Emoji';
import {
  colorTextContrast,
  colorTemplateGray,
} from '../../../../../assets/colors';

export const AuthResponse = ({status}) => {
  const emojiStatus = status === 'successful' ? '✅' : '❌';

  return (
    <View style={styles.container}>
      <Text>
        <Emoji symbol={emojiStatus} />
      </Text>
      <Text style={styles.text}>
        Authentication {status === 'successful' ? 'was' : ''} {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colorTemplateGray,
    color: colorTextContrast,
    borderRadius: 8,
  },
  text: {
    fontFamily: 'Lato',
    marginLeft: 5,
  },
});
