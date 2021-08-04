import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ConversationList} from '../views/inbox/ConversationList';
import {Settings} from '../components/Settings';
import InboxIcon from '../assets/images/icons/bubble_icon.svg';
import SettingsIcon from '../assets/images/icons/settings_icon.svg';
import {createStackNavigator} from '@react-navigation/stack';
import MessageList from '../views/inbox/MessageList';
import { colorAiryBlue, colorTextGray } from '../assets/colors';

export const TabBar = () => {
  const Tab = createBottomTabNavigator();
  const InboxStack = createStackNavigator();

  const InboxStackScreen = ({route}: any) => {
    return (
      <InboxStack.Navigator>
        <InboxStack.Screen name="Inbox" component={ConversationList} options={{headerShown: false}}/>
        <InboxStack.Screen name="MessageList" component={MessageList} options={{title: 'Name'}}/>
      </InboxStack.Navigator>
    );
  }
  const SettingsStack = createStackNavigator();

  const SettingsStackScreen = () => {
    return (
      <SettingsStack.Navigator>
        <InboxStack.Screen name="Settings" component={Settings} />
      </SettingsStack.Navigator>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          let iconColor;
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
        },
      }}>
      <Tab.Screen name="Inbox" component={InboxStackScreen} />
      <Tab.Screen name="Settings" component={SettingsStackScreen} />
    </Tab.Navigator>
  );
};
