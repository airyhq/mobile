import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {RealmDB} from '../../../storage/realm';
import {
  parseToRealmMessage,
  Message,
  MessageData,
  Conversation,
} from '../../../model';
import {MessageComponent} from './MessageComponent';
import {debounce, sortBy, isEqual} from 'lodash-es';
import {ChatInput} from '../../../components/chat/input/ChatInput';
import {useHeaderHeight} from '@react-navigation/stack';
import {api} from '../../../api';

declare type PaginatedResponse<T> = typeof import('@airyhq/http-client');

interface RouteProps {
  key: string;
  name: string;
  params: {conversationId: string};
}

type MessageListProps = {
  route: RouteProps;
};

const realm = RealmDB.getInstance();

const MessageList = (props: MessageListProps) => {
  const {route} = props;
  const conversationId: string = route.params.conversationId;
  const [messages, setMessages] = useState<Message[] | []>([]);
  const messageListRef = useRef<FlatList>(null);
  const headerHeight = useHeaderHeight();
  const behavior = Platform.OS === 'ios' ? 'padding' : 'height';
  const keyboardVerticalOffset = Platform.OS === 'ios' ? headerHeight : 0;
  const conversation: Conversation | undefined =
    realm.objectForPrimaryKey<Conversation>('Conversation', conversationId);

  const {
    metadata: {contact},
    channel: {source},
    paginationData,
  } = conversation;

  useEffect(() => {
    const databaseMessages: (MessageData & Realm.Object) | undefined =
      realm.objectForPrimaryKey<MessageData>('MessageData', conversationId);

    const currentConversation: Conversation | undefined =
      realm.objectForPrimaryKey<Conversation>('Conversation', conversationId);

    const listMessages = () => {
      api
        .listMessages({conversationId, pageSize: 50})
        .then((response: PaginatedResponse<Message>) => {
          if (databaseMessages) {
            realm.write(() => {
              databaseMessages.messages = [
                ...mergeMessages(databaseMessages.messages, [...response.data]),
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
              currentConversation.paginationData.loading =
                response.paginationData?.loading ?? null;
              currentConversation.paginationData.nextCursor =
                response.paginationData?.nextCursor ?? null;
              currentConversation.paginationData.previousCursor =
                response.paginationData?.previousCursor ?? null;
              currentConversation.paginationData.total =
                response.paginationData?.total ?? null;
            });
          }
        });
    };

    listMessages();

    if (databaseMessages) {
      databaseMessages.addListener(() => {
        setMessages([...databaseMessages.messages]);
      });
    }

    return () => {
      databaseMessages.removeAllListeners();
    };
  }, [conversationId]);

  function mergeMessages(
    oldMessages: Message[],
    newMessages: Message[],
  ): Message[] {
    newMessages.forEach((message: Message) => {
      if (!oldMessages.some((item: Message) => item.id === message.id)) {
        oldMessages.push(parseToRealmMessage(message, message.source));
      }
    });

    return sortBy(oldMessages, message => message.sentAt);
  }

  const hasPreviousMessages = () =>
    !!(paginationData && paginationData.nextCursor);

  const debouncedListPreviousMessages = debounce(() => {
    if (hasPreviousMessages()) {
      listPreviousMessages();
    }
  }, 2000);

  const listPreviousMessages = () => {
    const cursor = paginationData && paginationData.nextCursor;

    api
      .listMessages({
        conversationId,
        pageSize: 50,
        cursor: cursor,
      })
      .then((response: PaginatedResponse<Message>) => {
        const storedConversationMessages: MessageData | undefined =
          realm.objectForPrimaryKey<MessageData>(
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
      });
  };

  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <KeyboardAvoidingView
        behavior={behavior}
        keyboardVerticalOffset={keyboardVerticalOffset}>
        <View style={styles.container}>
          <FlatList
            style={styles.flatlist}
            data={messages}
            inverted={false}
            ref={messageListRef}
            onEndReached={debouncedListPreviousMessages}
            initialNumToRender={25}
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
          <View style={styles.chatInput}>
            <ChatInput conversationId={route.params.conversationId} />
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
  chatInput: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    marginBottom: 5,
    marginTop: 10,
  },
});

const arePropsEqual = (
  prevProps: MessageListProps,
  nextProps: MessageListProps,
): boolean => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(MessageList, arePropsEqual);
