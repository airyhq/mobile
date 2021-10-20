import React from 'react';
import {ConversationList} from '../views/inbox/ConversationList';
import SettingsView from '../views/settings';
import InboxIcon from '../assets/images/icons/bubble_icon.svg';
import SettingsIcon from '../assets/images/icons/settings_icon.svg';
import {createStackNavigator} from '@react-navigation/stack';
import MessageList from '../views/inbox/MessageList';
import {colorAiryBlue, colorTextGray} from '../assets/colors';
import {Avatar} from './Avatar';
import {CurrentState} from './CurrentState';
import {Dimensions, SafeAreaView, View} from 'react-native';
import IconChannel from './IconChannel';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FilterHeaderBar} from './FilterHeaderBar/FilterHeaderBar';

export const TabBar = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();
  const {width} = Dimensions.get('window');
  const marginRightAvatar = width * 0.84;
  const marginRightIconChannel = width * 0.76;
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
      <SettingsStack.Navigator screenOptions={{headerShown: true}}>
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
                    right: marginRightAvatar,
                    height: 32,
                    width: 32,
                  }}
                />
                <View
                  style={{marginRight: marginRightIconChannel, marginTop: 20}}>
                  <IconChannel
                    metadataName={route.params.metadataName}
                    source={route.params.source}
                    sourceChannelId={route.params.sourceChannelId}
                    showAvatar
                    showName
                  />
                </View>
                <CurrentState
                  conversationId={route.params.conversationId}
                  state={route.params.state || 'OPEN'}
                  pressable={true}
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
