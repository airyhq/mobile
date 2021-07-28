import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {Switch, Route, NativeRouter} from 'react-router-native';

import {Login} from './components/Login';
import { Logout } from './components/Logout';
import { UserInfo } from './model/userInfo';
import { RealmDB } from './storage/realm';
import ConversationList from './views/inbox/ConversationList';
import ConversationListItem from './views/inbox/ConversationListItem';
import {INBOX_ROUTE, INBOX_CONVERSATIONS_ROUTE} from './routes/routes';

const App = () => {

  const [userInfo, setUserInfo] = useState<UserInfo | undefined>();

//   Realm.open({}).then(realm => {
//     console.log("Realm is located at: " + realm.path);
// });

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
        {/* {userInfo ? <Logout userInfo={userInfo} /> : <Login />}         */}
        <NativeRouter>
   
  
          <Route path={INBOX_ROUTE} component={ConversationList} />
          <Route path="/:conversationId" component={ConversationListItem} />
        
       
        </NativeRouter>

        {userInfo ? <Logout userInfo={userInfo} /> : <ConversationList />}   
      </SafeAreaView>
  );
};

export default App;
