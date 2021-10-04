import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  colorAiryBlue,
  colorBackgroundBlue,
  colorContrast,
  colorLightGray,
  colorRedAlert,
  colorSoftGreen,
  colorTextGray,
} from '../assets/colors';
import FilterIcon from '../assets/images/icons/filterIcon.svg';
import IconChannel from './IconChannel';
import Checkmark from '../assets/images/icons/checkmark-circle.svg';
import {Channel} from '../model/Channel';

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

type FilterHeaderBarProps = {
  title?: string;
};

export const FilterHeaderBar = (props: FilterHeaderBarProps) => {
  const {title} = props;
  const [filterOpen, setFilterOpen] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('');
  const [stateActive, setStateActive] = useState(0);
  const channelListRef = useRef<FlatList>(null);
  const defaultHeaderHeight = 91;
  const expandedHeaderHeight = 350;
  const windowWidth = Dimensions.get('window').width;
  const expandAnimation = useRef(
    new Animated.Value(defaultHeaderHeight),
  ).current;

  const StateButtonComponent = () => {
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
              stateActive === 0 ? styles.buttonActive : styles.buttonInactive,
              {
                flex: 1,
                height: 32,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopLeftRadius: 24,
                borderBottomLeftRadius: 24,
              },
            ]}
            onPress={() => setStateActive(0)}>
            <Text style={{color: stateActive === 0 ? 'white' : colorContrast}}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              stateActive === 1 ? styles.buttonActive : styles.buttonInactive,
              {
                flex: 1,
                height: 32,
                justifyContent: 'center',
                alignItems: 'center',
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
              },
            ]}
            onPress={() => setStateActive(1)}>
            <Text style={{color: stateActive === 1 ? 'white' : colorRedAlert}}>
              Open
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              stateActive === 2 ? styles.buttonActive : styles.buttonInactive,
              {
                flex: 1,
                height: 32,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopRightRadius: 24,
                borderBottomRightRadius: 24,
              },
            ]}
            onPress={() => setStateActive(2)}>
            <Text style={{color: stateActive === 2 ? 'white' : colorSoftGreen}}>
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
              stateActive === 0 ? styles.buttonActive : styles.buttonInactive,
              {
                flex: 1,
                height: 32,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopLeftRadius: 24,
                borderBottomLeftRadius: 24,
              },
            ]}
            onPress={() => setStateActive(0)}>
            <Text style={{color: stateActive === 0 ? 'white' : colorContrast}}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              stateActive === 1 ? styles.buttonActive : styles.buttonInactive,
              {
                flex: 1,
                height: 32,
                justifyContent: 'center',
                alignItems: 'center',
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
              },
            ]}
            onPress={() => setStateActive(1)}>
            <Text style={{color: stateActive === 1 ? 'white' : colorRedAlert}}>
              Read
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              stateActive === 2 ? styles.buttonActive : styles.buttonInactive,
              {
                flex: 1,
                height: 32,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopRightRadius: 24,
                borderBottomRightRadius: 24,
              },
            ]}
            onPress={() => setStateActive(2)}>
            <Text style={{color: stateActive === 2 ? 'white' : colorSoftGreen}}>
              Unread
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const ChannelComponent = () => {
    const selectedChannels: Channel[] = [];

    useEffect(() => {}, [selectedChannels]);

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
        data={CONNECTED_CHANNEL_DUMMIE}
        ref={channelListRef}
        keyExtractor={item => item.sourceChannelId}
        renderItem={({item}) => {
          return (
            <View
              style={{
                flex: 1,
                paddingBottom: 8,
                paddingRight: 12,
              }}>
              <TouchableOpacity
                onPress={() => selectedChannelsToggle(item)}
                style={[
                  {
                    flexDirection: 'column',
                    padding: 4,
                    borderRadius: 24,
                  },
                  !selectedChannels.includes(item) && {
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
                  metadataName={item.metadataName}
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
    !filterOpen ? setHeaderTitle('Filter') : setHeaderTitle('');
    setFilterOpen(!filterOpen);
  };

  const applyFilters = () => {
    filterOpen ? onExpand() : onCollapse();
    setFilterOpen(!filterOpen);
  };

  const CollapsedFilterView = () => {
    return (
      <View
        style={{
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          width: windowWidth,
          height: defaultHeaderHeight,
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: colorLightGray,
        }}>
        <TouchableOpacity
          onPress={toggleFiltering}
          style={{marginRight: 8, marginBottom: 8}}>
          <FilterIcon height={32} width={32} fill={colorAiryBlue} />
        </TouchableOpacity>
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
          <Text style={styles.headerTitle}>{headerTitle}</Text>
          <StateButtonComponent />
          <ChannelComponent />
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
  headerTitle: {
    position: 'relative',
    left: 0,
    top: -32,
    fontSize: 28,
    fontFamily: 'Lato',
  },
  connectedChannelList: {
    height: 110,
    marginBottom: 8,
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
