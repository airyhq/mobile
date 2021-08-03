import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {Login} from './components/Login';
import {UserInfo} from './model/userInfo';
import {RealmDB} from './storage/realm';
import {TabBar} from './components/TabBar';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>();

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

  return (
    <>
      <SafeAreaProvider>
        <NavigationContainer>
          {userInfo ? <TabBar /> : <Login />}
        </NavigationContainer>
      </SafeAreaProvider>
    </>
  );
};

export default App;
