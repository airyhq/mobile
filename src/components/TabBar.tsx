import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ConversationList} from '../views/inbox/ConversationList';
import {Settings} from '../components/Settings';
import InboxIcon from '../assets/images/icons/bubble_icon.svg';
import SettingsIcon from '../assets/images/icons/settings_icon.svg';
import {createStackNavigator} from '@react-navigation/stack';
import MessageList from '../views/inbox/MessageList';
import {colorAiryBlue, colorTextGray} from '../assets/colors';
import {Avatar} from './Avatar';
import {CurrentState} from './CurrentState';
import {View} from 'react-native';

export const TabBar = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  const TabBarScreens = () => {
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
            fontFamily: 'Lato',
          },
        }}>
        <Tab.Screen name="Inbox" component={ConversationList} />
        <Tab.Screen name="Settings" component={Settings} />
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
        name="Settings"
        component={Settings}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="MessageList"
        component={MessageList}
        options={({route, navigation}: any) => ({
          title: `${route.params.displayName}`,
          headerTitleAlign: 'left',
          headerTitleStyle: {fontFamily: 'Lato'},
          headerBackTitleVisible: false,
          headerRight: () => {
            return (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Avatar avatarUrl={route.params.avatarUrl} small={true} />
                <CurrentState
                  conversationId={route.params.conversationId}
                  state={route.params.state}
                  pressable={true}
                  style={{marginBottom: 10, marginRight: 20}}
                  navigation={navigation}
                />
              </View>
            );
          },
        })}
      />
    </Stack.Navigator>
  );
};
