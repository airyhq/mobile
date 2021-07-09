import React, {useState, useEffect} from 'react';
import {TextInput, View, Text} from 'react-native';
import Auth0 from 'react-native-auth0';
import styles from './login.style';

const credentials = require('../../auth0-configuration').default;
const auth0 = new Auth0(credentials);


//pass setAcessToken to Login

type LoginProps = {
    changeAccessToken: (token: string | null) => void,
    userLoggedOut: boolean
}

export const Login = (props: LoginProps) => {
  const [organizationName, setOrganizationName] = useState('');

  useEffect(() => {

    if(organizationName === 'Dev')
        login()

  }, [organizationName])

  useEffect(() => {

    if(props.userLoggedOut)
    setOrganizationName('')


  }, [props.userLoggedOut])

  const login = () => {
    auth0.webAuth
      .authorize({
        scope: 'openid profile email',
      })
      .then(credentials => {
        props.changeAccessToken(credentials.accessToken);
      })
      .catch(error => console.log(error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.inputTitle}>{"ORGANIZATION"}</Text>
      <TextInput style={styles.organizationInput} onChangeText={name => setOrganizationName(name)}
        placeholder={"enter your organization's name"}
        value={organizationName}
      />
    </View>
  );
};
