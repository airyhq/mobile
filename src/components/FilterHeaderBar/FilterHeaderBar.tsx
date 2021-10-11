import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {
  colorAiryBlue,
  colorLightGray,
  colorRedAlert,
} from '../../assets/colors';
import FilterIcon from '../../assets/images/icons/filterIcon.svg';
import ChevronUpIcon from '../../assets/images/icons/chevronUp.svg';
import {RealmDB} from '../../storage/realm';
import {Conversation} from '../../model/Conversation';
import {ReadUnreadComponent} from './ReadUnreadComponent';
import {StateButtonComponent} from './StateButtonComponent';
import {ChannelComponent} from './ChannelCompontent';
import {SearchBarComponent} from './SearchBarComponent';
import SearchIcon from '../../assets/images/icons/search.svg';
import CloseCircleIcon from '../../assets/images/icons/closeCircleIcon.svg';
import {ConversationFilter} from '../../model';

type FilterHeaderBarProps = {};

export const FilterHeaderBar = (props: FilterHeaderBarProps) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(false);
  const [filterReseted, setFilterReseted] = useState(false);
  const defaultHeaderHeight = 45;
  const expandedHeaderHeight = 300;
  const PADDING_COLLAPSEDFILTER = 32;
  const windowWidth = Dimensions.get('window').width;
  const realm = RealmDB.getInstance();
  const conversationsLength =
    realm.objects<Conversation>('Conversation').length;

  const currentFilter =
    realm.objects<ConversationFilter>('ConversationFilter')[0];

  useEffect(() => {
    filterApplied();
    setFilterReseted(false);
  }, [currentFilter]);

  const filterApplied = () => {
    console.log('APPLIED:      ', appliedFilters);
    
    currentFilter?.displayName !== (null || '') ||
    currentFilter?.byChannels.length > 0 ||
    currentFilter?.isStateOpen !== null ||
    currentFilter?.readOnly !== null ||
    currentFilter?.unreadOnly !== null
      ? setAppliedFilters(true)
      : setAppliedFilters(false);
  };

  const toggleFiltering = () => {
    setFilterOpen(!filterOpen);
  };

  const applyFiltersHandler = () => {
    setFilterOpen(!filterOpen);
  };

  const resetFilters = () => {
    if (filterApplied) {
      setFilterReseted(true);
      realm.write(() => {
        currentFilter.byChannels = [];
        currentFilter.isStateOpen = null;
        currentFilter.readOnly = null;
        currentFilter.unreadOnly = null;
      });
    }
  };

  const closeSearch = () => {
    setSearchBarOpen(false);
    realm.write(() => {
      currentFilter.displayName = '';
    });
  };

  const CollapsedFilterView = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: windowWidth,
          height: defaultHeaderHeight,
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: colorLightGray,
        }}>
        {searchBarOpen ? (
          <View
            style={{
              width: windowWidth - PADDING_COLLAPSEDFILTER,
              paddingLeft: 8,
              paddingRight: 8,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <SearchBarComponent />
            <View>
              <TouchableOpacity onPress={closeSearch}>
                <CloseCircleIcon width={32} height={32} fill={colorAiryBlue} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.headerTitleCollapsed}>
              Inbox: {conversationsLength}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => setSearchBarOpen(true)}
                style={{padding: 4}}>
                <SearchIcon height={24} width={24} fill={colorAiryBlue} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleFiltering}
                style={{
                  marginRight: 8,
                  marginLeft: 8,
                }}>
                <View>
                  <FilterIcon height={32} width={32} fill={colorAiryBlue} />
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
              </TouchableOpacity>
            </View>
          </>
        )}
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.headerTitleExpanded}>Filter</Text>
            <TouchableOpacity onPress={resetFilters} disabled={!filterApplied}>
              <Text
                style={[
                  appliedFilters
                    ? {color: colorAiryBlue}
                    : {color: 'transparent'},
                  {marginRight: 8},
                ]}>
                Reset
              </Text>
            </TouchableOpacity>
          </View>
          <ReadUnreadComponent filterReseted={filterReseted} />
          <StateButtonComponent filterReseted={filterReseted} />
          <ChannelComponent filterReseted={filterReseted} />
          <View
            style={{
              marginBottom: 8,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() => setFilterOpen(false)}
              style={{
                position: 'absolute',
                bottom: -10,
                right: windowWidth / 2 - 40,
                padding: 0,
              }}>
              <ChevronUpIcon height={48} width={48} fill={colorRedAlert} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={applyFiltersHandler}
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
