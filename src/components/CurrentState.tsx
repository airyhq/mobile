import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  Vibration,
  SafeAreaView,
} from 'react-native';
import {colorSoftGreen, colorStateRed} from '../assets/colors';
import {RealmDB} from '../storage/realm';
import Checkmark from '../assets/images/icons/checkmark-circle.svg';
import {Conversation} from '../model/Conversation';
import {api} from '../api';
import {NavigationStackProp} from 'react-navigation-stack';
import {MessageListHeader} from '../views/inbox/MessageList/MessageListHeader';

type CurrentStateProps = {
  state: string;
  conversationId: string;
  pressable: boolean;
  style?: StyleProp<ViewStyle>;
  changeState?: any;
  setCurrentConversationState?: any;
  navigation?: NavigationStackProp<{conversationId: string}>;
  setState?: (newState: string) => void;
};

export const CurrentState = (props: CurrentStateProps) => {
  const {state, conversationId, pressable, style, navigation, setState} = props;
  const currentConversationState = state || 'OPEN';
  const realm = RealmDB.getInstance();

  const changeState = () => {
    navigation.setOptions = ({route, navigation}: NavigationStackProp) => ({
      headerTitle: () => {
        return (
          <SafeAreaView>
            <MessageListHeader route={route} navigation={navigation} />
          </SafeAreaView>
        );
      },
    });

    const newState = currentConversationState === 'OPEN' ? 'CLOSED' : 'OPEN';
    api
      .setStateConversation({
        conversationId: conversationId,
        state: newState,
      })
      .then(() => {
        realm.write(() => {
          const changedConversation: Conversation | undefined =
            realm.objectForPrimaryKey('Conversation', conversationId);

          if (changedConversation?.metadata?.state) {
            changedConversation.metadata.state = newState;
          }
        });
      });

    setState(newState);
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
          <Pressable
            onPress={changeConvState}
            onPressIn={() => Vibration.vibrate}>
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
