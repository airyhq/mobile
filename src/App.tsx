import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';

import {Login} from './components/Login';
import { Logout } from './components/Logout';
import { UserInfo } from './model/userInfo';
import { RealmDB } from './storage/realm';

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
  }
 
  return (
      <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
        {userInfo ? <Logout userInfo={userInfo} /> : <Login />}        
      </SafeAreaView>
  );
};

export default App;
