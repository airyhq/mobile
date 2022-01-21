import React, {useEffect, useState, useRef} from 'react';
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
import {listChannels} from '../../../api/Channel';
import {isEqual} from 'lodash-es';

type ConversationListProps = {
  navigation?: NavigationStackProp<{conversationId: string}>;
};

const realm = RealmDB.getInstance();

function usePrevious<T>(value: T): T {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref: any = useRef<T>();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export const ConversationList = (props: ConversationListProps) => {
  const {navigation} = props;
  const [conversations, setConversations] = useState([]);
  const [allConversations, setAllConversations] = useState([]);
  const [currentFilter, setCurrentFilter] = useState<ConversationFilter>();
  const prevCurrentFilter = usePrevious(currentFilter);
  const [appliedFilters, setAppliedFilters] = useState<boolean>();
  const [numOfFilters, setNumOfFilters] = useState(0);
  const [convFetched, setConvFetched] = useState(true)

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
    console.log('currentFilter', currentFilter);
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

      listChannels();

      setConvFetched(false);
    }, 200);

    return () => {
      filterListener.removeAllListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    console.log('CONVFETCHED', convFetched)

  }, [convFetched])

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
        console.log('filtered all ')
        console.log('getStateForRealmFilter(currentFilter)', getStateForRealmFilter(currentFilter));
      databaseConversations = databaseConversations.filtered(
        'metadata.state LIKE $0',
        getStateForRealmFilter(currentFilter),
      );
      }

      //DISPLAY NAME

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

    filterApplied();

 

    if (databaseConversations) {

      console.log('DATABASESCONV LENGTH', databaseConversations.length);

      if(databaseConversations && databaseConversations.length <= 1){
        console.log('DATABASES FETCH NEXT');
        debouncedListPreviousConversations()
        setConvFetched(true)
      }

      databaseConversations.addListener(() => {
        //databaseConversations.forEach((conv:any) => console.log('listener conv', conv.metadata.contact.displayName))
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
