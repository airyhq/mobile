import React from 'react';
import {ConversationList} from '../views/inbox/ConversationList';
import SettingsView from '../views/settings';
import InboxIcon from '../assets/images/icons/bubble_icon.svg';
import SettingsIcon from '../assets/images/icons/settings_icon.svg';
import {createStackNavigator} from '@react-navigation/stack';
import {MessageList} from '../views/inbox/MessageList';
import {colorAiryBlue, colorTextGray} from '../assets/colors';
import {SafeAreaView} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FilterHeaderBar} from './FilterHeaderBar/FilterHeaderBar';
import {NavigationStackProp} from 'react-navigation-stack';
import {MessageListHeader} from '../views/inbox/MessageList/MessageListHeader';
import {FileContent} from '../views/inbox/MessageList/FileContent';
import {FullScreenImage} from './FileComponents/FullScreenImage';

export const TabBar = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();
  const SettingsStack = createStackNavigator();

  const InboxScreen = () => {
    return (
      <SettingsStack.Navigator
        screenOptions={{
          header: () => {
            return (
              <SafeAreaView style={{backgroundColor: 'white'}}>
                <FilterHeaderBar />
              </SafeAreaView>
            );
          },
        }}>
        <SettingsStack.Screen name="Inbox" component={ConversationList} />
      </SettingsStack.Navigator>
    );
  };

  const SettingsScreen = () => {
    return (
      <SettingsStack.Navigator
        screenOptions={{
          headerShown: true,
          headerTitleStyle: {fontFamily: 'Lato', fontSize: 20},
        }}>
        <SettingsStack.Screen name="Settings" component={SettingsView} />
      </SettingsStack.Navigator>
    );
  };

  const TabBarScreens = () => {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused}) => {
            let iconColor: string;
            iconColor = focused ? colorAiryBlue : colorTextGray;
            if (route.name === 'Settings') {
              return <SettingsIcon height={32} width={32} fill={iconColor} />;
            }

            if (route.name === 'Inbox') {
              return <InboxIcon height={32} width={32} fill={iconColor} />;
            }
          },
        })}
        tabBarOptions={{
          activeTintColor: colorAiryBlue,
          inactiveTintColor: colorTextGray,
          labelStyle: {
            fontSize: 12,
            fontFamily: 'Lato',
          },
        }}>
        <Tab.Screen name="Inbox" component={InboxScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    );
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Inbox"
        component={TabBarScreens}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MessageList"
        component={MessageList}
        options={({route, navigation}: NavigationStackProp) => ({
          headerTitleAlign: 'left',
          headerBackTitleVisible: false,
          headerTitle: () => {
            return (
              <SafeAreaView>
                <MessageListHeader route={route} navigation={navigation} />
              </SafeAreaView>
            );
          },
        })}
      />
      <Stack.Screen
        name="FileContent"
        component={FileContent}
        options={({route}: NavigationStackProp) => ({
          headerTitle: route.params.fileName,
          headerBackTitle: '',
        })}
      />
      <Stack.Screen
        name="FullScreenImage"
        component={FullScreenImage}
        options={{
          headerTitle: '',
          headerBackTitle: '',
        }}
      />
    </Stack.Navigator>
  );
};
