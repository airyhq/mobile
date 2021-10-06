import React, {useRef, useState} from 'react';
import {TextInput, View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  colorBackgroundGray,
  colorDarkElementsGray,
  colorTextGray,
} from '../../assets/colors';
import SearchIcon from '../../assets/images/icons/search.svg';
import CloseIcon from '../../assets/images/icons/closeIcon.svg';

export const SearchBarComponent = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchBarFocused, setSearchBarFocused] = useState(false);
  const searchBarRef = useRef(null);

  return (
    <View
      style={
        searchBarFocused ? styles.searchBarFocused : styles.searchBarContainer
      }>
      <SearchIcon height={18} width={18} fill={colorDarkElementsGray} />
      <TextInput
        ref={searchBarRef}
        placeholderTextColor={colorTextGray}
        placeholder="Search Conversation..."
        style={styles.searchBar}
        onChangeText={(text: string) => setSearchInput(text)}
        value={searchInput}
        onFocus={() => setSearchBarFocused(true)}
      />
      <TouchableOpacity onPress={() => setSearchInput('')}>
        <CloseIcon height={24} width={24} fill={colorTextGray} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'transparent',
    backgroundColor: colorBackgroundGray,
    padding: 5,
    paddingLeft: 8,
    borderRadius: 24,
    borderWidth: 1,
  },
  searchBar: {
    flex: 1,
    paddingLeft: 4,
  },
  searchBarFocused: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'transparent',
    backgroundColor: colorBackgroundGray,
    padding: 5,
    paddingLeft: 8,
    borderRadius: 24,
    borderWidth: 1,
  },
});
