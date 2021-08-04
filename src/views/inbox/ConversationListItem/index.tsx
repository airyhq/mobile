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
import {Conversation} from '../../../model/Conversation';
import IconChannel from '../../../components/IconChannel';
import {formatTimeOfMessage} from '../../../services/format/date';
import Checkmark from '../../../assets/images/icons/checkmark-circle.svg';
import RightArrow from '../../../assets/images/icons/rightArrow.svg';
import {HttpClientInstance} from '../../../InitializeAiryApi';
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
} from '../../../assets/colors';

type ConversationListItemProps = {
  conversation: Conversation;
  navigation?: any;
};

export const ConversationListItem = (props: ConversationListItemProps) => {
  const {conversation, navigation} = props;
  const participant = conversation.metadata.contact;
  const unread = conversation.metadata.unreadCount > 0;
  const currentConversationState = conversation.metadata.state || 'OPEN';
  const realm = RealmDB.getInstance();
  const swipeableRef = useRef<Swipeable | null>(null);

  const LeftSwipe = (dragX: any) => {
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
              color: `${colorLightGray}`,
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
    HttpClientInstance.setStateConversation({
      conversationId: conversation.id,
      state: newState,
    })
      .then(() => {
        realm.write(() => {
          const changedConversation: any = realm.objectForPrimaryKey(
            'Conversation',
            conversation.id,
          );
          changedConversation.metadata.state = newState;
        });
      })
      .catch((error: Error) => {
        console.log('error: ', error);
      });
  };
  const OpenStateButton = () => {
    return <View style={styles.openStateButton} />;
  };
  const ClosedStateButton = () => {
    return (
      <View style={styles.closedStateButton}>
        <Checkmark height={24} width={24} fill={`${colorSoftGreen}`} />
      </View>
    );
  };

  const markAsRead = () => {
    if (unread) {
      HttpClientInstance.readConversations(conversation.id);
    }
  };

  const onSelectItem = () => {
    markAsRead();
    navigation.navigate('MessageList');
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
            {unread ? <View style={styles.unreadMessageIndicator} /> : <View style={styles.readMessageIndicator} />}
            <Avatar contact={participant} />
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.nameStatus}>
              <Text style={unread ? styles.unreadName : styles.name}>
                {participant && participant.displayName}
              </Text>
              {currentConversationState === 'OPEN' ? (
                <OpenStateButton />
              ) : (
                <ClosedStateButton />
              )}
            </View>
            <Text style={unread ? styles.unreadMessage : styles.message}>
              <SourceMessagePreview conversation={conversation} />
            </Text>
            <View style={styles.channelTimeContainer}>
              <View style={styles.iconChannel}>
                <IconChannel
                  channel={conversation.channel}
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
    width: width * 0.8,
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
    fontWeight: '500',
    color: `${colorTextContrast}`,
    paddingTop: 10,
  },
  unreadName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: `${colorAiryBlue}`,
    paddingTop: 10,
  },
  message: {
    color: `${colorTextContrast}`,
    fontSize: 15,
    fontWeight: '500',
    paddingTop: 10,
    paddingBottom: 10,
  },
  unreadMessage: {
    color: `${colorTextContrast}`,
    fontSize: 15,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 10,
  },
  channel: {
    fontSize: 13,
    color: `${colorTextContrast}`,
    alignSelf: 'center',
    marginLeft: 4,
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
    width: width * 0.73,
    justifyContent: 'space-between',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderColor: `${colorLightGray}`,
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
  openStateButton: {
    borderWidth: 2,
    borderColor: `${colorStateRed}`,
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
  toggleStateBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.2,
    height: 92,
    textAlign: 'center',
  },
  open: {
    backgroundColor: `${colorStateRed}`,
  },
  closed: {
    backgroundColor: `${colorSoftGreen}`,
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
