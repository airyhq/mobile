import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import {
  colorAiryBlue,
  colorAiryLogoBlue,
  colorBackgroundBlue,
  colorBackgroundGray,
  colorContrast,
  colorLightGray,
  colorRedAlert,
  colorSoftGreen,
  colorTextGray,
} from '../assets/colors';
import FilterIcon from '../assets/images/icons/filterIcon.svg';
import IconChannel from './IconChannel';
import Checkmark from '../assets/images/icons/checkmark-circle.svg';
import SearchIcon from '../assets/images/icons/search.svg';
import {Channel} from '../model/Channel';
import {RealmDB} from '../storage/realm';
import {Conversation} from '../model/Conversation';

const CONNECTED_CHANNEL_DUMMIE = [
  {
    name: 'Google Berlin',
    source: 'google',
    sourceChannelId: '3218239012',
    metadataName: 'Google Account',
  },
  {
    name: 'Facebook Berlin',
    source: 'facebook',
    sourceChannelId: '3213839012',
    metadataName: 'Facebook Account',
  },
  {
    name: 'Twilio SMS Berlin',
    source: 'twilio.sms',
    sourceChannelId: '3213839012',
    metadataName: 'SMS Account',
  },
  {
    name: 'Twilio Whatsapp Berlin',
    source: 'twilio.whatsapp',
    sourceChannelId: '3213839012',
    metadataName: 'Whatsapp Account',
  },
  {
    name: 'CP Berlin',
    source: 'chatplugin',
    sourceChannelId: '3251839012',
    metadataName: 'Chatplugin Account',
  },
  {
    name: 'CP Berlin',
    source: 'viber',
    sourceChannelId: '3216839012',
    metadataName: 'Viber Account',
  },
  {
    name: 'CP Berlin',
    source: 'instagram',
    sourceChannelId: '3271839012',
    metadataName: 'Instagram Account 31290321',
  },
  {
    name: 'CP Berlin',
    source: 'unknown',
    sourceChannelId: '392183679012',
    metadataName: 'Unknown Account',
  },
];

type FilterHeaderBarProps = {};

export const FilterHeaderBar = (props: FilterHeaderBarProps) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [stateActiveRead, setStateActiveRead] = useState(0);
  const [stateActiveOpen, setStateActiveOpen] = useState(0);
  const [filterActive, setFilterActive] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const channelListRef = useRef<FlatList>(null);
  const defaultHeaderHeight = 45;
  const expandedHeaderHeight = 330;
  const windowWidth = Dimensions.get('window').width;
  const CHANNEL_PADDING = 48;
  const expandAnimation = useRef(
    new Animated.Value(defaultHeaderHeight),
  ).current;
  const realm = RealmDB.getInstance();
  const conversationsLength =
    realm.objects<Conversation>('Conversation').length;
  const connectedChannels = realm
    .objects<Channel>('Channel')
    .filtered('connected == true');

  // useEffect(() => {
  //   console.log('RE-RENDER');
  // }, [searchInput, setSearchInput]);

  const StateButtonComponent = () => {
    return (
      <View
        style={{
          marginBottom: 12,
        }}>
        <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
          <TouchableOpacity
            style={[
              stateActiveOpen === 0
                ? styles.buttonActive
                : styles.buttonInactive,
              {
                flex: 1,
                height: 24,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopLeftRadius: 24,
                borderBottomLeftRadius: 24,
              },
            ]}
            onPress={() => setStateActiveOpen(0)}>
            <Text
              style={{color: stateActiveOpen === 0 ? 'white' : colorContrast}}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              stateActiveOpen === 1
                ? styles.buttonActive
                : styles.buttonInactive,
              {
                flex: 1,
                height: 24,
                justifyContent: 'center',
                alignItems: 'center',
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
              },
            ]}
            onPress={() => setStateActiveOpen(1)}>
            <Text
              style={{color: stateActiveOpen === 1 ? 'white' : colorRedAlert}}>
              Open
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              stateActiveOpen === 2
                ? styles.buttonActive
                : styles.buttonInactive,
              {
                flex: 1,
                height: 24,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopRightRadius: 24,
                borderBottomRightRadius: 24,
              },
            ]}
            onPress={() => setStateActiveOpen(2)}>
            <Text
              style={{color: stateActiveOpen === 2 ? 'white' : colorSoftGreen}}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const ReadUnreadComponent = () => {
    return (
      <View
        style={{
          marginBottom: 12,
          marginTop: 12,
        }}>
        <Text
          style={{color: colorTextGray, fontFamily: 'Lato', paddingBottom: 8}}>
          Conversation Status
        </Text>
        <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
          <TouchableOpacity
            style={[
              stateActiveRead === 0
                ? styles.buttonActive
                : styles.buttonInactive,
              {
                flex: 1,
                height: 24,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopLeftRadius: 24,
                borderBottomLeftRadius: 24,
              },
            ]}
            onPress={() => setStateActiveRead(0)}>
            <Text
              style={{color: stateActiveRead === 0 ? 'white' : colorContrast}}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              stateActiveRead === 1
                ? styles.buttonActive
                : styles.buttonInactive,
              {
                flex: 1,
                height: 24,
                justifyContent: 'center',
                alignItems: 'center',
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
              },
            ]}
            onPress={() => setStateActiveRead(1)}>
            <Text
              style={{color: stateActiveRead === 1 ? 'white' : colorRedAlert}}>
              Unread
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              stateActiveRead === 2
                ? styles.buttonActive
                : styles.buttonInactive,
              {
                flex: 1,
                height: 24,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopRightRadius: 24,
                borderBottomRightRadius: 24,
              },
            ]}
            onPress={() => setStateActiveRead(2)}>
            <Text
              style={{color: stateActiveRead === 2 ? 'white' : colorSoftGreen}}>
              Read
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const ChannelComponent = () => {
    const selectedChannels: Channel[] = [];

    const selectedChannelsToggle = (item: Channel) => {
      const index = selectedChannels.indexOf(item);
      index === -1
        ? selectedChannels.push(item)
        : selectedChannels.splice(index, 1);
    };

    return (
      <FlatList
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <Text
            style={{
              fontFamily: 'Lato',
              color: colorTextGray,
              paddingBottom: 8,
              backgroundColor: 'white',
            }}>
            Channel
          </Text>
        }
        numColumns={2}
        style={styles.connectedChannelList}
        data={connectedChannels}
        ref={channelListRef}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <View
              style={{
                flex: 1,
                paddingBottom: 8,
              }}>
              <TouchableOpacity
                onPress={() => selectedChannelsToggle(item)}
                style={[
                  {
                    flexDirection: 'column',
                    padding: 4,
                    borderRadius: 24,
                    maxWidth: (windowWidth - CHANNEL_PADDING) / 2,
                  },
                  selectedChannels.includes(item) && {
                    backgroundColor: colorBackgroundBlue,
                  },
                  // ? {
                  //     backgroundColor: colorBackgroundBlue,
                  //   }
                  // : {backgroundColor: 'white'},
                ]}>
                <IconChannel
                  source={item.source}
                  sourceChannelId={item.sourceChannelId}
                  metadataName={item.metadata?.name}
                  showAvatar
                  showName
                />
                <View
                  style={{
                    position: 'absolute',
                    right: 4,
                    alignSelf: 'center',
                  }}>
                  {selectedChannels.includes(item) && (
                    <Checkmark height={20} width={20} fill={colorSoftGreen} />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    );
  };

  console.log('SEARCH: ', searchInput);

  const SearchBarComponent = () => {
    return (
      <View style={styles.searchBarContainer}>
        <SearchIcon height={18} width={18} fill={colorRedAlert} />
        <TextInput
          placeholderTextColor={colorTextGray}
          placeholder="Search Conversation..."
          style={styles.searchBar}
          onChangeText={(text: string) => setSearchInput(text)}
          value={searchInput}
        />
      </View>
    );
  };

  const onCollapse = () => {
    Animated.timing(expandAnimation, {
      toValue: expandedHeaderHeight,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const onExpand = () => {
    Animated.timing(expandAnimation, {
      toValue: defaultHeaderHeight,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const toggleFiltering = () => {
    filterOpen ? onExpand() : onCollapse();
    setFilterOpen(!filterOpen);
  };

  const applyFilters = () => {
    filterOpen ? onExpand() : onCollapse();
    setFilterOpen(!filterOpen);
  };

  const CollapsedFilterView = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            width: windowWidth,
            height: defaultHeaderHeight,
            backgroundColor: 'white',
            borderBottomWidth: 1,
            borderBottomColor: colorLightGray,
          }}>
          <View
            style={{
              flex: 1,
              height: defaultHeaderHeight,
              justifyContent: 'center',
              marginLeft: 12,
            }}>
            <Text style={styles.headerTitleCollapsed}>
              Inbox: {conversationsLength}
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleFiltering}
            style={{marginRight: 8, marginBottom: 8}}>
            <View
              style={
                filterActive ? styles.filterApplied : styles.filterNotApplied
              }>
              <FilterIcon
                height={32}
                width={32}
                fill={filterActive ? colorRedAlert : colorAiryBlue}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const ExpandedFilterView = () => {
    return (
      <View
        style={{
          height: expandedHeaderHeight,
          backgroundColor: 'white',
          width: windowWidth,
          justifyContent: 'flex-end',
          borderBottomColor: colorLightGray,
          borderBottomWidth: 1,
        }}>
        <View style={{marginLeft: 12, marginRight: 12}}>
          <Text style={styles.headerTitleExpanded}>Filter</Text>
          <ReadUnreadComponent />
          <StateButtonComponent />
          <ChannelComponent />
          <SearchBarComponent />
          <View
            style={{
              marginBottom: 8,
              justifyContent: 'center',
              alignSelf: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={applyFilters}
              style={{
                height: 30,
                width: 72,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colorAiryBlue,
                borderRadius: 8,
              }}>
              <Text style={{color: 'white', fontFamily: 'Lato'}}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return filterOpen ? <ExpandedFilterView /> : <CollapsedFilterView />;
};

const styles = StyleSheet.create({
  buttonActive: {
    backgroundColor: colorAiryBlue,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  buttonInactive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colorAiryBlue,
  },
  headerTitleExpanded: {
    fontSize: 28,
    fontFamily: 'Lato',
  },
  headerTitleCollapsed: {
    fontSize: 20,
    fontFamily: 'Lato',
  },
  connectedChannelList: {
    height: 110,
    marginBottom: 8,
  },
  filterApplied: {
    backgroundColor: colorAiryLogoBlue,
    padding: 0,
    borderRadius: 50,
  },
  filterNotApplied: {
    backgroundColor: 'transparent',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#000',
    backgroundColor: colorBackgroundGray,
    padding: 5,
    paddingLeft: 8,
    borderRadius: 24,
    marginBottom: 8,
  },
  searchBar: {
    flex: 1,
    paddingLeft: 4,
  },
});

//   headerTitle: headerTitle,
//   headerTitleStyle: {
//     fontSize: 28,
//     position: 'absolute',
//     left: 0,
//     top: -150,
//     fontFamily: 'Lato',
//   },
//   headerTitleAlign: 'left',
//   headerStyle: {height: expandAnimation, backgroundColor: 'pink'},
//   headerRight: () => {
//     return filterOpen ? (
//       <ExpandedFilterView />
//     ) : (
//       <CollapsedFilterView />
//     );
//   },
// }}
