import React, {useEffect, useRef, useState} from 'react';
import {View, Button, StyleSheet, Text, ScrollView} from 'react-native';
import {debounce} from 'lodash-es';
import {Conversation} from '../../../model/Conversation';
import {Pagination} from '../../../model/Pagination';
import ConversationListItem from '../ConversationListItem';
import NoConversations from '../NoConversations';
import {RealmDB} from '../../../storage/realm';
import {HttpClientInstance} from '../../../InitializeAiryApi';
import {TabBar} from '../../../components/TabBar';
import {getConversations} from '../../../services/conversation';
import {getPagination} from '../../../services/Pagination';

type ConversationListProps = {
  currentConversationId?: string;
  filteredConversations?: Conversation[];
  conversationsPaginationData?: any;
  filteredPaginationData?: any;
  fetchNext?: any;
};

const ConversationList = (props: ConversationListProps) => {
  const realm = RealmDB.getInstance();
  const paginationData = getPagination();

  const {
    currentConversationId,
    filteredConversations,
    conversationsPaginationData,
    filteredPaginationData,
  } = props;
  const conversationListRef = useRef<any>(null);
  // const conversations = realm.objects('Conversation');
  const [conversations, setConversations] = useState<any>(realm.objects('Conversation'))

  useEffect(() => {
    getConversationsList();
  }, []);

  const getConversationsList = () => {
    HttpClientInstance.listConversations({page_size: 50})
      .then((response: any) => {
        setConversations(response.data)
        realm.write(() => {
          realm.create('Pagination', response.paginationData);
          console.log('GET PAGINATION: ', getPagination());

          for (const conversation of response.data) {
            // const isStored = realm.objectForPrimaryKey(
            //   'Conversation',
            //   conversation.id,
            // );
            // if (isStored) {
            //   realm.delete(isStored);
            // }
            realm.create('Conversation', conversation);
          }
          console.log('CONVERSATIONS LENGTH --------', conversations.length);
        });
      })
      .catch((error: any) => {
        console.log('error: GET CONVERSATIONLIST', error);
      });
  };

  const getNextConversationList = () => {
    // const cursor = pagination
    const cursor = paginationData?.nextCursor;
    console.log('CURSOR: ', cursor);
    HttpClientInstance.listConversations({cursor: cursor})
      .then((response: any) => {
        realm.write(() => {
          for (const conversation of response.data) {
            const isStored = realm.objectForPrimaryKey(
              'Conversation',
              conversation.id,
            );
            if (isStored) {
              realm.delete(isStored);
            }
            realm.create('Conversation', conversation);
          }
        });
        realm.write(() => {
          const pagination: any = realm.objects('Pagination')[0];
          pagination.previousCursor = response.paginationData.previousCursor;
          pagination.nextCursor = response.paginationData.nextCursor;
          pagination.total = response.paginationData.total;

          realm.create('Pagination', response.paginationData);
          console.log('nextCursor: ', paginationData?.nextCursor);
        });
        setConversations(realm.objects('Conversation'))
      })
      .catch((error: any) => {
        console.log('error: GET NEXT CONVERSATIONLIST', error);
      });
  };

  const hasPreviousMessages = () => {
    return !!(paginationData && paginationData.nextCursor);
  };

  const debouncedListPreviousConversations = debounce(() => {
    getNextConversationList();
  }, 200);

  const handleScroll = debounce(
    () => {
      if (!conversationListRef) {
        return;
      }

      // if (
      //   hasPreviousMessages()
      //   // !isLoadingConversation
      // ) {
      debouncedListPreviousConversations();
      // }
    },
    100,
    {leading: true},
  );

  let number = 0;

  return (
    <>
      <ScrollView
        style={styles.conversationListPaginationWrapper}
        ref={conversationListRef}
        onScroll={handleScroll}
        scrollEventThrottle={0}>
        <View>
          {conversations.map((conversation: any) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              active={conversation.id === currentConversationId}
              number={number++}
            />
          ))}
          {/* {!items && items.length && !isLoadingConversation ? (
          <NoConversations conversations={conversations.length} />
        ) : (
          <>
            {conversations &&
              conversations.map((conversation: Conversation) => (
                <ConversationListItem
                  key={conversation.id}
                  conversation={conversation}
                  active={conversation.id === currentConversationId}
                />
              ))}
          </>
        )} */}
        </View>
      </ScrollView>
      <TabBar />
    </>
  );
};

export default ConversationList;

const styles = StyleSheet.create({
  conversationListPaginationWrapper: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  text: {
    color: 'black',
    marginTop: 10,
  },
  inputTitle: {
    // fontSize: 20,
  },
});
