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
};

const ConversationListItem = (props: ConversationListItemProps) => {
  const {conversation, active} = props;
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
          <Text style={styles.name}>Name</Text>
          <Text style={styles.message}>Message</Text>
          <View style={styles.channelTimeContainer}>
          <Text style={styles.channel}>Channel</Text>
          <Text style={styles.channel}>Time</Text>
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
    backgroundColor: 'red',
    height: 100,
    borderBottomColor: 'green',
    borderBottomWidth: 1
  },
  contentContainer: {
    display: 'flex',
    marginBottom: 20,
    paddingLeft: 16
  },
  name: {
    color: 'white',
    paddingTop: 10,
  },
  message: {
    color: 'white',
    paddingTop: 10,
  },
  channel: {
    color: 'white',
    alignSelf: 'center',
    paddingTop: 10,
  },
  channelTimeContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: 260,
    justifyContent: 'space-between',
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderColor: 'white'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 3,
    backgroundColor: 'transparent',
    height: 150
  },
});
