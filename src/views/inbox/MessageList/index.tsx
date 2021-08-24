<<<<<<< HEAD
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
<<<<<<< HEAD
import {Dimensions, ScrollView, View, StyleSheet, SafeAreaView} from 'react-native';
>>>>>>> e9a6dcf (added message list)
import { InputBar } from '../../../components/InputBar';
=======
=======
import React, {useEffect, createRef, useState, useRef} from 'react';
>>>>>>> 4a9bbd9 (messagelist wip)
import {
  Dimensions,
  StyleSheet,
  SafeAreaView,
  FlatList,
  View,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import {InputBar} from '../../../components/InputBar';
>>>>>>> 4885307 (messagelist wip: reorganize storing of messages in db)
import {RealmDB} from '../../../storage/realm';
import {HttpClientInstance} from '../../../InitializeAiryApi';
import {
  parseToRealmMessage,
  Message,
  MessageData,
  Conversation,
} from '../../../model';
import {MessageComponent} from './MessageComponent';
import {debounce, sortBy, isEqual} from 'lodash-es';

interface RouteProps {
  key: string;
  name: string;
  params: {conversationId: string}
}

type MessageListProps = {
<<<<<<< HEAD
<<<<<<< HEAD
  route: any
>>>>>>> c10546d (created inputBar)
=======
  route: any;
>>>>>>> 4885307 (messagelist wip: reorganize storing of messages in db)
=======
  route: RouteProps;
>>>>>>> 70515a2 (messagelist wip)
};


const MessageList = (props: MessageListProps) => {
  const {route} = props;
<<<<<<< HEAD
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
=======
  const conversationId: string = route.params.conversationId;
<<<<<<< HEAD
>>>>>>> 4885307 (messagelist wip: reorganize storing of messages in db)
  const [messages, setMessages] = useState<any>([]);
=======
  const [messages, setMessages] = useState<Message[] | []>([]);
>>>>>>> 50a199b (fixed typing)
  const [offset, setOffset] = useState(0);
  const messageListRef = useRef<FlatList>(null);

  const realm = RealmDB.getInstance();
  const conversation: Conversation = realm.objectForPrimaryKey(
    'Conversation',
    conversationId,
  );
  const databaseMessages: any = realm.objectForPrimaryKey<Realm.Results<MessageData>>('MessageData', conversationId)
         
  const {
    metadata: {contact},
    channel: {source},
    paginationData,
  } = conversation;


  if (!conversation) {
    return null;
  }

  const scrollBottom = () => {
    messageListRef?.current?.scrollToEnd()
  }

  useEffect(() => {
    let unmounted = false;

    if(!databaseMessages && !unmounted){
      listMessages();
    }

    scrollBottom()

    if(databaseMessages){
      databaseMessages.addListener(() => {
        if (!unmounted) {
        setMessages([...databaseMessages.messages]);
        }
      });
    }

    return () => {
      databaseMessages.removeAllListeners();
      unmounted = true ;
    };
  }, []);

  function mergeMessages(oldMessages: Message[], newMessages: Message[]):Message[]  {
    newMessages.forEach((message: any) => {
      if (!oldMessages.some((item: Message) => item.id === message.id)) {
        oldMessages.push(parseToRealmMessage(message, message.source));
      }
    });
   
    return sortBy(oldMessages, message => message.sentAt)
  }

  const debouncedListPreviousMessages = debounce(()=> {
    listPreviousMessages();
  }, 200);

  const hasPreviousMessages = () => !!(paginationData && paginationData.nextCursor);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    setOffset(currentOffset);

    if (hasPreviousMessages()  && event.nativeEvent.contentOffset.y < -30) {
      debouncedListPreviousMessages();
    }
  };


  const listMessages = () => {
    HttpClientInstance.listMessages({conversationId, pageSize: 10})
      .then((response) => {
      
          realm.write(() => {
            realm.create('MessageData', {
              id: conversationId,
              messages: mergeMessages([], [...response.data]),
            });
          }); 

          const databaseMessages:any = realm.objectForPrimaryKey('MessageData', conversationId);

          if(databaseMessages){
            databaseMessages.addListener(() => {
              setMessages([...databaseMessages.messages]);
            });
          }
         
        
        if(response.paginationData){
          realm.write(() => {
            conversation.paginationData.loading = response.paginationData?.loading ?? null;
            conversation.paginationData.nextCursor = response.paginationData?.nextCursor ?? null;
            conversation.paginationData.previousCursor = response.paginationData?.previousCursor ?? null;
            conversation.paginationData.total = response.paginationData?.total ?? null;
          })
          }
        })
      .catch((error: any) => {
        console.log('error listMessages', error);
      });
  };

  const listPreviousMessages = () => {
    const cursor = paginationData && paginationData.nextCursor;

    HttpClientInstance.listMessages({
      conversationId,
      pageSize: 10,
      cursor: cursor,
    }).then((response) => {
        const storedConversationMessages: any = realm.objectForPrimaryKey(
          'MessageData',
          conversation.id,
        );

        if (storedConversationMessages) {
          realm.write(() => {
            storedConversationMessages.messages = [...mergeMessages(storedConversationMessages.messages, [...response.data])]
          });
        } else {
          realm.write(() => {
            realm.create('MessageData', {
              id: conversationId,
              messages: mergeMessages([], [...response.data]),
            });
          }); 
        }

        if(response.paginationData){
          realm.write(() => {
            conversation.paginationData.loading = response.paginationData?.loading ?? null;
            conversation.paginationData.nextCursor = response.paginationData?.nextCursor ?? null;
            conversation.paginationData.previousCursor = response.paginationData?.previousCursor ?? null;
            conversation.paginationData.total = response.paginationData?.total ?? null;
          });
        }
      })
      .catch((error: any) => {
        console.log('error listPrevMessages', error);
      });
    }


  return (
    <>
    <SafeAreaView style={styles.container}>
      <View style={styles.flatlist}>
      <FlatList
        data={messages}
        onScroll={handleScroll}
        ref={messageListRef}
        onContentSizeChange={()=> messageListRef.current.scrollToEnd({animated: true})} 
        renderItem={({item, index}) => {
          return (
            <MessageComponent
              key={item.id}
              message={item}
              messages={messages}
              source={source}
              contact={contact}
<<<<<<< HEAD
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
=======
              index={index}
            />
          );
        }}
      />
      </View>
      <InputBar conversationId={conversationId}/>
    </SafeAreaView>
    </>
  );
>>>>>>> 4885307 (messagelist wip: reorganize storing of messages in db)
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: 'white',
  },
  flatlist: {
  flex: 0.77,
  backgroundColor: 'white'
  }
});

const arePropsEqual = (prevProps, nextProps) => {
  if (
    prevProps.history.location.pathname === nextProps.history.location.pathname &&
    prevProps.conversation?.id === nextProps.conversation?.id &&
    prevProps.history.location.key === nextProps.history.location.key &&
    prevProps.location.key !== nextProps.location.key
  ) {
    return true;
  }

  return isEqual(prevProps, nextProps);
};

export default React.memo(MessageList, arePropsEqual);
