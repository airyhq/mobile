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
import {debounce, sortBy} from 'lodash-es';
import {ChatInput} from '../../../components/chat/input/ChatInput';
import {useHeaderHeight} from '@react-navigation/stack';
import {api} from '../../../api';
import { loadMessagesForConversation } from '../../../api/conversation';
import { isLastInGroup } from '../../../services/message';
import { hasDateChanged } from '../../../services/dates';

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

export const MessageList = (props: MessageListProps) => {
  const {route} = props;
  
  const [messages, setMessages] = useState<Message[] | []>([]);
  const messageListRef = useRef<FlatList>(null);
  const headerHeight = useHeaderHeight();
  const behavior = Platform.OS === 'ios' ? 'padding' : 'height';
  const keyboardVerticalOffset = Platform.OS === 'ios' ? headerHeight : 0;
  const conversation: Conversation | undefined =
    realm.objectForPrimaryKey<Conversation>('Conversation', route.params.conversationId);

  const {
    metadata: {contact},
    channel: {source},
    paginationData,
  } = conversation;

  useEffect(() => {
    const databaseMessages: (MessageData & Realm.Object) | undefined =
      realm.objectForPrimaryKey<MessageData>('MessageData', route.params.conversationId);
      
    loadMessagesForConversation(route.params.conversationId);

    if (databaseMessages) {
      databaseMessages.addListener(() => {
        setMessages([...databaseMessages.messages]);
      });
    }

    return () => {
      if (databaseMessages) {
        databaseMessages.removeAllListeners();
      }
    };
  }, [route.params.conversationId]);  

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
    // if (hasPreviousMessages()) {
      listPreviousMessages();
    // }
  }, 200);

  const listPreviousMessages = () => {
    const cursor = paginationData && paginationData.nextCursor;

    console.log('CURSOR: ', cursor);
    

    api
      .listMessages({
        conversationId: route.params.conversationId,
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
              id: route.params.conversationId,
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

  const memoizedRenderItem = React.useMemo(() => {
    const renderItem = ({item, index}) => {
      return (
        <MessageComponent
          key={item.id}
          message={item}          
          source={source}
          contact={contact}          
          isLastInGroup={isLastInGroup(messages[index - 1], messages[index])}
          dateChanged={hasDateChanged(messages[index - 1], messages[index])}
        />
      );
    };

    return renderItem;
  }, [contact, messages, source]);

  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <KeyboardAvoidingView
        behavior={behavior}
        keyboardVerticalOffset={keyboardVerticalOffset}>
        <View style={styles.container}>
          <FlatList                                    
            inverted
            contentContainerStyle={{
              flexGrow: 1, justifyContent: 'flex-end',
            }}
            ref={messageListRef}
            data={messages.reverse()}            
            renderItem={memoizedRenderItem}            
            onEndReached={debouncedListPreviousMessages}
            onEndReachedThreshold={0.5}
            style={styles.flatlist}            
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
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
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
