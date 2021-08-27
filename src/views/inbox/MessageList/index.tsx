import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  View,
  NativeScrollEvent,
  NativeSyntheticEvent,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import {RealmDB} from '../../../storage/realm';
import {HttpClientInstance} from '../../../InitializeAiryApi';
import {parseToRealmMessage, Message, MessageData} from '../../../model';
import {MessageComponent} from './MessageComponent';
import {debounce, sortBy, isEqual} from 'lodash-es';
import {MessageBar} from '../../../components/MessageBar';
import {useHeaderHeight} from '@react-navigation/stack';

interface RouteProps {
  key: string;
  name: string;
  params: {conversationId: string};
}

type MessageListProps = {
  route: RouteProps;
};

const MessageList = (props: MessageListProps) => {
  const {route} = props;
  const conversationId: string = route.params.conversationId;
  const [messages, setMessages] = useState<Message[] | []>([]);
  const [offset, setOffset] = useState(0);
  const messageListRef = useRef<FlatList>(null);
  const headerHeight = useHeaderHeight();
  const keyboardVerticalOffset = Platform.OS === 'ios' ? headerHeight : 0;
  const behavior = Platform.OS === 'ios' ? 'padding' : 'height';

  const realm = RealmDB.getInstance();
  const conversation: any = realm.objectForPrimaryKey(
    'Conversation',
    conversationId,
  );

  const databaseMessages: any = realm.objectForPrimaryKey<
    Realm.Results<MessageData>
  >('MessageData', conversationId);

  const {
    metadata: {contact},
    channel: {source},
    paginationData,
  } = conversation;

  if (!conversation) {
    return null;
  }

  const scrollBottom = () => {
    messageListRef?.current?.scrollToEnd();
  };

  useEffect(() => {
    let unmounted = false;

    if (!databaseMessages && !unmounted) {
      listMessages();
    }

    scrollBottom();

    if (databaseMessages) {
      databaseMessages.addListener(() => {
        if (!unmounted) {
          setMessages([...databaseMessages.messages]);
        }
      });
    }

    return () => {
      databaseMessages.removeAllListeners();
      unmounted = true;
    };
  }, []);

  function mergeMessages(
    oldMessages: Message[],
    newMessages: Message[],
  ): Message[] {
    newMessages.forEach((message: any) => {
      if (!oldMessages.some((item: Message) => item.id === message.id)) {
        oldMessages.push(parseToRealmMessage(message, message.source));
      }
    });

    return sortBy(oldMessages, message => message.sentAt);
  }

  const debouncedListPreviousMessages = debounce(() => {
    listPreviousMessages();
  }, 200);

  const hasPreviousMessages = () =>
    !!(paginationData && paginationData.nextCursor);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    setOffset(currentOffset);

    if (hasPreviousMessages() && event.nativeEvent.contentOffset.y < -30) {
      debouncedListPreviousMessages();
    }
  };

  const listMessages = () => {
    HttpClientInstance.listMessages({conversationId, pageSize: 10})
      .then((response: any) => {
        realm.write(() => {
          realm.create('MessageData', {
            id: conversationId,
            messages: mergeMessages([], [...response.data]),
          });
        });

        const databaseMessages: any = realm.objectForPrimaryKey(
          'MessageData',
          conversationId,
        );

        if (databaseMessages) {
          databaseMessages.addListener(() => {
            setMessages([...databaseMessages.messages]);
          });
        }

        if (response.paginationData) {
          realm.write(() => {
            conversation.paginationData.loading =
              response.paginationData?.loading ?? null;
            conversation.paginationData.nextCursor =
              response.paginationData?.nextCursor ?? null;
            conversation.paginationData.previousCursor =
              response.paginationData?.previousCursor ?? null;
            conversation.paginationData.total =
              response.paginationData?.total ?? null;
          });
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
    })
      .then((response: any) => {
        const storedConversationMessages: any = realm.objectForPrimaryKey(
          'MessageData',
          conversation.id,
        );

        if (storedConversationMessages) {
          realm.write(() => {
            storedConversationMessages.messages = [
              ...mergeMessages(storedConversationMessages.messages, [
                ...response.data,
              ]),
            ];
          });
        } else {
          realm.write(() => {
            realm.create('MessageData', {
              id: conversationId,
              messages: mergeMessages([], [...response.data]),
            });
          });
        }

        if (response.paginationData) {
          realm.write(() => {
            conversation.paginationData.loading =
              response.paginationData?.loading ?? null;
            conversation.paginationData.nextCursor =
              response.paginationData?.nextCursor ?? null;
            conversation.paginationData.previousCursor =
              response.paginationData?.previousCursor ?? null;
            conversation.paginationData.total =
              response.paginationData?.total ?? null;
          });
        }
      })
      .catch((error: any) => {
        console.log('error listPrevMessages', error);
      });
  };
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisibile, setIsKeyboardVisible] = useState(false);
  const [flatListHeight, setFlatListHeight] = useState(200);

  useEffect(() => {
    if (isKeyboardVisibile) {
      setFlatListHeight(120);
    }
  }, [isKeyboardVisibile, setIsKeyboardVisible]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      keyboardVerticalOffset => {
        setKeyboardHeight(keyboardVerticalOffset.startCoordinates.height);
        messageListRef.current?.scrollToEnd();
      },
    );
    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      keyboardVerticalOffset => {
        setKeyboardHeight(keyboardVerticalOffset.startCoordinates.height);
        setIsKeyboardVisible(false);
      },
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <KeyboardAvoidingView
        behavior={behavior}
        keyboardVerticalOffset={keyboardVerticalOffset}>
        <View style={styles.container}>
          <FlatList
            style={styles.flatlist}
            data={messages}
            onScroll={handleScroll}
            ref={messageListRef}
            onContentSizeChange={() =>
              messageListRef.current?.scrollToEnd({animated: true})
            }
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
          <View style={styles.messageBar}>
            <MessageBar conversationId={route.params.conversationId} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
  },
  flatlist: {
    backgroundColor: 'white',
  },
  messageBar: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    marginBottom: 5,
  },
});

const arePropsEqual = (prevProps: any, nextProps: any) => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(MessageList, arePropsEqual);
