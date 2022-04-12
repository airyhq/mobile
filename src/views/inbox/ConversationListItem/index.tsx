import React, {useRef} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {Conversation} from '../../../model';
import IconChannel from '../../../components/IconChannel';
import {formatTimeOfMessage} from '../../../services/format/date';
import RightArrow from '../../../assets/images/icons/rightArrow.svg';
import {Avatar} from '../../../components/Avatar';
import {SourceMessagePreview} from '../../../render/SourceMessagePreview';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
  colorAiryBlue,
  colorLightGray,
  colorSoftGreen,
  colorStateRed,
  colorTextContrast,
  colorTextGray,
} from '../../../assets/colors';
import {NavigationStackProp} from 'react-navigation-stack';
import {CurrentState} from '../../../components/CurrentState';
import {api} from '../../../api';
import {changeConversationState} from '../../../api/Conversation';
import {hapticFeedbackOptions} from '../../../services/hapticFeedback';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useTheme} from '@react-navigation/native';

type ConversationListItemProps = {
  conversation: Conversation;
  navigation?: NavigationStackProp<{conversationId: string}>;
};

export const ConversationListItem = (props: ConversationListItemProps) => {
  const {conversation, navigation} = props;
  const participant = conversation.metadata.contact;
  const unread = conversation.metadata.unreadCount > 0;
  const currentConversationState = conversation.metadata.state || 'OPEN';
  const swipeableRef = useRef<Swipeable | null>(null);
  const {colors} = useTheme();

  const LeftSwipe = (dragX: Animated.AnimatedInterpolation) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0.7, 0],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity
        style={{backgroundColor: colors.background}}
        onPress={handlePress}
        activeOpacity={0.6}>
        <View
          style={[
            styles.toggleStateBox,
            currentConversationState === 'OPEN' ? styles.closed : styles.open,
          ]}>
          <Animated.Text
            style={{
              transform: [{translateX: scale}],
              color: colorLightGray,
              textAlign: 'center',
              fontFamily: 'Lato',
            }}>
            {currentConversationState === 'OPEN'
              ? 'SET TO CLOSED'
              : 'SET TO OPEN'}
          </Animated.Text>
        </View>
      </TouchableOpacity>
    );
  };

  const markAsRead = () => {
    if (unread) {
      api.readConversations(conversation.id);
    }
  };

  const onSelectItem = () => {
    markAsRead();
    navigation.push('MessageList', {
      conversationId: conversation.id,
      avatarUrl: conversation.metadata.contact.avatarUrl,
      displayName: conversation.metadata.contact.displayName,
      state: conversation.metadata.state,
      source: conversation.channel.source,
      sourceChannelId: conversation.channel.sourceChannelId,
      metadataName: conversation.channel.metadata.name,
    });
  };

  const close = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
  };

  const handlePress = () => {
    ReactNativeHapticFeedback.trigger('impactHeavy', hapticFeedbackOptions);
    changeConversationState(currentConversationState, conversation.id);
    close();
  };

  return (
    <Swipeable ref={swipeableRef} renderRightActions={LeftSwipe}>
      <Pressable
        style={[styles.clickableListItem, {backgroundColor: colors.background}]}
        onPress={onSelectItem}>
        <View style={styles.container}>
          <View style={styles.avatar}>
            {unread ? (
              <View style={styles.unreadMessageIndicator} />
            ) : (
              <View style={styles.readMessageIndicator} />
            )}
            <Avatar avatarUrl={participant.avatarUrl} />
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.nameStatus}>
              <Text
                numberOfLines={1}
                style={[
                  {width: '80%', color: colors.text},
                  unread ? styles.unreadName : styles.name,
                ]}>
                {participant && participant.displayName}
              </Text>
              <CurrentState
                conversationId={conversation.id}
                state={conversation.metadata.state || 'OPEN'}
                pressable={false}
              />
            </View>
            <View
              style={[
                {width: '85%', height: 38},
                unread ? styles.unreadMessage : styles.message,
              ]}>
              <SourceMessagePreview conversation={conversation} />
            </View>
            <View
              style={[
                styles.channelTimeContainer,
                {borderColor: colors.border},
              ]}>
              <View style={styles.iconChannel}>
                <IconChannel
                  metadataName={conversation.channel.metadata.name}
                  source={conversation.channel.source}
                  sourceChannelId={conversation.channel.sourceChannelId}
                  showAvatar
                  showName
                />
              </View>
              <View style={styles.timeIconContainer}>
                <Text style={[styles.time, {color: colors.text}]}>
                  {formatTimeOfMessage(conversation.lastMessage)}
                </Text>
                <RightArrow height={12} width={12} fill={colors.text} />
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
};

const {width} = Dimensions.get('window');
const itemContentWidth = width * 0.8;
const channelTimeWidth = width * 0.73;
const sliderWidth = width * 0.2;

const styles = StyleSheet.create({
  clickableListItem: {
    height: 'auto',
    minHeight: 100,
    width: width,
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    marginTop: 8,
    marginBottom: 8,
    paddingLeft: 10,
    width: itemContentWidth,
  },
  avatar: {
    flexDirection: 'row',
    height: 60,
    marginLeft: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '400',
    paddingTop: 10,
    color: colorTextContrast,
    fontFamily: 'Lato',
  },
  unreadName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colorAiryBlue,
    fontFamily: 'Lato',
  },
  message: {
    color: colorTextGray,
    height: 'auto',
    fontSize: 15,
    fontWeight: '400',
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: 'Lato',
  },
  unreadMessage: {
    color: colorTextContrast,
    height: 'auto',
    fontSize: 15,
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: 'bold',
    fontFamily: 'Lato',
  },
  nameStatus: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginRight: 6,
  },
  channelTimeContainer: {
    flexDirection: 'row',
    width: channelTimeWidth,
    justifyContent: 'space-between',
    paddingBottom: 4,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  iconChannel: {
    flex: 1,
  },

  timeIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 'auto',
    marginRight: -3,
  },
  time: {
    fontSize: 13,
    alignSelf: 'center',
    marginLeft: 4,
    fontFamily: 'Lato',
  },
  container: {
    flexDirection: 'row',
  },
  toggleStateBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: sliderWidth,
    height: 92,
    textAlign: 'center',
  },
  open: {
    backgroundColor: colorStateRed,
  },
  closed: {
    backgroundColor: colorSoftGreen,
  },
  unreadMessageIndicator: {
    height: 8,
    width: 8,
    backgroundColor: colorAiryBlue,
    borderRadius: 50,
    marginRight: 4,
  },
  readMessageIndicator: {
    height: 8,
    width: 8,
    backgroundColor: 'transparent',
    borderRadius: 50,
    marginRight: 4,
  },
});
