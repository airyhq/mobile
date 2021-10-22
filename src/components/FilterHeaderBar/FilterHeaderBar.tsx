import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
  Vibration,
} from 'react-native';
import {
  colorAiryBlue,
  colorLightGray,
  colorRedAlert,
} from '../../assets/colors';
import FilterIcon from '../../assets/images/icons/filterIcon.svg';
import ChevronUpIcon from '../../assets/images/icons/chevronUp.svg';
import {RealmDB} from '../../storage/realm';
import {ReadUnreadComponent} from './ReadUnreadComponent';
import {StateButtonComponent} from './StateButtonComponent';
import {ChannelComponent} from './ChannelCompontent';
import {SearchBarComponent} from './SearchBarComponent';
import {Channel, ConversationFilter} from '../../model';

export const FilterHeaderBar = () => {
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [appliedFilters, setAppliedFilters] = useState<boolean>(false);
  const [filterReset, setFilterReset] = useState<boolean>(false);
  const defaultHeaderHeight = 45;
  const defaultHeaderHeightExpanded = 290;
  const CHANNEL_COMPONENT_HEIGHT = 100;
  const PADDING_COLLAPSEDFILTER = 32;
  const windowWidth = Dimensions.get('window').width;
  const realm = RealmDB.getInstance();
  const currentFilter =
    realm.objects<ConversationFilter>('ConversationFilter')[0];

  const connectedChannels = realm
    .objects<Channel>('Channel')
    .filtered('connected == true');

  const expandedHeaderHeight =
    connectedChannels.length > 0
      ? defaultHeaderHeightExpanded
      : defaultHeaderHeightExpanded - CHANNEL_COMPONENT_HEIGHT;

  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    filterApplied();
  }, [currentFilter]);

  const filterApplied = () => {
    if (currentFilter !== undefined) {
      currentFilter?.displayName !== '' ||
      currentFilter?.byChannels.length > 0 ||
      currentFilter?.isStateOpen !== null ||
      currentFilter?.readOnly !== null ||
      currentFilter?.unreadOnly !== null
        ? setAppliedFilters(true)
        : setAppliedFilters(false);
    }
  };

  const fadeInAnimation = () => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const toggleFiltering = () => {
    setFilterOpen(!filterOpen);
    !filterOpen ? fadeInAnimation() : fadeAnimation.setValue(0);
    !appliedFilters && setFilterReset(false);
  };

  const resetFilters = () => {
    setFilterReset(true);
    Vibration.vibrate();
    setAppliedFilters(false);
  };

  const CollapsedFilterView = () => {
    return (
      <Animated.View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: windowWidth,
          height: defaultHeaderHeight,
          backgroundColor: 'white',
          borderBottomWidth: 0.5,
          borderBottomColor: colorLightGray,
        }}>
        <View
          style={{
            width: windowWidth - PADDING_COLLAPSEDFILTER,
            paddingLeft: 8,
            paddingRight: 8,
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <SearchBarComponent filterReset={filterReset} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View>
              <TouchableOpacity onPress={toggleFiltering}>
                <FilterIcon width={32} height={32} fill={colorAiryBlue} />
              </TouchableOpacity>
              {appliedFilters && (
                <View
                  style={{
                    position: 'absolute',
                    right: 4,
                    top: 2,
                    height: 8,
                    width: 8,
                    backgroundColor: 'red',
                    borderRadius: 50,
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  const ExpandedFilterView = () => {
    return (
      <Animated.View
        style={{
          height: expandedHeaderHeight,
          opacity: fadeAnimation,
          backgroundColor: 'white',
          width: windowWidth,
          justifyContent: 'flex-end',
          borderBottomColor: colorLightGray,
          borderBottomWidth: 0.5,
        }}>
        <View style={{marginLeft: 12, marginRight: 12}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.headerTitleExpanded}>Filter</Text>
            {appliedFilters && (
              <TouchableOpacity onPress={resetFilters}>
                <Text style={{marginRight: 8, color: colorAiryBlue}}>
                  Reset
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <ReadUnreadComponent filterReset={filterReset} />
          <StateButtonComponent filterReset={filterReset} />
          {connectedChannels.length > 0 && (
            <ChannelComponent filterReset={filterReset} />
          )}
          <View
            style={{
              marginBottom: 16,
              marginTop: 8,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={toggleFiltering}
              style={{
                position: 'absolute',
                bottom: -23,
                right: windowWidth / 2 - 40,
                padding: 0,
              }}>
              <ChevronUpIcon height={48} width={48} fill={colorRedAlert} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  return filterOpen ? <ExpandedFilterView /> : <CollapsedFilterView />;
};

const styles = StyleSheet.create({
  headerTitleExpanded: {
    fontSize: 28,
    fontFamily: 'Lato',
  },
  headerTitleCollapsed: {
    fontSize: 20,
    fontFamily: 'Lato',
    marginLeft: 8,
  },
});
