import React, {useEffect, useState} from 'react';
import {StyleSheet, Dimensions, SafeAreaView, FlatList} from 'react-native';
import {debounce} from 'lodash-es';
import {ConversationListItem} from '../ConversationListItem';
import {NoConversations} from '../NoConversations';
import {RealmDB} from '../../../storage/realm';
import {getPagination} from '../../../services/Pagination';
import {Conversation, upsertConversations} from '../../../model/Conversation';
import {NavigationStackProp} from 'react-navigation-stack';
import {
  ConversationFilter,
  filterToLuceneSyntax,
  getDisplayNameForRealmFilter,
  getStateForRealmFilter,
  isFilterReadOnly,
  isFilterUnreadOnly,
} from '../../../model/ConversationFilter';
import {Collection} from 'realm';
import {EmptyFilterResults} from '../../../components/EmptyFilterResults';
import {Channel} from '../../../model/Channel';
import {Pagination} from '../../../model';
import {api} from '../../../api';

declare type PaginatedResponse<T> = typeof import('@airyhq/http-client');

type ConversationListProps = {
  navigation?: NavigationStackProp<{conversationId: string}>;
};

const realm = RealmDB.getInstance();

export const ConversationList = (props: ConversationListProps) => {
  const {navigation} = props;
  const paginationData = getPagination();
  const [conversations, setConversations] = useState([]);
  const [currentFilter, setCurrentFilter] = useState<ConversationFilter>();
  const [appliedFilters, setAppliedFilters] = useState<boolean>();
  let filteredChannelArray = [];

  const filterApplied = () => {
    currentFilter?.displayName !== '' ||
    currentFilter?.byChannels.length > 0 ||
    currentFilter?.isStateOpen !== null ||
    currentFilter?.readOnly !== null ||
    currentFilter?.unreadOnly !== null
      ? setAppliedFilters(true)
      : setAppliedFilters(false);
  };

  const onFilterUpdated = (
    filters: Collection<ConversationFilter & Object>,
  ) => {
    setCurrentFilter(filters[0]);
  };

  useEffect(() => {
    realm
      .objects<ConversationFilter>('ConversationFilter')
      .addListener(onFilterUpdated);
    setTimeout(() => {
      api
        .listConversations({
          page_size: 50,
          filters: appliedFilters ? filterToLuceneSyntax(currentFilter) : null,
        })
        .then((response: any) => {
          realm.write(() => {
            realm.create('Pagination', response.paginationData);
          });

          if (conversations.length === 0) {
            setConversations([...response.data]),
              upsertConversations(response.data, realm);
          } else {
            upsertConversations(response.data, realm);
          }
        })
        .catch((error: Error) => {
          console.error(error);
          console.log('error');
        });
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let databaseConversations = realm
      .objects<Conversation[]>('Conversation')
      .sorted('lastMessage.sentAt', true);

    if (currentFilter) {
      databaseConversations = databaseConversations.filtered(
        'metadata.contact.displayName CONTAINS[c] $0 && metadata.state LIKE $1 && $2 CONTAINS[c] channel.id',
        getDisplayNameForRealmFilter(currentFilter),
        getStateForRealmFilter(currentFilter),
        filteredChannels(),
      );

      if (isFilterReadOnly(currentFilter)) {
        databaseConversations = databaseConversations.filtered(
          'metadata.unreadCount = 0',
        );
      }

      if (isFilterUnreadOnly(currentFilter)) {
        databaseConversations = databaseConversations.filtered(
          'metadata.unreadCount != 0',
        );
      }
    }

    filterApplied();

    if (databaseConversations) {
      databaseConversations.addListener(() => {
        setConversations([...databaseConversations]);
      });
    }

    return () => {
      databaseConversations.removeAllListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilter]);

  const filteredChannels = (): string => {
    currentFilter?.byChannels.forEach((item: Channel) => {
      currentFilter?.byChannels.find((channel: Channel) => {
        if (channel.id === item.id) {
          filteredChannelArray.push(channel.id);
        }
      });
    });

    let newArray = JSON.stringify(filteredChannelArray.join());

    if (newArray.length === 2) {
      newArray = addAllChannels();
    }

    return newArray;
  };

  const addAllChannels = () => {
    realm.objects<Conversation>('Conversation').filtered(
      'channel.connected == true',
      realm.objects<Channel>('Channel').forEach((channel: Channel) => {
        filteredChannelArray.push(channel.id);
      }),
    );

    const newArray = JSON.stringify(filteredChannelArray.join());

    return newArray;
  };

  const getNextConversationList = () => {
    const cursor = paginationData?.nextCursor;
    api
      .listConversations({
        cursor: cursor,
        page_size: 50,
        filters: appliedFilters ? filterToLuceneSyntax(currentFilter) : null,
      })
      .then((response: any) => {
        // upsertConversations(response.data, realm);

        realm.write(() => {
          const pagination: Pagination | undefined =
            realm.objects<Pagination>('Pagination')[0];
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
    console.log('paginationData', paginationData);
    console.log('paginationData.nextCursor', paginationData.nextCursor);

    if (paginationData && paginationData.nextCursor) {
      getNextConversationList();
    }
  }, 2000);

  const memoizedRenderItem = React.useMemo(() => {
    const renderItem = ({item}) => {
      return (
        <ConversationListItem
          key={item.id}
          conversation={item}
          navigation={navigation}
        />
      );
    };

    return renderItem;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {conversations && conversations.length === 0 && !appliedFilters ? (
        <NoConversations conversations={conversations.length} />
      ) : conversations && conversations.length > 0 ? (
        <FlatList
          data={conversations}
          onEndReached={debouncedListPreviousConversations}
          renderItem={memoizedRenderItem}
        />
      ) : (
        <EmptyFilterResults />
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
