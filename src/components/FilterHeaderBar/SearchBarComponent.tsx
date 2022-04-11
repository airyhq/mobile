import React, {useEffect, useState} from 'react';
import {TextInput, View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  colorBackgroundGray,
  colorDarkElementsGray,
  colorTextGray,
} from '../../assets/colors';
import SearchIcon from '../../assets/images/icons/search.svg';
import CloseIcon from '../../assets/images/icons/closeIcon.svg';
import {RealmDB} from '../../storage/realm';
import {ConversationFilter} from '../../model/ConversationFilter';
import { useTheme } from '@react-navigation/native';

type SearchBarComponentProps = {
  currentFilter: ConversationFilter;
};

const SearchBarComponent = (props: SearchBarComponentProps) => {
  const {currentFilter} = props;
  const {colors} = useTheme();

  const realm = RealmDB.getInstance();
  const [searchInput, setSearchInput] = useState(
    currentFilter?.displayName || '',
  );

  useEffect(() => {
    if (currentFilter) {
      realm.write(() => {
        currentFilter.displayName = searchInput;
      });
    } else {
      realm.write(() => {
        realm.create<ConversationFilter>('ConversationFilter', {
          byChannels: [],
          isStateOpen: null,
          unreadOnly: null,
          readOnly: null,
          displayName: searchInput,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, setSearchInput]);

  return (
    <View style={[styles.searchBarContainer, {backgroundColor: colors.background}]}>
      <SearchIcon height={18} width={18} fill={colorDarkElementsGray} />
      <TextInput
        placeholderTextColor={colorTextGray}
        placeholder="Search Conversation..."
        style={[styles.searchBar, {color: colors.text}]}
        onChangeText={(text: string) => setSearchInput(text)}
        value={searchInput}
        autoFocus={false}
      />
      {searchInput !== '' && (
        <TouchableOpacity onPress={() => setSearchInput('')}>
          <CloseIcon height={24} width={24} fill={colorTextGray} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export const SearchBar = React.memo(SearchBarComponent);

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
    padding: 3,
    fontFamily: 'Lato',
    fontSize: 16,
  },
  searchBarFocused: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'transparent',
    backgroundColor: colorBackgroundGray,
    padding: 3,
    paddingLeft: 8,
    borderRadius: 24,
    borderWidth: 1,
  },
});
