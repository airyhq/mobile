import React, {useEffect, useState} from 'react';
import {SafeAreaView, Dimensions} from 'react-native';
import {Login} from './components/Login';
import {Settings} from './components/Settings';
import {Logout} from './components/Logout';
import {UserInfo} from './model/userInfo';
import {RealmDB} from './storage/realm';
import ConversationList from './views/inbox/ConversationList';
import {MessageList} from './views/inbox/MessageList';
import ConversationListItem from './views/inbox/ConversationListItem';
import {INBOX_ROUTE, INBOX_CONVERSATIONS_ROUTE} from './routes/routes';
import {TabBar} from './components/TabBar';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const App = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>();
  //   Realm.open({}).then(realm => {
  //     console.log("Realm is located at: " + realm.path);
  // });

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

  //{userInfo ? <Logout userInfo={userInfo} /> :   <Stack.Screen name="ConversationList" component={ConversationList} />} 
  const {height, width} = Dimensions.get('window');
  console.log('height ', height);
  console.log('width ', width);
  

  return (
    <>
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ConversationList">
          <Stack.Screen name="ConversationList" component={ConversationList} options={{ headerShown: false }}/>
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="MessageList" component={MessageList} />


        </Stack.Navigator>
      </NavigationContainer>
      </SafeAreaProvider>

      </>
  );
};
export default App;
