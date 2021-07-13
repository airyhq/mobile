import React, {useState, useEffect} from 'react';
import {TextInput, View, Text, Button} from 'react-native';
import Auth0 from 'react-native-auth0';
import styles from './login.style';

const credentials = require('../../auth0-configuration').default;
const auth0 = new Auth0(credentials);

type LoginProps = {
    changeAccessToken: (token: string | null) => void,
    userLoggedOut: boolean
}

export const Login = (props: LoginProps) => {
  
  const login = () => {
    auth0.webAuth
      .authorize({
        scope: 'openid profile email',
      })
      .then(credentials => {
        console.log("Authorized!");
        console.log(credentials);
        props.changeAccessToken(credentials.accessToken);
      })
      .catch(error => {
        console.log("Crap!");
        console.log(error)
      });
  };

  return (
    <View style={styles.container}>
      <Button title='Login' onPress={login} />      
    </View>
  );
};
