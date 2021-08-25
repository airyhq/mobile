import React from 'react';
import {View, Button, StyleSheet} from 'react-native';
import Auth0 from 'react-native-auth0';
import { Auth0Config } from '../auth0-configuration';
import { RealmDB } from '../storage/realm';
import AiryLogo from '../assets/images/logo/airy_primary_rgb.svg';

const auth0 = new Auth0(Auth0Config);

export const Login = () => {
  
  const launchAuth0SDK = () => {
    auth0.webAuth
      .authorize({
        scope: 'openid profile email',
      })
      .then(credentials => {             
        RealmDB.getInstance().write(() => {          
          RealmDB.getInstance().create("UserInfo", {            
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
      <Button title='Login' onPress={launchAuth0SDK} />      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      justifyContent: 'center', 
      alignItems: 'center',
      flex:1, 
      padding:0,
      margin:0,
      backgroundColor: 'white'
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