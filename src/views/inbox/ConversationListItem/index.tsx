import React, { useRef } from 'react';
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
import {HttpClientInstance} from '../../../InitializeAiryApi';
import {Avatar} from '../../../components/Avatar';
import {SourceMessagePreview} from '../../../render/SourceMessagePreview';
import {RealmDB} from '../../../storage/realm';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { getUserInfo } from '../../../model/userInfo';

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

  console.log('USER: ', getUserInfo());
  

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
              color: '#cad5db',
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
        <Checkmark height={24} width={24} fill="#0da36b" />
      </View>
    );
  };

  const markAsRead = () => {
    if (unread) {
      HttpClientInstance.readConversations(conversation.id);
    }
  };  

  const onSelectItem = () => {
    markAsRead()
    console.log(navigation);
    
    navigation.navigate('Inbox', {
      screen: 'MessageList'
    })
  }

  const close = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
  };

  const handlePress = () => {
    changeState()
    close();
  };

  return (
    <Swipeable ref={swipeableRef} renderRightActions={LeftSwipe}>
      <Pressable
        style={styles.clickableListItem}
        onPress={onSelectItem}>
        <View style={styles.container}>
          <View style={styles.avatar}>
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
            <View style={styles.message}>
              <SourceMessagePreview conversation={conversation} />
            </View>
            <View style={styles.channelTimeContainer}>
              <View style={styles.iconChannel}>
                <IconChannel
                  channel={conversation.channel}
                  showAvatar
                  showName
                />
                <Text style={styles.channel}>
                  {conversation.channel.sourceChannelId}
                </Text>
              </View>
              <View style={styles.timeIcon}>
                <Text style={styles.channel}>
                  {formatTimeOfMessage(conversation.lastMessage)}
                </Text>
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
    paddingLeft: 16,
    width: width * 0.8,
  },
  avatar: {
    marginLeft: 8,
    marginTop: 8,
  },
  name: {
    fontSize: 16,
    color: 'black',
    paddingTop: 10,
  },
  unreadName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1578d4',
    paddingTop: 10,
  },
  message: {
    color: 'black',
    paddingTop: 10,
    paddingBottom: 10,
  },
  channel: {
    fontSize: 12,
    color: 'black',
    alignSelf: 'center',
    marginLeft: 4,
  },
  nameStatus: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  channelTimeContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: width * 0.73,
    justifyContent: 'space-between',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderColor: 'gray',
    alignItems: 'flex-end',
  },
  iconChannel: {
    display: 'flex',
    flexDirection: 'row',
  },
  timeIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  openStateButton: {
    borderWidth: 2,
    borderColor: '#bf1a2f',
    height: 20,
    width: 20,
    borderRadius: 50,
    marginRight: 10,
  },
  closedStateButton: {
    borderColor: '#0da36b',
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
    backgroundColor: '#bf1a2f',
  },
  closed: {
    backgroundColor: '#0da36b',
  },
});
