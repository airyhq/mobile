import React, {useEffect, useState} from 'react';
import {StyleSheet, Dimensions, SafeAreaView, FlatList} from 'react-native';
import {NavigationStackProp} from 'react-navigation-stack';
import {Collection} from 'realm';
import {debounce} from 'lodash-es';
import {ConversationListItem} from '../ConversationListItem';
import {NoConversations} from '../NoConversations';
import {RealmDB} from '../../../storage/realm';
import {getPagination} from '../../../services/Pagination';
import {EmptyFilterResults} from '../../../components/EmptyFilterResults';
import {
  Channel,
  Conversation,
  ConversationFilter,
  getDisplayNameForRealmFilter,
  getStateForRealmFilter,
  isFilterReadOnly,
  isFilterUnreadOnly,
  Pagination,
} from '../../../model';
import {AiryLoader} from '../../../componentsLib/loaders';
import {
  listConversations,
  getNextConversationList,
} from '../../../api/Conversation';

type ConversationListProps = {
  navigation?: NavigationStackProp<{conversationId: string}>;
};

const realm = RealmDB.getInstance();

export const ConversationList = (props: ConversationListProps) => {
  const {navigation} = props;
  const [conversations, setConversations] = useState([]);
  const [allConversations, setAllConversations] = useState([]);
  const [currentFilter, setCurrentFilter] = useState<ConversationFilter>();
  const [appliedFilters, setAppliedFilters] = useState<boolean>();
  const [numOfFilters, setNumOfFilters] = useState(0);

  const [loading, setLoading] = useState(true);
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

  const countFilters = (currentFilter: ConversationFilter): void => {
    let num = 0;

    if (currentFilter) {
      if (currentFilter.displayName !== '') {
        num++;
      }

      if (currentFilter.byChannels.length > 0) {
        num++;
      }

      if (currentFilter.isStateOpen !== null) {
        num++;
      }

      if (currentFilter.readOnly !== null) {
        num++;
      }

      if (currentFilter.unreadOnly !== null) {
        num++;
      }

      setNumOfFilters(num);
    }
  };

  useEffect(() => {
    countFilters(currentFilter);
  }, [appliedFilters, currentFilter]);

  const onFilterUpdated = (
    filters: Collection<ConversationFilter & Object>,
  ) => {
    setCurrentFilter(filters[0]);
  };

  useEffect(() => {
    const pagination: Pagination | undefined = realm.objects<Pagination>(
      'FilterConversationPagination',
    )[0];

    if (appliedFilters && numOfFilters > 1 && pagination) {
      console.log('PAGINATION RESET');
      realm.write(() => {
        pagination.previousCursor = null;
        pagination.nextCursor = null;
        pagination.total = null;
      });
    }
  }, [appliedFilters, numOfFilters, currentFilter]);

  useEffect(() => {
    const filterListener =
      realm.objects<ConversationFilter>('ConversationFilter');
    filterListener.addListener(onFilterUpdated);

    setTimeout(() => {
      listConversations(
        appliedFilters,
        currentFilter,
        setLoading,
        setConversations,
        setAllConversations,
      );
    }, 200);

    return () => {
      filterListener.removeAllListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let databaseConversations = realm
      .objects<Conversation[]>('Conversation')
      .sorted('lastMessage.sentAt', true);

    if (currentFilter && !appliedFilters) {
      console.log('FILTER RESET');
      databaseConversations = databaseConversations.filtered(
        'metadata.contact.displayName CONTAINS[c] $0 && metadata.state LIKE $1 && filtered == false',
        getDisplayNameForRealmFilter(currentFilter),
        getStateForRealmFilter(currentFilter),
      );
    }

    if (currentFilter && appliedFilters) {
      databaseConversations = databaseConversations.filtered(
        'metadata.contact.displayName CONTAINS[c] $0 && metadata.state LIKE $1 && filtered == false',
        getDisplayNameForRealmFilter(currentFilter),
        getStateForRealmFilter(currentFilter),
      );

      if (currentFilter.byChannels.length > 0) {
        databaseConversations = databaseConversations.filtered(
          '$0 CONTAINS[c] channel.id && filtered == false',
          filteredChannels(),
        );
      }

      if (isFilterReadOnly(currentFilter)) {
        databaseConversations = databaseConversations.filtered(
          'metadata.unreadCount = 0 && filtered == false',
        );
      }

      if (isFilterUnreadOnly(currentFilter)) {
        databaseConversations = databaseConversations.filtered(
          'metadata.unreadCount != 0 && filtered == false',
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
  }, [currentFilter, appliedFilters]);

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

  const debouncedListPreviousConversations = debounce(() => {
    const pagination = getPagination(appliedFilters);
    const nextCursor = pagination.nextCursor;

    console.log('DEBOUNCE LISTPREV - nextCursor', nextCursor);

    getNextConversationList(
      nextCursor,
      appliedFilters,
      currentFilter,
      setConversations,
      setAllConversations,
      allConversations,
    );
  }, 2000);

  const memoizedRenderItem = React.useCallback(
    ({item}) => {
      const renderItem = item => {
        return (
          <ConversationListItem
            key={item.id}
            conversation={item}
            navigation={navigation}
          />
        );
      };

      return renderItem(item);
    },
    [navigation],
  );

  const getItemLayout = (data, index) => ({
    length: 100,
    offset: 100 * index,
    index,
  });

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <AiryLoader />
      ) : conversations && conversations.length === 0 && !appliedFilters ? (
        <NoConversations conversations={conversations.length} />
      ) : conversations && conversations.length > 0 ? (
        <FlatList
          data={conversations}
          renderItem={memoizedRenderItem}
          getItemLayout={getItemLayout}
          onEndReachedThreshold={0.1}
          onEndReached={debouncedListPreviousConversations}
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
