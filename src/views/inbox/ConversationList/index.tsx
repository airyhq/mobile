import React, {useEffect, useState} from 'react';
import {StyleSheet, Dimensions, SafeAreaView, FlatList} from 'react-native';
import {debounce} from 'lodash-es';
import {ConversationListItem} from '../ConversationListItem';
import {NoConversations} from '../NoConversations';
import {RealmDB} from '../../../storage/realm';
import {getPagination} from '../../../services/Pagination';
import {
  Conversation,
  parseToRealmConversation,
  MessageData,
} from '../../../model';
import {NavigationStackProp} from 'react-navigation-stack';
import {api} from '../../../components/auth/AuthWrapper';
import {Pagination} from '../../../model/Pagination';

interface PaginatedResponse<T> {
  data: T[];
  paginationData: Pagination;
}

type ConversationListProps = {
  navigation?: NavigationStackProp<{conversationId: string}>;
};

const realm = RealmDB.getInstance();

export const ConversationList = (props: ConversationListProps) => {
  const {navigation} = props;
  const paginationData = getPagination();
  const [conversations, setConversations] = useState<[] | Conversation[]>([]);

  useEffect(() => {
    const getConversationsList = () => {
      api
        .listConversations({page_size: 50})
        .then((response: PaginatedResponse<Conversation>) => {
          realm.write(() => {
            realm.create('Pagination', response.paginationData);

            for (const conversation of response.data) {
              const isStored: Conversation | undefined =
                realm.objectForPrimaryKey('Conversation', conversation.id);

              const isStoredMessageData: MessageData | undefined =
                realm.objectForPrimaryKey('MessageData', conversation.id);

              if (isStored) {
                realm.delete(isStored);
              }

              realm.create(
                'Conversation',
                parseToRealmConversation(conversation),
              );
              if (!isStoredMessageData) {
                realm.create('MessageData', {
                  id: conversation.id,
                  messages: [],
                });
              }
            }
          });
        })
        .catch((error: Error) => {
          console.error(error);
        });
    };

    const databaseConversations: any = realm
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

  const getNextConversationList = () => {
    const cursor = paginationData?.nextCursor;

    api
      .listConversations({cursor: cursor, page_size: 50})
      .then((response: PaginatedResponse<Conversation>) => {
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
        console.error(error);
      });
  };

  const debouncedListPreviousConversations = debounce(() => {
    if (paginationData && paginationData.nextCursor) {
      getNextConversationList();
    }
  }, 2000);

  return (
    <SafeAreaView style={styles.container}>
      {conversations && conversations.length === 0 ? (
        <NoConversations conversations={conversations.length} />
      ) : (
        <FlatList
          data={conversations}
          onEndReached={debouncedListPreviousConversations}
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
