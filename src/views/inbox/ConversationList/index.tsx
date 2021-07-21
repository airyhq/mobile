import React, {useEffect, useRef, useState} from 'react';
import {View, Button, StyleSheet, Text, ScrollView} from 'react-native';
import {debounce} from 'lodash-es';
import {Conversation} from '../../../model/Conversation';
import ConversationListItem from '../ConversationListItem';
import NoConversations from '../NoConversations';
import {RealmDB} from '../../../storage/realm';
import {HttpClientInstance} from '../../../InitializeAiryApi';

type ConversationListProps = {
  currentConversationId?: string;
  filteredConversations?: Conversation[];
  conversationsPaginationData?: any;
  filteredPaginationData?: any;
  fetchNext?: any;
};

const ConversationList = (props: ConversationListProps) => {
  const realm = RealmDB.getInstance();

  const {
    currentConversationId,
    filteredConversations,
    conversationsPaginationData,
    filteredPaginationData,
    fetchNext,
  } = props;
  const conversationListRef = useRef(null);
  const [conversations, setConversations] = useState(
    realm.objects('Conversation'),
  );

  const items = conversations;
  const paginationData = conversationsPaginationData;
  //   const isLoadingConversation = paginationData.loading;

  useEffect(() => {
    getConversationsList();
  }, []);

  console.log('CONVERSATIONS--------------useSTATE: ', conversations.length);

  const getConversationsList = () => {
    HttpClientInstance.listConversations({page_size: 50})
      .then((response: any) => {
        setConversations(response.data);
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
      })
      .catch((error: any) => {
        console.log('error: GET CONVERSATIONLIST', error);
      });
  };

  const hasPreviousMessages = () => {
    return !!(
      conversationsPaginationData &&
      conversationsPaginationData &&
      conversationsPaginationData.nextCursor
    );
  };

  const debouncedListPreviousConversations = debounce(() => {
    fetchNext();
  }, 200);

  //   const handleScroll = debounce(
  //     () => {
  //       if (!conversationListRef) {
  //         return;
  //       }

  //       if (
  //         hasPreviousMessages() &&
  //         !isLoadingConversation &&
  //         conversationListRef &&
  //         conversationListRef.current &&
  //         conversationListRef.current.scrollHeight -
  //           conversationListRef.current.scrollTop ===
  //           conversationListRef.current.clientHeight
  //       ) {
  //         debouncedListPreviousConversations();
  //       }
  //     },
  //     100,
  //     {leading: true},
  //   );

  return (
    <ScrollView style={styles.conversationListPaginationWrapper} ref={conversationListRef}>
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
  );
};

export default ConversationList;

const styles = StyleSheet.create({
  conversationListPaginationWrapper: {
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: 'yellow'
  },
  text: {
    color: 'black',
    marginTop: 10,
  },
  inputTitle: {
    // fontSize: 20,
  },
});
