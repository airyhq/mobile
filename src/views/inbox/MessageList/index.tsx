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
  Conversation,
} from '../../../model';
import {colorBackgroundGray, colorTextGray} from '../../../assets/colors';
import {MessageComponent} from './MessageComponent';
import {debounce, cloneDeep, sortBy} from 'lodash-es';

type MessageListProps = {
<<<<<<< HEAD
  route: any
>>>>>>> c10546d (created inputBar)
=======
  route: any;
>>>>>>> 4885307 (messagelist wip: reorganize storing of messages in db)
};

//use usePrevious / prevMessages to scroll to message?

// function usePrevious(value: Message[] | string) {
//   const ref = useRef(null);
//   useEffect(() => {
//     ref.current = value;
//   });
//   return ref.current;
// }

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
>>>>>>> 4885307 (messagelist wip: reorganize storing of messages in db)
  const [messages, setMessages] = useState<any>([]);
  //const prevMessages = usePrevious(messages);
  const [offset, setOffset] = useState(0);
  const messageListRef = useRef<FlatList>(null);

  const realm = RealmDB.getInstance();
  const conversation: Conversation = realm.objectForPrimaryKey(
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

  const scrollBottom = () => {
    messageListRef?.current?.scrollToEnd()
  }

  // const scrollToMessage = id => {
  //   const element = document.querySelector<HTMLElement>(`#message-item-${id}`);

  //   if (element && messageListRef) {
  //     messageListRef.current.scrollTop = element.offsetTop - messageListRef.current.offsetTop;
  //   }
  // };

  // useEffect(() => {
  //   if (prevMessages && messages && prevMessages.length < messages.length) {

  //     //scrollBottom();

  //     // if (
  //     //   conversationId &&
  //     //   prevCurrentConversationId &&
  //     //   prevCurrentConversationId === conversationId &&
  //     //   messages &&
  //     //   prevMessages &&
  //     //   prevMessages[0] &&
  //     //   prevMessages[0].id !== messages[0].id
  //     // ) {
  //     //   scrollToMessage(prevMessages[0].id);
  //     // } else {
  //     //    scrollBottom();
  //     // }
  //   }
  // }, [messages, conversationId]);

  useEffect(() => {

      listMessages();
      scrollBottom()
     

      const databaseMessages:any = realm.objectForPrimaryKey('MessageData', conversationId);
  
      if(databaseMessages){
        databaseMessages.addListener(() => {
          setMessages([...databaseMessages.messages]);
        });
      }
    
  
      return () => {
        databaseMessages.removeAllListeners();
      };

  }, []);

  function mergeMessages(oldMessages: any, newMessages: Message[]): any {
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
    const direction = currentOffset > offset ? 'down' : 'up';
    setOffset(currentOffset);

    console.log('direction', direction)
    console.log('event.nativeEvent.contentOffset.y', event.nativeEvent.contentOffset.y)

    console.log('NEXT CURSOR', paginationData.nextCursor)

    if (hasPreviousMessages()  && event.nativeEvent.contentOffset.y < -30) {
      console.log('DEBOUNCE LIST PREV')
      debouncedListPreviousMessages();
    }
  };


  const listMessages = () => {

    if(messages.length > 0) return; 

    HttpClientInstance.listMessages({conversationId, pageSize: 10})
      .then((response) => {
        const storedConversationMessages: any = realm.objectForPrimaryKey(
          'MessageData',
          conversation.id,
        );

          console.log('LIST MSGS')
      
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
         

          if(storedConversationMessages){
            storedConversationMessages.addListener(() => {
              setMessages([...storedConversationMessages.messages]);
            });
          }
        

        if(response.paginationData){
          realm.write(() => {
            conversation.paginationData.loading = response.paginationData?.loading ?? null;
            conversation.paginationData.nextCursor = response.paginationData?.nextCursor ?? null;
            conversation.paginationData.previousCursor = response.paginationData?.previousCursor ?? null;
            conversation.paginationData.total = response.paginationData?.total ?? null;
            console.log('conversation.paginationData', conversation.paginationData.nextCursor)
          })
          }
        
        })
      .catch((error: any) => {
        console.log('error listMessages', error);
      });
  };

  const listPreviousMessages = () => {
    const cursor = paginationData && paginationData.nextCursor;
    console.log('LISTNEXT NEXTCURSOR', cursor);

    HttpClientInstance.listMessages({
      conversationId,
      pageSize: 10,
      cursor: cursor,
    }).then((response) => {
        console.log('DEBOUNCE LIST PREV')
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
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        onScroll={handleScroll}
        ref={messageListRef}
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
      <InputBar conversationId={conversationId}/>
    </SafeAreaView>
  );
>>>>>>> 4885307 (messagelist wip: reorganize storing of messages in db)
};

//add ReactMemo
//id on a View ---> id={`message-item-${message.id}`}



const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: 'white',

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
