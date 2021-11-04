import React from 'react';
import {View, StyleSheet, Pressable, StyleProp, ViewStyle} from 'react-native';
import {colorSoftGreen, colorStateRed} from '../assets/colors';
import Checkmark from '../assets/images/icons/checkmark-circle.svg';
import {changeConversationState} from '../api/Conversation';

type CurrentStateProps = {
  state: string;
  conversationId: string;
  pressable: boolean;
  style?: StyleProp<ViewStyle>;
  setState?: (newState: string) => void;
};

export const CurrentState = (props: CurrentStateProps) => {
  const {state, conversationId, pressable, style, setState} = props;
  const currentConversationState = state || 'OPEN';

  const OpenStateButton = () => {
    return (
      <>
        {pressable ? (
          <Pressable
            onPress={() =>
              changeConversationState(
                currentConversationState,
                conversationId,
                setState,
              )
            }
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
            onPress={() =>
              changeConversationState(
                currentConversationState,
                conversationId,
                setState,
              )
            }>
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
