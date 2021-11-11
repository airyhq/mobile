import React, {useState} from 'react';
import {Dimensions, View, Text, StyleSheet, Platform} from 'react-native';
import {NavigationStackProp} from 'react-navigation-stack';
import {Avatar} from '../../../components/Avatar';
import {CurrentState} from '../../../components/CurrentState';
import IconChannel from '../../../components/IconChannel';

export const MessageListHeader = ({route, navigation}: NavigationStackProp) => {
  const [state, setState] = useState<string>(route.params.state || 'OPEN');

  const stateUpdate = (newState: string) => {
    setState(newState);
  };

  return (
    <View style={styles.container}>
      <Avatar
        avatarUrl={route.params.avatarUrl}
        small={true}
        style={{
          height: 32,
          width: 32,
        }}
      />
      <View style={styles.titleIconChannelContainer}>
        <Text style={styles.title}>{route.params.displayName}</Text>
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
        state={state}
        pressable={true}
        navigation={navigation}
        setState={stateUpdate}
      />
    </View>
  );
};

const WINDOW_WIDTH = Dimensions.get('window').width;
const HEADER_HEIGHT = 44;
const BACKBUTTON_WIDTH = 32;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: WINDOW_WIDTH - BACKBUTTON_WIDTH,
    height: HEADER_HEIGHT,
    backgroundColor: 'white',
    marginLeft: Platform.OS === 'ios' ? -40 : -20,
  },
  titleIconChannelContainer: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontFamily: 'Lato',
    fontSize: 18,
  },
});
