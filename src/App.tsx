import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {Login} from './components/Login';
import {Settings} from './components/Settings';
import {Logout} from './components/Logout';
import {UserInfo} from './model/userInfo';
import {RealmDB} from './storage/realm';
import {TabBar} from './components/TabBar';
import MessageList from './views/inbox/MessageList';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>();
  const Stack = createStackNavigator();

  useEffect(() => {
    RealmDB.getInstance().objects('UserInfo').addListener(onUserUpdated);
  }, []);

  const onUserUpdated = (users: any, changes: any) => {
    if (users.length) {
      setUserInfo(users[0]);
    } else {
      setUserInfo(undefined);
    }
  };

  console.log('USERINFO LENGTH: ', userInfo?.accessToken);

  return (
    <>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            {userInfo ? (
              <>
                <Stack.Screen
                  name="Inbox"
                  component={TabBar}
                  options={{headerShown: false}}
                />
              </>
            ) : (
              <Stack.Screen
                name="Login"
                component={Login}
                options={{headerShown: false}}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </>
  );
};
export default App;
