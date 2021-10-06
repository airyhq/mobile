import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {
  colorAiryBlue,
  colorAiryLogoBlue,
  colorLightGray,
  colorRedAlert,
} from '../../assets/colors';
import FilterIcon from '../../assets/images/icons/filterIcon.svg';
import ChevronUpIcon from '../../assets/images/icons/chevronUp.svg';
import {RealmDB} from '../../storage/realm';
import {Conversation} from '../../model/Conversation';
import {fetchFilteredConversations} from '../../api/Conversation';
import {ReadUnreadComponent} from './ReadUnreadComponent';
import {StateButtonComponent} from './StateButtonComponent';
import {ChannelComponent} from './ChannelCompontent';
import {SearchBarComponent} from './SearchBarComponent';
import SearchIcon from '../../assets/images/icons/search.svg';

type FilterHeaderBarProps = {};

export const FilterHeaderBar = (props: FilterHeaderBarProps) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [searchBarFocused, setSearchBarFocused] = useState(false);
  const [searchBarInput, setSearchBarInput] = useState('');
  const defaultHeaderHeight = 45;
  const expandedHeaderHeight = 330;
  const windowWidth = Dimensions.get('window').width;
  const expandAnimation = useRef(
    new Animated.Value(defaultHeaderHeight),
  ).current;
  const realm = RealmDB.getInstance();
  const conversationsLength =
    realm.objects<Conversation>('Conversation').length;

  useEffect(() => {
    fetchFilteredConversations();
    console.log('KALALLAA');
    console.log('INPUT: ', searchBarInput);
  }, [searchBarInput, setSearchBarInput]);

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

  const inputHandler = (input: string) => {
    setSearchBarInput(input);
  };

  const closeSearchBarHandler = () => {
    setSearchBarOpen(false);
  };

  const CollapsedFilterView = () => {
    return (
      <View>
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
          {!searchBarOpen ? (
            <View style={{width: windowWidth, paddingLeft: 8, paddingRight: 8}}>
              <SearchBarComponent
                input={searchBarInput}
                setInput={() => inputHandler(searchBarInput)}
              />
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
                  <SearchIcon height={24} width={24} fill={colorRedAlert} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={toggleFiltering}
                  style={{
                    marginRight: 8,
                    marginLeft: 8,
                  }}>
                  <View
                    style={
                      filterActive
                        ? styles.filterApplied
                        : styles.filterNotApplied
                    }>
                    <FilterIcon
                      height={32}
                      width={32}
                      fill={filterActive ? colorRedAlert : colorAiryBlue}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}
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
  headerTitleExpanded: {
    fontSize: 28,
    fontFamily: 'Lato',
  },
  headerTitleCollapsed: {
    fontSize: 20,
    fontFamily: 'Lato',
    marginLeft: 8,
  },
  filterApplied: {
    backgroundColor: colorAiryLogoBlue,
    padding: 0,
    borderRadius: 50,
  },
  filterNotApplied: {
    backgroundColor: 'transparent',
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
