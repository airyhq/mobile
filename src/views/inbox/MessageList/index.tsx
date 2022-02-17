import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  View,
  KeyboardAvoidingView,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {RealmDB} from '../../../storage/realm';
import {Message, Conversation} from '../../../model';
import {MessageComponent} from './MessageComponent';
import {throttle} from 'lodash-es';
import {ChatInput} from '../../../components/chat/input/ChatInput';
import {useHeaderHeight} from '@react-navigation/stack';
import {loadMessagesForConversation} from '../../../api/Message';
import {hasDateChanged} from '../../../services/dates';

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
    realm.objectForPrimaryKey<Conversation>(
      'Conversation',
      route.params.conversationId,
    );

  const {
    metadata: {contact},
    channel: {source},
    paginationData,
  } = conversation;

  useEffect(() => {
    const conversation: (Conversation & Realm.Object) | undefined =
      realm.objectForPrimaryKey<Conversation>(
        'Conversation',
        route.params.conversationId,
      );
    
    loadMessagesForConversation(route.params.conversationId);   

    if (conversation.messages) {
      !realm.isInTransaction && conversation.addListener(() => {
        setMessages([...conversation.messages]);
      });
    }

    return () => {
      if (conversation) {
        conversation.removeAllListeners();
      }
    };
  }, [route.params.conversationId]);

  const hasPreviousMessages = () =>
    !!(paginationData && paginationData.nextCursor);

  const debouncedListPreviousMessages = throttle(
    () => {
      loadMessagesForConversation(
        route.params.conversationId,
        messages[messages.length - 1].id,
      );
    },
    3000,
    {leading: false, trailing: true},
  );

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (
      hasPreviousMessages() &&
      (event.nativeEvent.contentSize.height -
        event.nativeEvent.layoutMeasurement.height) *
        0.5 <
        event.nativeEvent.contentOffset.y
    ) {
      debouncedListPreviousMessages();
    }
  };

  const renderItem = ({item, index}) => {
    const currentMessage = messages[index];
    const prevMessage = messages[index + 1];
    const nextMessage = messages[index - 1];

    const lastInGroup = nextMessage
      ? item.fromContact !== nextMessage.fromContact
      : true;

    return (
      <MessageComponent
        key={item.id}
        message={item}
        source={source}
        contact={contact}
        isLastInGroup={lastInGroup}
        dateChanged={hasDateChanged(prevMessage, currentMessage)}
      />
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <View style={styles.container}>
        <FlatList
          inverted
          decelerationRate={0.1}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}
          style={styles.flatlist}
          ref={messageListRef}
          data={messages.reverse()}
          renderItem={renderItem}
          onScroll={onScroll}
        />
        <KeyboardAvoidingView
          behavior={behavior}
          keyboardVerticalOffset={keyboardVerticalOffset}>
          <View style={styles.chatInput}>
            <ChatInput conversationId={route.params.conversationId} />
          </View>
        </KeyboardAvoidingView>
      </View>
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
  loader: {
    marginTop: 16,
    marginBottom: 16,
    color: 'gray',
    alignSelf: 'center',
  },
  chatInput: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    marginBottom: 5,
    marginTop: 10,
  },
});
