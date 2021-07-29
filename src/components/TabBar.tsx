import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ConversationList from '../views/inbox/ConversationList';
import {Settings} from '../components/Settings';

export const TabBar = () => {
  const Tab = createBottomTabNavigator();

  return (
  
      <Tab.Navigator>
        <Tab.Screen name="Inbox" component={ConversationList} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>

  );
};
