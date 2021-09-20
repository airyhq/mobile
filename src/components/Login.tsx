import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Auth0 from 'react-native-auth0';
import {Auth0Config} from '../auth0-configuration';
import {RealmDB} from '../storage/realm';
import AiryLogo from '../assets/images/logo/airy_primary_rgb.svg';
import {colorAiryBlue, colorBackgroundBlue} from '../assets/colors';

const auth0 = new Auth0(Auth0Config);

export const Login = () => {
  const launchAuth0SDK = () => {
    auth0.webAuth
      .authorize({
        scope: 'openid profile email',
      })
      .then(credentials => {
        RealmDB.getInstance().write(() => {
          RealmDB.getInstance().create('UserInfo', {
            accessToken: credentials.accessToken,
          });
        });
      })
      .catch((error: Error) => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <AiryLogo height={200} width={200} />
      <TouchableOpacity style={styles.loginButton} onPress={launchAuth0SDK}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: 1,
    padding: 0,
    margin: 0,
    backgroundColor: 'white',
  },
  organizationInput: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 6,
    fontSize: 20,
    padding: 10,
    marginTop: 5,
  },
  inputTitle: {
    fontSize: 20,
  },
  loginButton: {
    backgroundColor: colorBackgroundBlue,
    padding: 8,
    borderRadius: 8,
    width: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colorAiryBlue,
  },
  loginButtonText: {
    color: colorAiryBlue,
    fontFamily: 'Lato',
    fontSize: 20,
  },
});
