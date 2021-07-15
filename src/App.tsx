import React, {useState} from 'react';
import {SafeAreaView, Button} from 'react-native';
import {connect} from 'react-redux';
import Auth0 from 'react-native-auth0';

import {Login} from './components/Login';
import {StateModel} from './reducers';
import { Auth0Config } from './auth0-configuration';

const auth0 = new Auth0(Auth0Config);

const mapStateToProps = (state: StateModel) => ({
  state
});

const mapDispatchToProps = (dispatch:any) => ({
  dispatch
});

const App = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userLoggedOut, setUserLoggedOut] = useState(false);

  const logout = () => {
    auth0.webAuth
      .clearSession({federated: false})
      .then(credentials => {
        console.log("Logout!");
        setAccessToken(null);
        setUserLoggedOut(true);
        console.log(credentials);
      })
      .catch(error => {
        console.log('Log out cancelled');
      });
  };

  const changeAccessToken = (token: string | null) => {
    setAccessToken(token);
  };

  return (
      <SafeAreaView style={{flex: 1}}>
        {accessToken && (
          <Button
            onPress={logout}
            title="LOG OUT"
            color="#841584"
            accessibilityLabel="logout"
          />
        )}

        {!accessToken && (
          <Login
            changeAccessToken={changeAccessToken}
            userLoggedOut={userLoggedOut}
          />
        )}
      </SafeAreaView>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
