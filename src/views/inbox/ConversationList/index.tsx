import React, {useEffect, useRef} from 'react';
import {
  View,
  Button,
  StyleSheet,
  SectionList,
  SafeAreaView,
} from 'react-native';
import {HttpClient} from '@airyhq/http-client';
import {debounce} from 'lodash-es';
import {
  Conversation,
  ConversationSchema,
  getConversations,
} from '../../../model/Conversation';
import ConversationListItem from '../ConversationList';
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
  const {
    currentConversationId,
    filteredConversations,
    conversationsPaginationData,
    filteredPaginationData,
    fetchNext,
  } = props;
  const conversationListRef = useRef(null);

  const items = 'conversations';
  const paginationData = conversationsPaginationData;
  //   const isLoadingConversation = paginationData.loading;

  useEffect(() => {
    getConversationsList();
  }, []);

  const getConversationsList = () => {
    //   console.log(HttpClientInstance);

    const client = new HttpClient('http://airy.core');
    client
      .listConversations({page_size: 50})
      .then((response: any) => {
        console.log('RESPONSE: ', response);
        RealmDB.getInstance().write(() => {
          for (const conversation of response.data) {
            console.log('createdAt', typeof conversation.createdAt);
            console.log('channel', typeof conversation.channel);
            console.log('metadata', typeof conversation.metadata);
            console.log('lastMessage', typeof conversation.lastMessage);
            console.log('id', typeof conversation.id);

            RealmDB.getInstance().create('Conversation', {
              id: conversation.id,
            });
          }
        });

        console.log('CONVERSATIONS: ', getConversations());
      })
      .catch((error: any) => {
        console.log('error: ', error);
      });

    // HttpClientInstance.listConversations({page_size: 50, cursor: ''}).then((conversations: Conversation[]) => {
    //     console.log(conversations);
    // }).catch((error: any) => {
    //     console.log('error: ', error);
    // })
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
    <View ref={conversationListRef}>
      <View style={styles.conversationListPaginationWrapper}>
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
    </View>
  );
};

export default ConversationList;

const styles = StyleSheet.create({
  conversationListPaginationWrapper: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // flex:1,
    // padding:0,
    // margin:0
  },
  organizationInput: {
    // borderWidth: 2,
    // borderColor: '#ccc',
    // borderRadius: 6,
    // fontSize: 20,
    // padding: 10,
    // marginTop: 5
  },
  inputTitle: {
    // fontSize: 20,
  },
});
