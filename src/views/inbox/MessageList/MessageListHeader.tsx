import {useTheme} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  Platform,
  Pressable,
  TextInput,
} from 'react-native';
import {NavigationStackProp} from 'react-navigation-stack';
import {colorTextGray} from '../../../assets/colors';
import {Avatar} from '../../../components/Avatar';
import {CurrentState} from '../../../components/CurrentState';
import IconChannel from '../../../components/IconChannel';
import CloseIcon from '../../../assets/images/icons/closeIcon.svg';
import {changeContactDisplayName} from '../../../api/Contact';

export const MessageListHeader = ({route}: NavigationStackProp) => {
  const [state, setState] = useState<string>(route.params.state || 'OPEN');
  const [displayName, setDisplayName] = useState(route.params.displayName);
  const [isEditing, setIsEditing] = useState(false);
  const {colors} = useTheme();

  const stateUpdate = (newState: string) => {
    setState(newState);
  };

  const startEditingDisplay = () => {
    setIsEditing(true);
  };
  const acceptNewDisplayName = () => {
    changeContactDisplayName(route.params.conversationId, displayName);
    setIsEditing(false);
  };

  const cancelEditingDisplayName = () => {
    setIsEditing(false);
    setDisplayName(route.params.displayName);
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Avatar
        avatarUrl={route.params.avatarUrl}
        small={true}
        style={{
          height: 32,
          width: 32,
        }}
      />
      <View style={styles.titleIconChannelContainer}>
        {!isEditing ? (
          <Pressable onPress={startEditingDisplay}>
            <Text
              style={[styles.title, {color: colors.text}]}
              numberOfLines={1}>
              {displayName || route.params.displayName}
            </Text>
          </Pressable>
        ) : (
          <TextInput
            style={styles.title}
            autoFocus={true}
            onChangeText={(newName: string) => setDisplayName(newName)}
            placeholder={displayName || route.params.displayName}
            onSubmitEditing={acceptNewDisplayName}
          />
        )}
        <IconChannel
          metadataName={route.params.metadataName}
          source={route.params.source}
          sourceChannelId={route.params.sourceChannelId}
          showAvatar
          showName
        />
      </View>
      {isEditing ? (
        <View
          style={{
            width: 44,
            height: 44,
            alignItems: 'flex-start',
          }}>
          <Pressable onPress={cancelEditingDisplayName}>
            <CloseIcon
              fill={colorTextGray}
              height={32}
              width={32}
              style={{marginTop: 4}}
            />
          </Pressable>
        </View>
      ) : (
        <CurrentState
          conversationId={route.params.conversationId}
          state={state}
          pressable={true}
          setState={stateUpdate}
        />
      )}
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
