import React from 'react';
import {View, Button, StyleSheet} from 'react-native';
import Auth0 from 'react-native-auth0';
import { Auth0Config } from '../auth0-configuration';

const auth0 = new Auth0(Auth0Config);

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
        props.changeAccessToken(credentials.accessToken);
      })
      .catch(error => {
        console.log(error)
      });
  };

  return (
    <View style={styles.container}>
      <Button title='Login' onPress={login} />      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      justifyContent: 'center', 
      alignItems: 'center',
      flex:1, 
      padding:0,
      margin:0
  },
  organizationInput: {
      borderWidth: 2,
      borderColor: '#ccc',
      borderRadius: 6,
      fontSize: 20, 
      padding: 10,
      marginTop: 5       
  }, 
  inputTitle: {
      fontSize: 20, 
  }
});