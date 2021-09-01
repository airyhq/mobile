import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ConversationList} from '../views/inbox/ConversationList';
import {Settings} from '../components/Settings';
import InboxIcon from '../assets/images/icons/bubble_icon.svg';
import SettingsIcon from '../assets/images/icons/settings_icon.svg';
import {createStackNavigator} from '@react-navigation/stack';
import MessageList from '../views/inbox/MessageList';
import {colorAiryBlue, colorTextGray} from '../assets/colors';
<<<<<<< HEAD
import { StackNavigationOptions } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import { RouteProp } from '@react-navigation/native';
=======
import {Avatar} from './Avatar';
import {CurrentState} from './CurrentState';
import {View} from 'react-native';
import {Dimensions} from 'react-native';
import IconChannel from './IconChannel';
>>>>>>> 8141021 (refactored tabbar and navbar)

export const TabBar = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();
  const {width} = Dimensions.get('window');

  const TabBarScreens = () => {
    return (
<<<<<<< HEAD
      <InboxStack.Navigator>
        <InboxStack.Screen
          name="Inbox"
          component={ConversationList}
          options={{headerShown: false}}
        />
        <InboxStack.Screen
          name="MessageList"
          component={MessageList}
          options={({route}: any) => ({title: `${route.params.displayName}`, headerTitleStyle: {fontFamily: 'Lato'}})}
        />
      </InboxStack.Navigator>
    );
  };
  const SettingsStack = createStackNavigator();
=======
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused}) => {
            let iconColor;
            iconColor = focused ? colorAiryBlue : colorTextGray;
            if (route.name === 'Settings') {
              return <SettingsIcon height={32} width={32} fill={iconColor} />;
            }
>>>>>>> 8141021 (refactored tabbar and navbar)

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
        options={{headerShown: true, title: 'dsjadioas'}}
      />
      <Stack.Screen
        name="MessageList"
        component={MessageList}
        options={({route, navigation}: any) => ({
          title: `${route.params.displayName}`,
          headerTitleAlign: 'left',
          headerTitleStyle: {fontFamily: 'Lato', marginBottom: 20},
          headerBackTitleVisible: false,
          headerRight: () => {
            return (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Avatar
                  avatarUrl={route.params.avatarUrl}
                  small={true}
                  style={{
                    position: 'absolute',
                    right: width * 0.84,
                    height: 32,
                    width: 32,
                  }}
                />
                <View style={{marginRight: width * 0.76, marginTop: 20}}>
                  <IconChannel
                    source={route.params.source}
                    sourceChannelId={route.params.sourceChannelId}
                    showAvatar
                    showName
                  />
                </View>
                <CurrentState
                  conversationId={route.params.conversationId}
                  state={route.params.state}
                  pressable={true}
                  // style={{marginBottom: 10, marginRight: 17}}
                  style={{position: 'absolute', right: 12, top: 3}}
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
