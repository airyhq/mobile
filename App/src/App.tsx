import React, {useState} from 'react';
import {SafeAreaView, Button} from 'react-native';
import Auth0 from 'react-native-auth0';
import {Login} from './components/Auth/Login';
import {connect} from 'react-redux';
import {StateModel} from './reducers';

const credentials = require('./auth0-configuration.ts').default;
const auth0 = new Auth0(credentials);

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
      .then(success => {
        setAccessToken(null);
        setUserLoggedOut(true);
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
