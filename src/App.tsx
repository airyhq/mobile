import React, {useEffect, useState} from 'react';
import {SafeAreaView, Dimensions} from 'react-native';
import {Login} from './components/Login';
import {Settings} from './components/Settings';
import {Logout} from './components/Logout';
import {UserInfo} from './model/userInfo';
import {RealmDB} from './storage/realm';
import {TabBar} from './components/TabBar';
import ConversationList from './views/inbox/ConversationList';
import {MessageList} from './views/inbox/MessageList';
import ConversationListItem from './views/inbox/ConversationListItem';
import {INBOX_ROUTE, INBOX_CONVERSATIONS_ROUTE} from './routes/routes';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const App = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>();
  //   Realm.open({}).then(realm => {
  //     console.log("Realm is located at: " + realm.path);
  // });

  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

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
          <Stack.Navigator initialRouteName="Inbox">
            <Stack.Screen
              name="Inbox"
              component={TabBar}
              options={{headerShown: false}}
            />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="MessageList" component={MessageList} />
           
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </>
  );
};
export default App;
