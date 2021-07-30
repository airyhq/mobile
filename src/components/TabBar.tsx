import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ConversationList from '../views/inbox/ConversationList';
import {Settings} from '../components/Settings';
import InboxIcon from '../assets/images/icons/bubble_icon.svg';
import SettingsIcon from '../assets/images/icons/settings_icon.svg';

export const TabBar = () => {
  const Tab = createBottomTabNavigator();

  const airyBlue = '#1578d4';
  const textGray = '#737373';

  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
        tabBarIcon: ({ focused}) => {
          let iconColor;

          console.log('route.name', route.name)

          iconColor = focused ? airyBlue : textGray;


          if (route.name === 'Settings') {
            return <SettingsIcon height={32} width={32} fill={iconColor} />;
          } 

          if (route.name === 'Inbox') {
            return <InboxIcon height={32} width={32} fill={iconColor} />;
            //return <Inbox height={30} width={30} fill={iconColor} />;
          }

          // You can return any component that you like here!
          //return <Inbox height={12} width={12} fill='red' />;
        },
      })}
      tabBarOptions={{
        activeTintColor: airyBlue,
        inactiveTintColor: textGray,
        labelStyle: {
          fontSize: 12,
        }
      }}>
      <Tab.Screen name="Inbox" component={ConversationList}/>
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};
