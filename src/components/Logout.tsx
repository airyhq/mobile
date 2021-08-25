import React from 'react';
import {View, Button, StyleSheet, Text} from 'react-native';
import Auth0 from 'react-native-auth0';
import { Auth0Config } from '../auth0-configuration';
import { UserInfo } from '../model/userInfo';
import { RealmDB } from '../storage/realm';

const auth0 = new Auth0(Auth0Config);

type LogoutProps = {
  userInfo: UserInfo
}

export const Logout = (props: LogoutProps) => {

  const {userInfo} = props;

  const logoutAndEraseRealm = () => {
    auth0.webAuth
      .clearSession({federated: false})
      .then(() => {
        const realm = RealmDB.getInstance();
        realm.write(() => {    
          realm.deleteAll();        
        });        
      })
      .catch((error: Error) => {
        console.error(error);
      });
  };
  
  return (
    <View style={styles.container}>
      <Text>{userInfo.accessToken}</Text>
      <Button
        onPress={logoutAndEraseRealm}
        title="LOG OUT"
        color="#841584"
        accessibilityLabel="logout"
      />
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
  }
});