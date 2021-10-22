import React from 'react';
import {StyleSheet, View, Text, Linking} from 'react-native';
import {
  URLButton,
  PostbackButton,
  CallButton,
  LoginButton,
  LogoutButton,
  GamePlayButton,
} from '../../facebookModel';
import {
  colorTemplateHightlight,
  colorContrast,
} from '../../../../../assets/colors';

type ButtonsProps = {
  buttons: (
    | URLButton
    | PostbackButton
    | CallButton
    | LoginButton
    | LogoutButton
    | GamePlayButton
  )[];
  mediaTemplate?: boolean;
};

export const Buttons = ({buttons, mediaTemplate}: ButtonsProps) => {
  return (
    <>
      {buttons.map((button, idx) => {
        return (
          <View
            key={`button-${idx}`}
            style={[
              styles.button,
              mediaTemplate ? styles.buttonNoMargin : styles.buttonMargin,
            ]}>
            {button.type === 'web_url' && button.url.length ? (
              <Text
                style={styles.buttonText}
                onPress={() => Linking.openURL(button.url)}>
                {' '}
                {button.title}
              </Text>
            ) : button.type === 'account_link' ? (
              <View style={styles.buttonText}>Log In</View>
            ) : button.type === 'account_unlink' ? (
              <View style={styles.buttonText}>Log Out</View>
            ) : (
              <View style={styles.buttonText}>{button.title}</View>
            )}
          </View>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    fontWeight: '700',
    backgroundColor: colorTemplateHightlight,
    borderRadius: 8,
    textAlign: 'center',
  },
  buttonMargin: {
    marginTop: 16,
  },
  buttonNoMargin: {
    marginTop: 0,
  },
  buttonText: {
    color: colorContrast,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 8,
    paddingLeft: 8,
  },
});