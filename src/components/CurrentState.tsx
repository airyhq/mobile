import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import {colorSoftGreen, colorStateRed} from '../assets/colors';
import Checkmark from '../assets/images/icons/checkmark-circle.svg';
import {changeConversationState} from '../api/Conversation';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {hapticFeedbackOptions} from '../services/hapticFeedback';
import {useTheme} from '@react-navigation/native';

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
  const {colors} = useTheme();

  const OpenStateButton = () => {
    return (
      <>
        {pressable ? (
          <View
            style={[
              Platform.OS === 'android' && {marginRight: 20},
              {
                backgroundColor: colors.background,
                width: 44,
                height: 44,
                justifyContent: 'center',
              },
            ]}>
            <Pressable
              hitSlop={{top: 10, right: 48, bottom: 10}}
              onPress={() => {
                ReactNativeHapticFeedback.trigger(
                  'impactHeavy',
                  hapticFeedbackOptions,
                );
                changeConversationState(
                  currentConversationState,
                  conversationId,
                  setState,
                );
              }}
              style={[
                styles.openStateButtonPress,
                {
                  position: 'relative',
                  left: 3,
                  height: 24,
                  width: 24,
                },
              ]}
            />
          </View>
        ) : (
          <View style={styles.openStateButton} />
        )}
      </>
    );
  };

  const ClosedStateButton = () => {
    return (
      // <View
      //   style={[
      //     pressable ? styles.closedStateButtonPress : styles.closedStateButton,
      //     style,
      //   ]}>
      <View
        style={[
          Platform.OS === 'android' && {marginRight: 20},
          pressable
            ? {
                width: 44,
                height: 44,
                justifyContent: 'center',
              }
            : styles.closedStateButton,
        ]}>
        {pressable ? (
          <Pressable
            hitSlop={{top: 10, right: 48, bottom: 10}}
            onPress={() => {
              ReactNativeHapticFeedback.trigger(
                'impactHeavy',
                hapticFeedbackOptions,
              );
              changeConversationState(
                currentConversationState,
                conversationId,
                setState,
              );
            }}>
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
  openStateButtonPress: {
    borderWidth: 1,
    borderColor: colorStateRed,
    height: 20,
    width: 20,
    borderRadius: 50,
    marginRight: Platform.OS === 'ios' ? 10 : 10,
    // marginRight: Platform.OS === 'ios' ? 10 : 20,
  },
  closedStateButtonPress: {
    height: 20,
    width: 20,
    borderRadius: 50,
    // marginRight: Platform.OS === 'ios' ? 24 : 34,
    marginRight: Platform.OS === 'ios' ? 24 : 24,
    paddingTop: 0,
    marginTop: -12,
  },
});
