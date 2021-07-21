import React, {useEffect, useRef, useState} from 'react';
import {View, Button, StyleSheet, Text, ScrollView} from 'react-native';
import {debounce} from 'lodash-es';
import {Conversation} from '../../../model/Conversation';
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
  const [conversations, setConversations] = useState(
    realm.objects('Conversation'),
  );

  useEffect(() => {
    getConversationsList();
  }, []);

  console.log('CONVERSATIONS LENGTH --------------: ', conversations.length);

  const getConversationsList = () => {
    HttpClientInstance.listConversations({page_size: 50})
      .then((response: any) => {
        // setConversations(response.data);
        realm.write(() => {
          for (const conversation of response.data) {
            const isStored = realm.objectForPrimaryKey(
              'Conversation',
              conversation.id,
            );
            if (isStored) {
              realm.delete(isStored);
            }

            console.log('IS STORED: ', isStored);
            realm.create('Conversation', conversation);
            realm.create('Pagination', response.paginationData);
          }
        });
      })
      .catch((error: any) => {
        console.log('error: GET CONVERSATIONLIST', error);
      });
  };

  const getNextConversationList = () => {
    const cursor = getPagination()?.nextCursor;
    console.log('CURSOR: ', cursor);
    HttpClientInstance.listConversations({cursor: cursor})
      .then((response: any) => {
        // setConversations((prevState: any) => [...prevState, ...response.data]);
        realm.write(() => {
          for (const conversation of response.data) {
            // const isStored = realm.objectForPrimaryKey(
            //   'Conversation',
            //   conversation.id,
            // );
            // if (isStored) {
            //   realm.delete(isStored);
            // }

            realm.create('Conversation', conversation);
            realm.create('Pagination', response.paginationData);
          }
        });
      })
      .catch((error: any) => {
        console.log('error: GET CONVERSATIONLIST', error);
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
        console.log('NOOOOOOOOT CONVERSATIONLIST');

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

  return (
    <>
      <ScrollView
        style={styles.conversationListPaginationWrapper}
        ref={conversationListRef}
        onScroll={handleScroll}
        scrollEventThrottle={0}>
        <View>
          <Button title="POWER" onPress={getConversationsList} />
          {conversations.map((conversation: any) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              active={conversation.id === currentConversationId}
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
