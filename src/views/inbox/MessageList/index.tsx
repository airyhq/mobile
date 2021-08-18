<<<<<<< HEAD
import React from 'react';
<<<<<<< HEAD
import {useEffect} from 'react';
import {Dimensions} from 'react-native';
import {StyleSheet, SafeAreaView} from 'react-native';
import {HttpClientInstance} from '../../../InitializeAiryApi';

type MessageListProps = {
  route: any;
};

const listMessages = (
  conversationId: string,
  cursor?: string,
  page_size?: string,
) => {
  HttpClientInstance.listMessages({conversationId})
    .then((response: any) => {})
    .catch((error: Error) => {
      console.log('Error: ', error);
    });
=======
import {Dimensions, View} from 'react-native';
import {StyleSheet, SafeAreaView} from 'react-native';
=======
import React, {useEffect, createRef, useState} from 'react';
import {Dimensions, ScrollView, View, StyleSheet, SafeAreaView} from 'react-native';
>>>>>>> e9a6dcf (added message list)
import { InputBar } from '../../../components/InputBar';
import {RealmDB} from '../../../storage/realm';
import {HttpClientInstance} from '../../../InitializeAiryApi';
import {parseToRealmMessage, Message} from '../../../model';
import {formatTime, isSameDay} from '../../../services/dates';
import {formatDateOfMessage} from '../../../services/format/date';
import {MessageInfoWrapper} from '../../../components/MessageInfoWrapper';

type MessageListProps = {
  route: any
>>>>>>> c10546d (created inputBar)
};

//missing: reaction

const MessageList = (props: MessageListProps) => {
  const {route} = props;
<<<<<<< HEAD
<<<<<<< HEAD
  const conversationId = route.params.conversationId;

  useEffect(() => {
    listMessages(conversationId);
  }, []);

  return <SafeAreaView style={styles.container}></SafeAreaView>;
=======
  return <SafeAreaView style={styles.container}>
    <View style={styles.messageList} />
    <InputBar conversationId={route.params.conversationId}/>
  </SafeAreaView>;
>>>>>>> c10546d (created inputBar)
=======
  const conversationId: string = route.params.conversationId
  const [messages, setMessages] = useState<any>([]);


  console.log('conversationId', conversationId)

  const scrollViewRef:any = createRef<HTMLDivElement>();

  const realm = RealmDB.getInstance();
  const conversation:any = realm.objectForPrimaryKey(
    'Conversation',
    conversationId,
  );

  const {
    metadata: {contact},
    channel: {source},
    paginationData,
  } = conversation;


  if (!conversation) {
    return null;
  }


  useEffect(() => {
    const databaseMessages = realm
      .objects('Message')

      databaseMessages.addListener(() => {
      setMessages([...databaseMessages]);
    });

    listMessages();

    return () => {
      databaseMessages.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (!messages || messages.length === 0) {
      conversationId && listMessages();
    }
  }, [conversationId, messages]);

  const hasDateChanged = (prevMessage: Message, message: Message) => {
    if (prevMessage == null) {
      return true;
    }

    return !isSameDay(prevMessage.sentAt, message.sentAt);
  };

  const listMessages = () => {
    HttpClientInstance.listMessages({conversationId})
      .then((response: any) => {
        console.log('response', response)
        realm.write(() => {
          for (const message of response.data) {
            console.log('message', message)
            const isStored = realm.objectForPrimaryKey(
              'Message',
              conversation.id,
            );

            if (isStored) {
              realm.delete(isStored);
            }

            realm.create(
              'Message',
              parseToRealmMessage(message, message.source),
            );
          }
        })
      }).catch((error: any)=> {
        console.log('error listMessages', error)
      })
  }

 
//onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}

//  <Reaction message={message} />


  return (
  <SafeAreaView style={styles.container}>
     <ScrollView style={styles.messageList}>
      {messages?.map((message: Message, index: number) => {
        const prevMessage = messages[index - 1];
        const nextMessage = messages[index + 1];

        const lastInGroup = nextMessage ? message.fromContact !== nextMessage.fromContact : true;

        const sentAt: any = lastInGroup ? formatTime(message.sentAt) : null;

        return (
          <View key={message.id}>
            {hasDateChanged(prevMessage, message) && (
              <View key={`date-${message.id}`} style={styles.dateHeader}>
                {formatDateOfMessage(message)}
              </View>
            )}
            <MessageInfoWrapper
              fromContact={message.fromContact}
              contact={contact}
              sentAt={sentAt}
              lastInGroup={lastInGroup}
              isChatPlugin={false}>
              <SourceMessage source={source} message={message} contentType="message" />
            </MessageInfoWrapper>
          </View>
        );
      })}
    </ScrollView>
    <InputBar conversationId={conversationId} />
  </SafeAreaView>
  )
>>>>>>> e9a6dcf (added message list)
};

//add ReactMemo
//id on a View ---> id={`message-item-${message.id}`}

export default MessageList;

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: 'white',
  },
  messageList: {
    flex: 0.5,
    backgroundColor: 'blue'
  },
dateHeader: {
  backgroundColor: 'blue'
},
});


// .dateHeader {
//   @include font-s;
//   margin: 8px auto;
//   padding: 4px 8px;
//   border-radius: 4px;
//   background-color: var(--color-background-gray);
//   color: var(--color-text-gray);
//   width: max-content;
// }
