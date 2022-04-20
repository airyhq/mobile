import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  SafeAreaView,
  FlatList,
  View,
} from 'react-native';
import {NavigationStackProp} from 'react-navigation-stack';
import {Collection} from 'realm';
import {debounce} from 'lodash-es';
import {ConversationListItem} from '../ConversationListItem';
import {NoConversations} from '../NoConversations';
import {RealmDB} from '../../../storage/realm';
import {
  getConversationPagination,
  getFilteredConversationPagination,
  filterApplied,
} from '../../../services';
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
  listPreviousConversations,
  listPreviousFilteredConversations,
} from '../../../api/Conversation';
import {listChannels} from '../../../api/Channel';
import {useTheme} from '@react-navigation/native';

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
  const [initialConversationsFetched, setInitialConversationsFetched] =
    useState(false);
  const [loading, setLoading] = useState(true);
  let filteredChannelArray = [];
  const {colors} = useTheme();

  const onFilterUpdated = (
    filters: Collection<ConversationFilter & Object>,
  ) => {
    setCurrentFilter(filters[0]);
  };

  useEffect(() => {
    const filterListener =
      realm.objects<ConversationFilter>('ConversationFilter');
    filterListener.addListener(onFilterUpdated);

    setTimeout(() => {
      listConversations(setLoading, setAllConversations);

      listChannels();

      setInitialConversationsFetched(true);
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

    if (!appliedFilters) {
      //RESET
      databaseConversations =
        databaseConversations.filtered('filtered == false');
    }

    if (currentFilter && appliedFilters) {
      //STATE
      if (currentFilter.isStateOpen !== null) {
        databaseConversations = databaseConversations.filtered(
          'metadata.state LIKE $0',
          getStateForRealmFilter(currentFilter),
        );
      }

      //DISPLAY NAME SEARCH
      if (currentFilter.displayName !== '') {
        databaseConversations = databaseConversations.filtered(
          'metadata.contact.displayName CONTAINS[c] $0 ',
          getDisplayNameForRealmFilter(currentFilter),
        );
      }

      //CHANNEL
      if (currentFilter.byChannels.length > 0) {
        databaseConversations = databaseConversations.filtered(
          '$0 CONTAINS[c] channel.id',
          filteredChannels(),
        );
      }

      //READ
      if (isFilterReadOnly(currentFilter)) {
        databaseConversations = databaseConversations.filtered(
          'metadata.unreadCount = 0',
        );
      }

      //UNREAD
      if (isFilterUnreadOnly(currentFilter)) {
        databaseConversations = databaseConversations.filtered(
          'metadata.unreadCount != 0',
        );
      }
    }

    filterApplied(currentFilter, setAppliedFilters);

    if (databaseConversations && currentFilter && appliedFilters) {
      if (
        databaseConversations &&
        databaseConversations.length <= 1 &&
        initialConversationsFetched
      ) {
        setLoading(true);
        debouncedListPreviousFilteredConversations();
      }

      if (realm.isInTransaction) {
        realm.cancelTransaction();
      }

      updateFilteredPaginationData(databaseConversations.length);
    }

    if (databaseConversations) {
      databaseConversations.addListener(() => {
        setConversations([...databaseConversations]);
      });
    }

    return () => {
      databaseConversations.removeAllListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilter, appliedFilters, initialConversationsFetched]);

  const updateFilteredPaginationData = (
    databasesConversationsLength: number,
  ): void => {
    const filteredConversationPagination: Pagination | undefined =
      realm.objects<Pagination>('FilterConversationPagination')[0];

    const updatedNextCursor: string = databasesConversationsLength.toString();

    if (!filteredConversationPagination) {
      realm.write(() => {
        realm.create('FilterConversationPagination', {
          loading: false,
          previousCursor: null,
          nextCursor: updatedNextCursor,
          total: null,
        });
      });
    } else {
      realm.write(() => {
        filteredConversationPagination.previousCursor = null;
        filteredConversationPagination.nextCursor = updatedNextCursor;
        filteredConversationPagination.total = null;
      });
    }
  };

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
    const pagination = getConversationPagination();

    if (
      pagination.nextCursor === null &&
      conversations.length === pagination.total
    ) {
      return;
    }

    listPreviousConversations(
      pagination.nextCursor,
      setAllConversations,
      setLoading,
    );
  }, 2000);

  const debouncedListPreviousFilteredConversations = debounce(() => {
    const pagination = getFilteredConversationPagination();

    if (
      pagination.nextCursor === null &&
      conversations.length === pagination.total
    ) {
      return;
    }

    listPreviousFilteredConversations(
      pagination.nextCursor,
      currentFilter,
      allConversations,
      setLoading,
    );
  }, 2000);

  const memoizedRenderItem = React.useCallback(
    ({item}) => {
      const renderItem = (conversation: Conversation) => {
        return (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
            navigation={navigation}
          />
        );
      };

      return renderItem(item);
    },
    [navigation],
  );

  const getItemLayout = useCallback(
    (data, index: number) => ({
      length: 100,
      offset: 100 * index,
      index,
    }),
    [],
  );

  const keyExtractor = useCallback(item => item.id, []);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      {loading ? (
        <AiryLoader />
      ) : conversations && conversations.length === 0 && !appliedFilters ? (
        <NoConversations conversations={conversations.length} />
      ) : conversations && conversations.length > 0 ? (
        <FlatList
          data={conversations}
          renderItem={memoizedRenderItem}
          getItemLayout={getItemLayout}
          onEndReachedThreshold={8}
          keyExtractor={keyExtractor}
          onEndReached={
            appliedFilters
              ? debouncedListPreviousFilteredConversations
              : debouncedListPreviousConversations
          }
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
    justifyContent: 'center',
  },
});
