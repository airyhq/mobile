import React, {useEffect, useState} from 'react';
import {StyleSheet, Dimensions, SafeAreaView, FlatList} from 'react-native';
import {NavigationStackProp} from 'react-navigation-stack';
import {Collection} from 'realm';
import {debounce} from 'lodash-es';
import {ConversationListItem} from '../ConversationListItem';
import {NoConversations} from '../NoConversations';
import {RealmDB} from '../../../storage/realm';
import {getPagination, filterApplied} from '../../../services';
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
import {listChannels} from '../../../api/Channel';

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
  const [convFetched, setConvFetched] = useState(true);
  const [loading, setLoading] = useState(true);
  let filteredChannelArray = [];

  useEffect(() => {
    console.log('APPLIED FILTER', appliedFilters);
    console.log('CURRENT FILTER', currentFilter);
  }, [appliedFilters, currentFilter]);

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

      setConvFetched(false);
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
        console.log('CURRENTFILTER BY CHANNELS', currentFilter.byChannels);
        console.log('filteredChannels()', filteredChannels());

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

    if (databaseConversations) {
      console.log('DATABASESCONV LENGTH', databaseConversations.length);

      if (currentFilter && appliedFilters) {
        const pagination: Pagination | undefined = realm.objects<Pagination>(
          'FilterConversationPagination',
        )[0];

        console.log('DYNAMIC DB.LENGTH', databaseConversations.length);

        const updatedFilteredNextCursor: string =
          databaseConversations.length.toString();

        console.log('DYNAMIC newFilteredNextCursor', updatedFilteredNextCursor);

        if (!pagination) {
          realm.write(() => {
            realm.create('FilterConversationPagination', {
              loading: false,
              previousCursor: null,
              nextCursor: updatedFilteredNextCursor,
              total: null,
            });
          });
        } else {
          realm.write(() => {
            pagination.previousCursor = null;
            pagination.nextCursor = updatedFilteredNextCursor;
            pagination.total = null;
          });
        }
      }

      if (
        databaseConversations &&
        databaseConversations.length <= 1 &&
        !convFetched
      ) {
        console.log('DATABASE.LENGTH <=1 - FETCH NEXT');
        debouncedListPreviousConversations();
      }

      databaseConversations.addListener(() => {
        console.log(
          'LISTENER databaseConversations.length',
          databaseConversations.length,
        );
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

    console.log('conversations.length', conversations.length);
    console.log('pagination.total', pagination.total);

    if (nextCursor === null && conversations.length === pagination.total) {
      console.log('DEBOUNCE RETURN');
      return;
    }

    console.log('DEBOUNCE LISTPREV - nextCursor', nextCursor);

    getNextConversationList(
      nextCursor,
      appliedFilters,
      currentFilter,
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

  const getItemLayout = (data, index: number) => ({
    length: 100,
    offset: 100 * index,
    index,
  });

  const onEndReached = () => {
    console.log('%cON END REACHED', 'color: green; background: yellow; font-size: 12px');
    
    debouncedListPreviousConversations();
  };

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
          onEndReachedThreshold={10}
          onEndReached={onEndReached}
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
