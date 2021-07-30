import React from 'react';
import {View, StyleSheet, Pressable, Text, Dimensions} from 'react-native';
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
    return <Pressable style={styles.openStateButton} onPress={changeState} />;
  };
  const ClosedStateButton = () => {
    return (
      <Pressable style={styles.closedStateButton} onPress={changeState}>
        <Checkmark height={24} width={24} fill="#0da36b" />
      </Pressable>
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
    //   <Link to={`${INBOX_CONVERSATIONS_ROUTE}/${conversation.id}`}>
    //     <View
    //       style={[
    //         active ? styles.containerListItemActive : styles.containerListItem,
    //         unread ? styles.unread : '',
    //       ]}>
    //       <View style={styles.profileImage}>
    //         {/* <Avatar contact={participant} /> */}
    //       </View>
    //       <View style={styles.contactDetails}>
    //         <View style={styles.topRow}>
    //           <View style={[styles.profileName, unread ? styles.unread : '']}>
    //             <Text>{participant && participant.displayName}</Text>
    //           </View>
    //           {currentConversationState === 'OPEN' ? (
    //             <OpenStateButton />
    //           ) : (
    //             <ClosedStateButton />
    //           )}
    //         </View>
    //         <View
    //           style={[styles.contactLastMessage, unread ? styles.unread : '']}>
    //           {/* <SourceMessagePreview conversation={conversation} /> */}
    //         </View>
    //         <View style={styles.bottomRow}>
    //           <View style={styles.source}>
    //             {conversation.channel && (
    //               <IconChannel
    //                 channel={conversation.channel}
    //                 showAvatar
    //                 showName
    //               />
    //             )}
    //           </View>
    //           <View style={styles.contactLastMessageDate}>
    //             <Text>{formatTimeOfMessage(conversation.lastMessage)}</Text>
    //           </View>
    //         </View>
    //       </View>
    //     </View>
    //   </Link>
    // </Pressable>
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
    flex:1
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
    width: 80,
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
});
