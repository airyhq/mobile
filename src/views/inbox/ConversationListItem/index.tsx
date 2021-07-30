import React from 'react';
import {View, StyleSheet, Pressable, Text, Dimensions, TouchableOpacity, Animated} from 'react-native';
import {Conversation} from '../../../model/Conversation';
import IconChannel from '../../../components/IconChannel';
import {formatTimeOfMessage} from '../../../services/format/date';
import Checkmark from '../../../assets/images/icons/checkmark-circle.svg';
import {INBOX_CONVERSATIONS_ROUTE} from '../../../routes/routes';
import {HttpClientInstance} from '../../../InitializeAiryApi';
import {Avatar} from '../../../components/Avatar';
import {SourceMessagePreview} from '../../../render/SourceMessagePreview';
import {RealmDB} from '../../../storage/realm';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Swipeable from 'react-native-gesture-handler/Swipeable';

type ConversationListItemProps = {
  conversation: Conversation;
};
const ConversationListItem = (props: any) => {
  const {conversation, navigation} = props;
  const participant = conversation.metadata.contact;
  const unread = conversation.metadata.unreadCount > 0;
  const currentConversationState = conversation.metadata.state || 'OPEN';
  const realm = RealmDB.getInstance();
  const eventHandler = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const LeftSwipe = (dragX:any) => {
    // const scale = dragX.interpolate({
    //   inputRange: [0, 100],
    //   outputRange: [1, 0],
    //   extrapolate: 'clamp',
    // });
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      //outputRange: [0, 100],
      // inputRange: [0, 50, 100, 101],
      // outputRange: [-20, 0, 0, 1],
      extrapolate: 'clamp',
      outputRange: [0.7, 0]

    });
    return (
      <TouchableOpacity onPress={changeState} activeOpacity={0.6} >
        <View style={[styles.toggleStateBox, currentConversationState === 'OPEN' ? styles.closed : styles.open]}>
          <Animated.Text style={{transform: [{translateX: scale}], color: '#cad5db', textAlign: 'center'}}>
            {currentConversationState === 'OPEN' ? 'SET TO CLOSED' : 'SET TO OPEN'}
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
          console.log('changedConversation', changedConversation.metadata);
        });
      })
      .catch((error: any) => {
        console.log('error: CHANGE STATE ', error);
      });
  };
  const OpenStateButton = () => {
    return <View style={styles.openStateButton} />;
  };
  const ClosedStateButton = () => {
    return (
      <View style={styles.closedStateButton} >
        <Checkmark height={24} width={24} fill="#0da36b" />
      </View>
    );
  };
  const markAsRead = () => {
    if (unread) {
      HttpClientInstance.readConversations(conversation.id);
    }
  };

 
  // useEffect(() => {
  //   markAsRead();
  // }, [conversation, currentConversationState]);
  //

  //onPress={() =>{ navigation.navigate('MessageList')}}


  return (
    <Swipeable  renderRightActions={LeftSwipe} overshootRight={true} >
    <Pressable style={styles.clickableListItem}>
        <View style={styles.container}>
          <View style={styles.avatar}>
            <Avatar contact={participant} />
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.nameStatus}>
              <Text style={unread ? styles.name : styles.unreadName}>
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
export default ConversationListItem;
const {height, width} = Dimensions.get('window');
console.log('height ', height);
console.log('width ', width);
const styles = StyleSheet.create({
  clickableListItem: {
    height: 100,
    width: width,
    flex:1,
    backgroundColor: 'white'
  },
  contentContainer: {
    display: 'flex',
    marginBottom: 20,
    paddingLeft: 16,
    width: 305,
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
    width: 285,
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
    marginRight: 10
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
    textAlign: 'center'
  }, 
  open: {
    backgroundColor: '#bf1a2f'
  }, 
  closed: {
    backgroundColor: '#0da36b'
  }
});
