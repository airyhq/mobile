import React, {useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, Text, View} from 'react-native';
import {Switch, Route, NativeRouter, Link, Redirect} from 'react-router-native';
import {Settings} from './components/Settings';

import {Login} from './components/Login';
import { Logout } from './components/Logout';
import { UserInfo } from './model/userInfo';
import { RealmDB } from './storage/realm';
import ConversationList from './views/inbox/ConversationList';
import ConversationListItem from './views/inbox/ConversationListItem';
import {MessageList} from './views/inbox/MessageList';
import {INBOX_ROUTE, INBOX_CONVERSATIONS_ROUTE} from './routes/routes';
import { TabBar } from './components/TabBar';

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

  // <Route path="/:conversationId" component={MessageList} />
  
  // return (
  //     <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
  //       {/* {userInfo ? <Logout userInfo={userInfo} /> : <Login />}         */}
  //       <NativeRouter>
  //         <Route path={INBOX_ROUTE} component={ConversationList} />
         
  //         <Route path="/settings" component={MessageList} />

  //         <Link to="/settings">

  //         <Text >
  //           Settings
  //         </Text>
  //         </Link>

  //       </NativeRouter>

  //       {userInfo ? <Logout userInfo={userInfo} /> : <ConversationList />}   
  //     </SafeAreaView>
  // );
  // <Link to="/topics" underlayColor="#f0f4f7" style={styles.navItem}>
  //           <Text>Topics</Text>
  //         </Link>

  //

  return(
    <NativeRouter>
      
      <SafeAreaView style={styles.container}>
        {userInfo ? <Logout userInfo={userInfo} /> :  <Redirect to={{ pathname: INBOX_ROUTE}}/>}  
        </SafeAreaView>
   
   
        <Route path={INBOX_ROUTE} component={ConversationList} />
        <Route path="/:conversationId" component={MessageList} />
        <Route path="/settings" component={Settings} />


    </NativeRouter>
  )
};

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    padding: 10
  },
  header: {
    fontSize: 20
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    padding: 10
  },
  subNavItem: {
    padding: 5
  },
  topic: {
    textAlign: "center",
    fontSize: 15
  }
});

export default App;
