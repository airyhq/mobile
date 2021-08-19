import React, {useEffect, createRef, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import {InputBar} from '../../../components/InputBar';
import {RealmDB} from '../../../storage/realm';
import {HttpClientInstance} from '../../../InitializeAiryApi';
import {
  parseToRealmMessage,
  Message,
  parseToRealmConversation,
} from '../../../model';
import {colorBackgroundGray, colorTextGray} from '../../../assets/colors';
import {MessageComponent} from './MessageComponent';
import {debounce} from 'lodash-es';

type MessageListProps = {
  route: any;
};

//missing: reaction

const MessageList = (props: MessageListProps) => {
  const {route} = props;
  const conversationId: string = route.params.conversationId;
  const [messages, setMessages] = useState<any>([]);
  const [offset, setOffset] = useState(0);

  console.log('conversationId', conversationId);

  const scrollViewRef: any = createRef<HTMLDivElement>();

  const realm = RealmDB.getInstance();
  const conversation: any = realm.objectForPrimaryKey(
    'Conversation',
    conversationId,
  );
  const dbMessages: any = realm.objectForPrimaryKey(
    'MessageData',
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
    if (!messages || messages.length === 0) {
      conversationId && listMessages();
    }
  }, [conversationId, messages]);


  ///add listener
  // conversationMessages.addListener(() => {
  //   setMessages([...dbMessages.messages]);
  // });

  // return () => {
  //   conversationMessages.removeAllListeners();
  // };

  const parseDataToRealmMessages = (messages: any) => {
    const parsedData = [];
    for (let message of messages) {
      parsedData.push(parseToRealmMessage(message, message.source));
    }
    return parsedData;
  };

  const listPreviousMessages = () => {
    const cursor = paginationData && paginationData.nextCursor;

    HttpClientInstance.listMessages({
      conversationId,
      pageSize: 10,
      cursor: cursor,
    })
      .then((response: any) => {
        const conversationMessages: any = realm.objectForPrimaryKey(
          'MessageData',
          conversation.id,
        );

        console.log('LIST PREV MESSAGE');

        //update with new messages data
        if (conversationMessages) {


          realm.write(() => {
            let conversationMessagesData = conversationMessages.messages;
            conversationMessagesData = conversationMessagesData.concat(
              parseDataToRealmMessages(response.data),
            );
          });

          setMessages([...conversationMessages.messages]);
        } else {
          realm.write(() => {
            realm.create('MessageData', {
              id: conversationId,
              messages: parseDataToRealmMessages(response.data),
            });
          }); 

          
        }
      })
      .catch((error: any) => {
        console.log('error listMessages', error);
      });
    }

  const debouncedListPreviousMessages = debounce(()=> {
    listPreviousMessages();
  }, 200);

  const hasPreviousMessages = () => !!(paginationData && paginationData.nextCursor);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > offset ? 'down' : 'up';
    setOffset(currentOffset);

    if (hasPreviousMessages() && direction == 'down' && isCloseToBottom(event.nativeEvent)) {
      debouncedListPreviousMessages();
    }
  };

  const isCloseToBottom = (event: NativeScrollEvent) => {
    const paddingToBottom = 30;
    return (
      event.layoutMeasurement &&
      event.layoutMeasurement.height + event.contentOffset.y >=
        event.contentSize.height - paddingToBottom
    );
  };

  const listMessages = () => {
    HttpClientInstance.listMessages({conversationId})
      .then((response: any) => {
        const conversationMessages: any = realm.objectForPrimaryKey(
          'MessageData',
          conversation.id,
        );

        console.log('LISTMESSAGE');

        //update with new messages data
        if (conversationMessages) {
          realm.write(() => {
            let conversationMessagesData = conversationMessages.messages;
            conversationMessagesData = conversationMessagesData.concat(
              parseDataToRealmMessages(response.data),
            );
          });

          setMessages([...conversationMessages.messages]);
        } else {
          realm.write(() => {
            realm.create('MessageData', {
              id: conversationId,
              messages: parseDataToRealmMessages(response.data),
            });
          }); 

      
        }
      })
      .catch((error: any) => {
        console.log('error listMessages', error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        onScroll={handleScroll}
        renderItem={({item, index}) => {
          return (
            <MessageComponent
              key={item.id}
              message={item}
              messages={messages}
              source={source}
              contact={contact}
              index={index}
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

//add ReactMemo
//id on a View ---> id={`message-item-${message.id}`}



const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: 'red',

    paddingLeft: 16,
    paddingRight: 16
  },
  dateHeader: {
    margin: 8,
    marginBottom: 8,
    left: '50%',
    marginLeft: -25,
    paddingTop: 4,
    paddingBottom: 8,
    paddingRight: 4,
    paddingLeft: 4,
    borderRadius: 4,
    backgroundColor: colorBackgroundGray,
    color: colorTextGray,
    width: 72,
    textAlign: 'center',
  },
});

export default MessageList;
