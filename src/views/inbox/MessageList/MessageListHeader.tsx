import React, {useState, useEffect} from 'react';
import {Dimensions, View, Text, StyleSheet} from 'react-native';
import {NavigationStackProp} from 'react-navigation-stack';
import {Avatar} from '../../../components/Avatar';
import {CurrentState} from '../../../components/CurrentState';
import IconChannel from '../../../components/IconChannel';
import {api} from '../../../api';
import {RealmDB} from '../../../storage/realm';

const realm = RealmDB.getInstance();

export const MessageListHeader = ({route, navigation}: NavigationStackProp) => {
  const [convState, setConvState] = useState<string>(
    route.params.state || 'OPEN',
  );

  useEffect(() => {
    console.log('convState', convState)
  }, [convState])

  // const currentConversation: any = realm.objectForPrimaryKey('Conversation', route.params.conversationId);

  // const stateUpdate = () => {
  //   const newState = route.params.state === 'OPEN' ? 'CLOSED' : 'OPEN';

  //   return api
  //   .setStateConversation({
  //     conversationId: route.params.conversationId,
  //     state: newState,
  //   })
  //   .then(() => {
  //     realm.write(() => {
        
  //       if (currentConversation?.metadata?.state) {
  //         currentConversation.metadata.state = newState;
  //       console.log('TABAR', currentConversation.metadata.state)
  //       }
  //     });

  //     setConvState(newState);
  //   });
  // };

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
        state={convState}
        pressable={true}
        style={{position: 'absolute', right: 12, top: 3}}
        navigation={navigation}
        setState={setConvState}
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
    marginLeft: -40,
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
