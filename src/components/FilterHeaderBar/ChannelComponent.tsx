import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {colorBackgroundBlue, colorSoftGreen} from '../../assets/colors';
import {Channel} from '../../model/Channel';
import IconChannel from '../IconChannel';
import Checkmark from '../../assets/images/icons/checkmark-circle.svg';
import {RealmDB, RealmSettingsDB} from '../../storage/realm';
import {ConversationFilter} from '../../model/ConversationFilter';
import {useTheme} from '@react-navigation/native';
import {Settings} from '../../model/Settings';

type ChannelComponentProps = {
  currentFilter: ConversationFilter;
};

export const ChannelComponent = (props: ChannelComponentProps) => {
  const {currentFilter} = props;
  const channelListRef = useRef<FlatList>(null);
  const CHANNEL_PADDING = 48;
  const windowWidth = Dimensions.get('window').width;
  const realm = RealmDB.getInstance();
  const realmSettings = RealmSettingsDB.getInstance();
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>(
    currentFilter?.byChannels || [],
  );
  const {colors} = useTheme();
  const isDarkmode =
    realmSettings.objects<Settings>('Settings')[0].isDarkModeOn;

  const connectedChannels = realm
    .objects<Channel>('Channel')
    .sorted('metadata.name', false)
    .filtered('connected == true');

  const selectedChannelsToggle = (item: Channel) => {
    selectedChannels.filter(channel => channel.id === item.id).length > 0
      ? setSelectedChannels(
          selectedChannels.filter(channel => channel.id !== item.id),
        )
      : setSelectedChannels(prevSelectedChannels => [
          ...prevSelectedChannels,
          item,
        ]);

    if (currentFilter) {
      realm.write(() => {
        currentFilter.byChannels = selectedChannels;
      });
    }
  };

  useEffect(() => {
    if (currentFilter) {
      !realm.isInTransaction &&
        realm.write(() => {
          currentFilter.byChannels = selectedChannels;
        });
    } else {
      realm.write(() => {
        realm.create<ConversationFilter>('ConversationFilter', {
          byChannels: selectedChannels,
          isStateOpen: null,
          unreadOnly: null,
          readOnly: null,
          displayName: '',
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannels, setSelectedChannels]);

  useEffect(() => {
    setSelectedChannels(currentFilter.byChannels);
  }, [currentFilter]);

  const ChannelItem = ({item}) => {
    return (
      <View style={styles.channelItemContainer}>
        <TouchableOpacity
          onPress={() => selectedChannelsToggle(item)}
          style={[
            {
              flexDirection: 'column',
              padding: 4,
              borderRadius: 24,
              maxWidth: (windowWidth - CHANNEL_PADDING) / 2,
            },
            selectedChannels.find(channel => channel.id === item.id) &&
              (isDarkmode
                ? {backgroundColor: colors.border}
                : {backgroundColor: colorBackgroundBlue}),
          ]}>
          <View style={styles.iconChannelCheckmarkContainer}>
            <View style={styles.iconChannel}>
              <IconChannel
                source={item.source}
                sourceChannelId={item.sourceChannelId}
                metadataName={item.metadata?.name}
                showAvatar
                showName
                size={20}
              />
            </View>
            {selectedChannels.find(channel => channel.id === item.id) && (
              <Checkmark height={20} width={20} fill={colorSoftGreen} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const keyExtractor = item => item.id;

  const renderItem = ({item}) => <ChannelItem item={item} />;

  return (
    <FlatList
      stickyHeaderIndices={[0]}
      ListHeaderComponent={
        <Text
          style={{
            fontFamily: 'Lato',
            color: colors.text,
            paddingBottom: 8,
            backgroundColor: colors.background,
          }}>
          Channel
        </Text>
      }
      numColumns={2}
      style={[
        styles.connectedChannelList,
        {backgroundColor: colors.background},
      ]}
      data={connectedChannels}
      ref={channelListRef}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  channelItemContainer: {
    flex: 1,
    paddingBottom: 8,
  },
  connectedChannelList: {
    height: 100,
    marginBottom: 8,
  },
  iconChannelCheckmarkContainer: {
    flexDirection: 'row',
  },
  iconChannel: {
    flex: 1,
  },
});
