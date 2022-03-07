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
  ActivityIndicator,
} from 'react-native';
import {RealmDB} from '../../../storage/realm';
import {Message, Conversation, Source} from '../../../model';
import {MessageComponent} from './MessageComponent';
import {throttle} from 'lodash-es';
import {ChatInput} from '../../../components/chat/input/ChatInput';
import {useHeaderHeight} from '@react-navigation/stack';
import {loadMessagesForConversation} from '../../../api/Message';
import {hasDateChanged} from '../../../services/dates';
import {colorAiryBlue} from '../../../assets/colors';

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
  const [isLoading, setIsLoading] = useState(
    conversation.messages.length === 0,
  );

  const {
    metadata: {contact},
    channel: {source},
    paginationData,
  } = conversation;

  useEffect(() => {
    if (conversation.messages.length === 0) {
      conversation &&
        loadMessagesForConversation(route.params.conversationId)
          .then(() => setIsLoading(false))
          .catch(() => {
            setIsLoading(true);
          });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params.conversationId]);

  useEffect(() => {
    const _conversation: (Conversation & Realm.Object) | undefined =
      realm.objectForPrimaryKey<Conversation>(
        'Conversation',
        route.params.conversationId,
      );

    if (_conversation.messages) {
      !realm.isInTransaction &&
        _conversation.addListener(() => {
          setMessages([..._conversation.messages]);
        });
    }

    return () => {
      if (_conversation) {
        _conversation.removeAllListeners();
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
        source={source as Source}
        contact={contact}
        isLastInGroup={lastInGroup}
        dateChanged={hasDateChanged(prevMessage, currentMessage)}
        conversationId={route.params.conversationId}
      />
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            style={{flex: 1}}
            color={colorAiryBlue}
          />
        ) : (
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
        )}
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
