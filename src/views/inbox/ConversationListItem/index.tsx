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
import {RealmDB} from '../../../storage/realm';
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

type ConversationListItemProps = {
  conversation: Conversation;
  navigation?: NavigationStackProp<{conversationId: string}>;
};

export const ConversationListItem = (props: ConversationListItemProps) => {
  const {conversation, navigation} = props;
  const participant = conversation.metadata.contact;
  const unread = conversation.metadata.unreadCount > 0;
  const currentConversationState = conversation.metadata.state || 'OPEN';
  const realm = RealmDB.getInstance();
  const swipeableRef = useRef<Swipeable | null>(null);

  const LeftSwipe = (dragX: Animated.AnimatedInterpolation) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0.7, 0],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.6}>
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
            }}>
            {currentConversationState === 'OPEN'
              ? 'SET TO CLOSED'
              : 'SET TO OPEN'}
          </Animated.Text>
        </View>
      </TouchableOpacity>
    );
  };

  const changeState = () => {
    const newState = currentConversationState === 'OPEN' ? 'CLOSED' : 'OPEN';
    api
      .setStateConversation({
        conversationId: conversation.id,
        state: newState,
      })
      .then(() => {
        realm.write(() => {
          const changedConversation: Conversation = realm
            .objectForPrimaryKey('Conversation', conversation.id)
            .toJSON();
          changedConversation.metadata.state = newState;
        });
      });
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
    changeState();
    close();
  };

  return (
    <Swipeable ref={swipeableRef} renderRightActions={LeftSwipe}>
      <Pressable style={styles.clickableListItem} onPress={onSelectItem}>
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
                  {width: '80%'},
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
            <View style={styles.channelTimeContainer}>
              <View style={styles.iconChannel}>
                <IconChannel
                  metadataName={conversation.channel.metadata.name}
                  source={conversation.channel.source}
                  sourceChannelId={conversation.channel.sourceChannelId}
                  showAvatar
                  showName
                />
              </View>
              <View style={styles.timeIcon}>
                <Text style={styles.channel}>
                  {formatTimeOfMessage(conversation.lastMessage)}
                </Text>
                <RightArrow height={12} width={12} fill="black" />
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
    height: 100,
    width: width,
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    display: 'flex',
    marginBottom: 20,
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
    color: colorTextContrast,
    paddingTop: 10,
    fontFamily: 'Lato',
  },
  unreadName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colorAiryBlue,
    paddingTop: 10,
    fontFamily: 'Lato',
  },
  message: {
    color: colorTextGray,
    fontSize: 15,
    fontWeight: '400',
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: 'Lato',
  },
  unreadMessage: {
    color: colorTextContrast,
    fontSize: 15,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: 'Lato',
  },
  channel: {
    fontSize: 13,
    color: colorTextGray,
    alignSelf: 'center',
    marginLeft: 4,
    fontFamily: 'Lato',
  },
  nameStatus: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginRight: 6,
  },
  channelTimeContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: channelTimeWidth,
    justifyContent: 'space-between',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderColor: colorLightGray,
    alignItems: 'center',
  },
  iconChannel: {
    display: 'flex',
    flexDirection: 'row',
    height: 20,
  },
  timeIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 20,
    marginRight: -3,
  },
  container: {
    display: 'flex',
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
