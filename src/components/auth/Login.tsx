import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import jwtDecode from 'jwt-decode';
import AiryLogo from '../../assets/images/logo/airy_primary_rgb.svg';
import {
  colorAiryBlue,
  colorBackgroundBlue,
  colorStateRed,
} from '../../assets/colors';
import {RealmDB} from '../../storage/realm';
import {UpdateMode} from 'realm';
import Auth0 from 'react-native-auth0';
import {Auth0Config} from '../../auth0-configuration';

const getHost = orgName => `https://${orgName}.airy.co`;

const auth0 = new Auth0(Auth0Config);

const exchangeToken = (host, accessToken) =>
  fetch(`${host}/auth.exchange-token`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: accessToken,
    }),
  })
    .then(response => {
      return response.json()
    })
    .then(({token}) => token);

const getUserId = userInfo => `auth0:${userInfo.sub}`;

export const Login = () => {
  let [loginErr, setLoginErr] = useState<string>('');

  const loginUsingAuth0 = async () => {
    try {
      const {accessToken, idToken} = await auth0.webAuth.authorize({
        scope: 'openid profile email',
      });
      const userInfo = jwtDecode(idToken);
      const orgName = userInfo['https://airy.co/org_name'];
      const host = getHost(orgName);      
      // Exchange the auth0 access token for a JWT token for this organization's instance
      const airyToken = await exchangeToken(host, accessToken);            
      const realm = RealmDB.getInstance();
      realm.write(() => {
        realm.create(
          'UserInfo',
          {
            id: getUserId(userInfo),
            token: airyToken,
            orgName,
            host,
          },
          UpdateMode.Modified,
        );
      });
    } catch (error) {
      console.log('error', error);
      setLoginErr(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <AiryLogo height={200} width={200} />
      <TouchableOpacity style={styles.loginButton} onPress={loginUsingAuth0}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      {!!loginErr && <Text style={styles.loginErr}>{loginErr}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    width: '100%',
    padding: 20,
    margin: 0,
    backgroundColor: 'white',
  },
  infoText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  inputContainer: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 40,
    marginRight: 40,
  },
  input: {
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#aeaeae',
    fontSize: 20,
    paddingBottom: 2,
    marginRight: 0,
    flex: 2,
  },
  domainText: {
    fontSize: 20,
    height: '100%',
    color: '#808080',
    paddingTop: 10,
    paddingBottom: 4,
  },
  loginButton: {
    marginTop: 40,
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
  loginErr: {
    color: colorStateRed,
    fontFamily: 'Lato',
    fontSize: 20,
    marginTop: 20,
  },
  webviewHeader: {
    backgroundColor: 'white',
    alignItems: 'center',
    height: 150,
  },
  webview: {
    flex: 1,
  },
  closeButton: {
    backgroundColor: colorBackgroundBlue,
    paddingBottom: 24,
    paddingTop: 12,
  },
  closeButtonText: {
    color: colorAiryBlue,
    fontFamily: 'Lato',
    fontSize: 20,
    paddingLeft: 24,
  },
});
