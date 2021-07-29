import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, ScrollView, Dimensions, SafeAreaView} from 'react-native';
import {debounce} from 'lodash-es';
import {Conversation} from '../../../model/Conversation';
import ConversationListItem from '../ConversationListItem';
import NoConversations from '../NoConversations';
import {RealmDB} from '../../../storage/realm';
import {HttpClientInstance} from '../../../InitializeAiryApi';
import {TabBar} from '../../../components/TabBar';
import {getPagination} from '../../../services/Pagination';


type ConversationListProps = {
  currentConversationId?: string;
  filteredConversations?: Conversation[];
  conversationsPaginationData?: any;
  filteredPaginationData?: any;
  fetchNext?: any;
};

const ConversationList = (props: any) => {
  const realm = RealmDB.getInstance();
  const paginationData = getPagination();
  const {currentConversationId, match} = props;
  const conversationListRef = useRef<any>(null);
  const [conversations, setConversations] = useState<any>([]);

  console.log('match', match)

  useEffect(() => {

    const databaseConversations = realm.objects('Conversation')

    databaseConversations.addListener(() => {
      console.log('listener')
      setConversations([...databaseConversations])
    })

    getConversationsList();

    return () => {
      const databaseConversations = realm.objects('Conversation')
      // Remember to remove the listener when you're done!
      databaseConversations.removeAllListeners();
      // Call the close() method when done with a realm instance to avoid memory leaks.
      //realm.close();
    };
  }, [])



  

  const [offset, setOffset] = useState(0);



  const getConversationsList = () => {
    HttpClientInstance.listConversations({page_size: 50})
      .then((response: any) => {
        setConversations(response.data);
        realm.write(() => {
          realm.create('Pagination', response.paginationData);

          for (const conversation of response.data) {


            realm.create('Conversation', conversation);
          }
        });
      })
      .catch((error: any) => {
        console.log('error feth ', error);
      });
  };

  const getNextConversationList = () => {
    const cursor = paginationData?.nextCursor;
    console.log('GET NEXT')
    HttpClientInstance.listConversations({cursor: cursor, page_size: 50})
      .then((response: any) => {
        realm.write(() => {
          for (const conversation of response.data) {

            //console.log('conversation last msg LIST', conversation.lastMessage.content)

            const isStored:any = realm.objectForPrimaryKey(
              'Conversation',
              conversation.id,
            );

            if (isStored) {
              realm.delete(isStored);
            }

            realm.create('Conversation', conversation)
          }
        })
          
        realm.write(() => {
          const pagination: any = realm.objects('Pagination')[0];
          pagination.previousCursor = response.paginationData.previousCursor;
          pagination.nextCursor = response.paginationData.nextCursor;
          pagination.total = response.paginationData.total;
        });

        console.log('CONVERSATIONS LENGTH', realm.objects('Conversation').length)
      })
      .catch((error: any) => {
        console.log('error: fetch next ', error);
      });
  };

  const hasPreviousMessages = () => {
    return !!(paginationData && paginationData.nextCursor);
  };

  const debouncedListPreviousConversations = () => {
    getNextConversationList();
  }

  const isCloseToBottom = (event: any) => {
    const paddingToBottom = 30;
    return (
      event.layoutMeasurement &&
      event.layoutMeasurement.height + event.contentOffset.y >=
        event.contentSize.height - paddingToBottom
    );
  };

  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > offset ? 'down' : 'up';
    setOffset(currentOffset);

    if (direction == 'down' && isCloseToBottom(event.nativeEvent)) {
      fetchConversationScroll();
    }
  };

  const fetchConversationScroll = debounce(
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
    200,
    {leading: true},
  );

  let number = 0;

  return (
     <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={styles.conversationListPaginationWrapper}
        ref={conversationListRef}
        onScroll={handleScroll}
        scrollEventThrottle={400}>
        <View>
          {conversations.map((conversation: any) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
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
      </SafeAreaView>
  );
};

export default ConversationList;
const {height, width} = Dimensions.get('window');
console.log('height ', height);
console.log('width ', width);

const styles = StyleSheet.create({
  conversationListPaginationWrapper: {
    display: 'flex',
    flex:1,
    width: width,
    height: height,
    backgroundColor: 'white'
  },
  text: {
    color: 'black',
    marginTop: 10,
  },
  inputTitle: {
    // fontSize: 20,
  },
});
