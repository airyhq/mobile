import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Dimensions, SafeAreaView, FlatList} from 'react-native';
import {debounce} from 'lodash-es';
import {ConversationListItem} from '../ConversationListItem';
import {NoConversations} from '../NoConversations';
import {RealmDB} from '../../../storage/realm';
import {HttpClientInstance} from '../../../InitializeAiryApi';
import {getPagination} from '../../../services/Pagination';
import {parseToRealmConversation} from '../../../model/Conversation';
import {NativeScrollEvent} from 'react-native';
import {NativeSyntheticEvent} from 'react-native';

type ConversationListProps = {
  navigation: any;
};

export const ConversationList = (props: ConversationListProps) => {
  const {navigation} = props;
  const realm = RealmDB.getInstance();
  const paginationData = getPagination();
  const conversationListRef = useRef<any>(null);
  const [conversations, setConversations] = useState<any>([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const databaseConversations = realm
      .objects('Conversation')
      .sorted('lastMessage.sentAt', true);

    databaseConversations.addListener(() => {
      setConversations([...databaseConversations]);
    });

    getConversationsList();

    return () => {
      databaseConversations.removeAllListeners();
    };
  }, []);

  const getConversationsList = () => {
    HttpClientInstance.listConversations({page_size: 50})
      .then((response: any) => {
        realm.write(() => {
          realm.create('Pagination', response.paginationData);

          for (const conversation of response.data) {
            realm.create(
              'Conversation',
              parseToRealmConversation(conversation),
            );
          }
        });
      })
      .catch((error: Error) => {
        console.log('Error: ', error);
      });
  };

  const getNextConversationList = () => {
    const cursor = paginationData?.nextCursor;
    HttpClientInstance.listConversations({cursor: cursor, page_size: 50})
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

            realm.create(
              'Conversation',
              parseToRealmConversation(conversation),
            );
          }
        });

        realm.write(() => {
          const pagination: any = realm.objects('Pagination')[0];
          pagination.previousCursor = response.paginationData.previousCursor;
          pagination.nextCursor = response.paginationData.nextCursor;
          pagination.total = response.paginationData.total;
        });
      })
      .catch((error: Error) => {
        console.log('Error: ', error);
      });
  };

  const debouncedListPreviousConversations = () => {
    getNextConversationList();
  };

  const isCloseToBottom = (event: NativeScrollEvent) => {
    const paddingToBottom = 30;
    return (
      event.layoutMeasurement &&
      event.layoutMeasurement.height + event.contentOffset.y >=
        event.contentSize.height - paddingToBottom
    );
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
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
      debouncedListPreviousConversations();
    },
    200,
    {leading: true},
  );

  return (
    <SafeAreaView style={styles.container}>
      {conversations && conversations.length === 0 ? (
        <NoConversations conversations={conversations.length} />
      ) : (
        <FlatList
          data={conversations}
          onScroll={handleScroll}
          renderItem={({item}) => {
            return (
              <ConversationListItem
                key={item.id}
                conversation={item}
                navigation={navigation}
              />
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
});
