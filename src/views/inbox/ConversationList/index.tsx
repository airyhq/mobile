import React, {useEffect, useState} from 'react';
import {StyleSheet, Dimensions, SafeAreaView, FlatList} from 'react-native';
import {debounce} from 'lodash-es';
import {ConversationListItem} from '../ConversationListItem';
import {NoConversations} from '../NoConversations';
import {RealmDB} from '../../../storage/realm';
import {HttpClientInstance} from '../../../InitializeAiryApi';
import {getPagination} from '../../../services/Pagination';
import {
  Conversation,
  parseToRealmConversation,
  upsertConversation,
} from '../../../model/Conversation';
import {NavigationStackProp} from 'react-navigation-stack';
import {
  ConversationFilter,
  filterToLuceneSyntax,
} from '../../../model/ConversationFilter';

type ConversationListProps = {
  navigation?: NavigationStackProp<{conversationId: string}>;
};

const realm = RealmDB.getInstance();

export const ConversationList = (props: ConversationListProps) => {
  const {navigation} = props;
  const paginationData = getPagination();
  const [conversations, setConversations] = useState<any>([]);

  const currentFilter =
    realm.objects<ConversationFilter>('ConversationFilter')[0];

  useEffect(() => {
    setTimeout(() => {
      const databaseConversations: Realm.Results<Conversation[]> = realm
        .objects<Conversation[]>('Conversation')
        .sorted('lastMessage.sentAt', true)
        .filtered(
          'metadata.contact.displayName CONTAINS[c] $0 && metadata.state LIKE $1 && (metadata.unreadCount != $2 || metadata.unreadCount != $3)',
          currentFilter?.displayName,
          (currentFilter?.isStateOpen == null && '*') ||
            (currentFilter?.isStateOpen == true && 'OPEN') ||
            (currentFilter?.isStateOpen == false && 'CLOSED'),
          (currentFilter?.readOnly == null && 2) ||
            (currentFilter?.readOnly == true && 1) ||
            (currentFilter?.readOnly == false && 0),
          (currentFilter?.readOnly == null && 2) ||
            (currentFilter?.readOnly == true && 1) ||
            (currentFilter?.readOnly == false && 0),
        );

      if (databaseConversations) {
        databaseConversations.addListener(() => {
          setConversations([...databaseConversations]);
        });

        return () => {
          databaseConversations.removeAllListeners();
        };
      }
    }, 100);
  }, [currentFilter]);

  useEffect(() => {
    const databaseConversationFilter =
      realm.objects<ConversationFilter>('ConversationFilter');

    if (databaseConversationFilter) {
      databaseConversationFilter.addListener(collection => {
        console.log('-------------------');
        console.log('COLLECTION: ', collection[0].byChannels.length);
      });
    }

    return () => {
      databaseConversationFilter.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    HttpClientInstance.listConversations({
      page_size: 50,
      filters: currentFilter && filterToLuceneSyntax(currentFilter),
    })
      .then((response: any) => {
        realm.write(() => {
          realm.create('Pagination', response.paginationData);
        });
        upsertConversation(response.data, realm);
      })
      .catch((error: Error) => {
        console.error(error);
      });
  }, []);

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
