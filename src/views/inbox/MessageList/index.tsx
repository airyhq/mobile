import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  View,
  KeyboardAvoidingView,
  Platform,
  Text
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
import { loadMessagesForConversation } from '../../../api/conversation';
import { isLastInGroup } from '../../../services/message';
import { hasDateChanged } from '../../../services/dates';

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
  const [loading, setLoading] = useState<boolean>(false);
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
          
    if (databaseMessages.messages.length === 0) {
      console.log('Loading messages from server');      
      loadMessagesForConversation(route.params.conversationId);
    }            

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

  const hasPreviousMessages = () =>
    !!(paginationData && paginationData.nextCursor);

  const debouncedListPreviousMessages = () => {
    if (hasPreviousMessages()) {     
      setLoading(true);
      console.log('loading previous messages');  
      console.log(paginationData.nextCursor);  
      loadMessagesForConversation(route.params.conversationId, messages[messages.length - 1].id, () => {
        setLoading(false);      
      });
    }
  };

  const memoizedRenderItem = React.useMemo(() => {
    const renderItem = ({item, index}) => {
      const prevMessage = messages[index - 1];
      const currentMessage = messages[index];
      return (
        <MessageComponent
          key={item.id}
          message={item}          
          source={source}
          contact={contact}          
          isLastInGroup={isLastInGroup(prevMessage, currentMessage)}
          dateChanged={hasDateChanged(prevMessage, currentMessage)}
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
            decelerationRate={0.1}                  
            contentContainerStyle={{
              flexGrow: 1, justifyContent: 'flex-end',
            }}          
            style={styles.flatlist}              
            ref={messageListRef}
            data={messages.reverse()}            
            renderItem={memoizedRenderItem}                        
            onScroll={(event) => {              
              if (!loading && (event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height) * 0.5 < event.nativeEvent.contentOffset.y) {
                console.log('load from scroll');                
                debouncedListPreviousMessages();
              }
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
    alignSelf: 'center'
  },
  chatInput: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    marginBottom: 5,
    marginTop: 10,
  },
});