import React, {useEffect, useRef, useState} from 'react';
import {ConversationList} from '../views/inbox/ConversationList';
import SettingsView from '../views/settings';
import InboxIcon from '../assets/images/icons/bubble_icon.svg';
import SettingsIcon from '../assets/images/icons/settings_icon.svg';
import FilterIcon from '../assets/images/icons/filterIcon.svg';
import {createStackNavigator} from '@react-navigation/stack';
import MessageList from '../views/inbox/MessageList';
import {colorAiryBlue, colorTextGray} from '../assets/colors';
import {Avatar} from './Avatar';
import {CurrentState} from './CurrentState';
import {Animated, Dimensions, View, Text} from 'react-native';
import IconChannel from './IconChannel';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TouchableOpacity} from 'react-native-gesture-handler';

export const TabBar = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();
  const {width} = Dimensions.get('window');
  const marginRightAvatar = width * 0.84;
  const marginRightIconChannel = width * 0.76;

  const SettingsStack = createStackNavigator();

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
        <Tab.Screen name="Inbox" component={ConversationList} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    );
  };

  const [filterOpen, setFilterOpen] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('');
  const [largeTitle, setLargeTitle] = useState(false);
  const defaultHeaderHeight = 91;
  const expandedHeaderHeight = 350;
  const expandAnimation = useRef(
    new Animated.Value(expandedHeaderHeight),
  ).current;

  const onCollapse = () => {
    Animated.timing(expandAnimation, {
      toValue: expandedHeaderHeight,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const onExpand = () => {
    Animated.timing(expandAnimation, {
      toValue: defaultHeaderHeight,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const toggleFiltering = () => {
    filterOpen ? onExpand() : onCollapse();
    !filterOpen ? setHeaderTitle('Filter') : setHeaderTitle('');
    setFilterOpen(!filterOpen);
  };

  const applyFilters = () => {
    setFilterOpen(!filterOpen);
    console.log('FILTERS APPLIED');
  };

  const CollapsedFilterView = () => {
    return (
      <TouchableOpacity onPress={toggleFiltering}>
        <FilterIcon height={32} width={32} fill={colorAiryBlue} />
      </TouchableOpacity>
    );
  };

  const ExpandedFilterView = () => {
    return (
      <TouchableOpacity
        onPress={toggleFiltering}
        style={{
          position: 'absolute',
          right: 0,
          bottom: 10,
          height: 30,
          width: 80,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colorAiryBlue,
          borderRadius: 8,
        }}>
        <Text style={{color: 'white', fontFamily: 'Lato'}}>Apply</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Inbox"
        component={TabBarScreens}
        options={{
          headerShown: true,
          headerTitle: headerTitle,
          headerTitleStyle: {
            fontSize: 28,
            position: 'absolute',
            left: 0,
            top: -150,
            fontFamily: 'Lato',
          },
          headerTitleAlign: 'left',
          headerStyle: {height: expandAnimation, backgroundColor: 'pink'},
          headerRightContainerStyle: {marginRight: 8},
          headerRight: () => {
            return filterOpen ? (
              <ExpandedFilterView />
            ) : (
              <CollapsedFilterView />
            );
          },
        }}
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
