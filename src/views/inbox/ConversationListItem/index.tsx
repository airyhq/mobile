import React, {useEffect, useRef} from 'react';
import {Link} from 'react-router-native';
import {
  View,
  Button,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Text,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {debounce} from 'lodash-es';
import {Conversation} from '../../../model/Conversation';
import IconChannel from '../../../components/IconChannel';
// import {Avatar, SourceMessagePreview} from 'render';
import {formatTimeOfMessage} from '../../../services/format/date';
// import {ReactComponent as Checkmark} from '../../../assets/images/icons/checkmark-circle.svg';
import Hello from '../../../assets/images/icons/checkmark-circle.svg';
import {INBOX_CONVERSATIONS_ROUTE} from '../../../routes/routes';
import {HttpClientInstance} from '../../../InitializeAiryApi';
import {Avatar} from '../../../components/Avatar';

type ConversationListItemProps = {
  conversation: Conversation;
  active: boolean;
  number: number;
};

const ConversationListItem = (props: ConversationListItemProps) => {
  const {conversation, active, number} = props;
  const participant = conversation.metadata.contact;
  const unread = conversation.metadata.unreadCount > 0;
  const currentConversationState = conversation.metadata.state || 'OPEN';

  const eventHandler = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const newState = currentConversationState === 'OPEN' ? 'CLOSED' : 'OPEN';
    // conversationState(conversation.id, newState);
    event.preventDefault();
    event.stopPropagation();
  };

  const OpenStateButton = () => {
    return (
      <View style={styles.openStateButton}>
        <Button
          title="Set to closed"
          onPress={(event: any) => eventHandler(event)}
        />
      </View>
    );
  };

  const ClosedStateButton = () => {
    return (
      <View style={styles.closedStateButton}>
        <Button
          title="Set to open"
          onPress={(event: any) => eventHandler(event)}>
          {/* <Checkmark /> */}
        </Button>
      </View>
    );
  };

  const markAsRead = () => {
    if (active && unread) {
      HttpClientInstance.readConversations(conversation.id).then(() => {});
    }
  };

  useEffect(() => {
    markAsRead();
  }, [active, conversation, currentConversationState]);

  return (
    <Pressable
      style={styles.clickableListItem}
      onPress={() => console.log('PRESSED')}>
      <View style={styles.container}>
        <Avatar />
        <View
          style={{
            width: 65,
            height: 65,
            backgroundColor: 'black',
            borderRadius: 50,
            marginLeft: 8,
            marginTop: 8,
          }}
        />
        <View style={styles.contentContainer}>
          <View style={styles.nameStatus}>
            <Text style={styles.name}>{number}</Text>
            <View
              style={{
                height: 20,
                width: 20,
                backgroundColor: 'black',
                borderRadius: 50,
              }}></View>
          </View>
          <Text style={styles.message}>Message</Text>
          <View style={styles.channelTimeContainer}>
            <View style={styles.iconChannel}>
              {/* <IconChannel channel={'sdkla'}/> */}
              <View
                style={{
                  height: 20,
                  width: 20,
                  backgroundColor: 'black',
                  borderRadius: 8,
                }}></View>
              <Text style={styles.channel}>Channel</Text>
            </View>
            <View style={styles.timeIcon}>
              <Text style={styles.channel}>Time</Text>
              <View
                style={{
                  height: 8,
                  width: 8,
                  backgroundColor: 'black',
                  borderRadius: 8,
                }}></View>
            </View>
          </View>
        </View>
        <Button title="" onPress={() => console.log('dajs')}>
          <Hello width={20} height={20} fill={'blue'} />
        </Button>
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

const styles = StyleSheet.create({
  clickableListItem: {
    height: 100,
  },
  contentContainer: {
    display: 'flex',
    marginBottom: 20,
    paddingLeft: 16,
    width: 305,
  },
  name: {
    color: 'black',
    paddingTop: 10,
  },
  message: {
    color: 'black',
    paddingTop: 10,
    paddingBottom: 10,
  },
  channel: {
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
    width: 52,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  openStateButton: {

  },
  closedStateButton: {

  }
});
