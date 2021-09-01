import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  Vibration,
  Dimensions,
} from 'react-native';
import {colorSoftGreen, colorStateRed} from '../assets/colors';
import {HttpClientInstance} from '../InitializeAiryApi';
import {RealmDB} from '../storage/realm';
import Checkmark from '../assets/images/icons/checkmark-circle.svg';
import {Conversation} from '../model/Conversation';
import {Avatar} from './Avatar';
import IconChannel from './IconChannel';

type CurrentStateProps = {
  state: string;
  conversationId: string;
  pressable: boolean;
  style?: StyleProp<ViewStyle>;
  navigation?: any;
};

export const CurrentState = (props: CurrentStateProps) => {
  const {state, conversationId, pressable, style, navigation} = props;
  const currentConversationState = state || 'OPEN';
  const realm = RealmDB.getInstance();
  const {width} = Dimensions.get('window');

  const avatarUrl = realm.objectForPrimaryKey<Conversation>(
    'Conversation',
    conversationId,
  )?.metadata.contact.avatarUrl;

  const channel = realm.objectForPrimaryKey<Conversation>(
    'Conversation',
    conversationId,
  )?.channel;

  const changeState = () => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Avatar
              avatarUrl={avatarUrl}
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
                source={channel.source}
                sourceChannelId={channel.sourceChannelId}
                showAvatar
                showName
              />
            </View>
            <CurrentState
              conversationId={conversationId}
              state={newState}
              pressable={true}
              // style={{marginBottom: 10, marginRight: 17}}
              style={{position: 'absolute', right: 12, top: 3}}
              navigation={navigation}
            />
          </View>
        );
      },
    });
    const newState = currentConversationState === 'OPEN' ? 'CLOSED' : 'OPEN';
    HttpClientInstance.setStateConversation({
      conversationId: conversationId,
      state: newState,
    })
      .then(() => {
        realm.write(() => {
          const changedConversation: any = realm.objectForPrimaryKey(
            'Conversation',
            conversationId,
          );
          changedConversation.metadata.state = newState;
        });
      })
      .catch((error: Error) => {
        console.log('Error: ', error);
      });
  };

  const OpenStateButton = () => {
    return (
      <>
        {pressable ? (
          <Pressable
            onPress={changeState}
            onPressIn={() => Vibration.vibrate}
            style={[
              styles.openStateButton,
              // {height: 24, width: 24, marginRight: 17},
              {position: 'absolute', right: 7, top: 8, height: 24, width: 24},
            ]}
          />
        ) : (
          <View style={styles.openStateButton} />
        )}
      </>
    );
  };

  const ClosedStateButton = () => {
    return (
      <View style={[styles.closedStateButton, style]}>
        {pressable ? (
          <Pressable onPress={changeState} onPressIn={() => Vibration.vibrate}>
            <Checkmark height={30} width={30} fill={colorSoftGreen} />
          </Pressable>
        ) : (
          <Checkmark height={24} width={24} fill={colorSoftGreen} />
        )}
      </View>
    );
  };

  return <>{state === 'OPEN' ? <OpenStateButton /> : <ClosedStateButton />}</>;
};

const styles = StyleSheet.create({
  openStateButton: {
    borderWidth: 1,
    borderColor: colorStateRed,
    height: 20,
    width: 20,
    borderRadius: 50,
    marginRight: 10,
  },
  closedStateButton: {
    height: 24,
    width: 24,
    borderRadius: 50,
    marginRight: 8,
    paddingTop: 2,
  },
});
