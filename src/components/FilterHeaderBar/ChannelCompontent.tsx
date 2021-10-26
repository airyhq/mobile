import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  colorBackgroundBlue,
  colorSoftGreen,
  colorTextGray,
} from '../../assets/colors';
import {Channel} from '../../model/Channel';
import IconChannel from '../IconChannel';
import Checkmark from '../../assets/images/icons/checkmark-circle.svg';
import {RealmDB} from '../../storage/realm';
import {ConversationFilter} from '../../model/ConversationFilter';

type ChannelComponentProps = {
  filterReset: boolean;
};

export const ChannelComponent = (props: ChannelComponentProps) => {
  const {filterReset} = props;
  const channelListRef = useRef<FlatList>(null);
  const CHANNEL_PADDING = 48;
  const windowWidth = Dimensions.get('window').width;
  const realm = RealmDB.getInstance();
  const currentFilter =
    realm.objects<ConversationFilter>('ConversationFilter')[0];
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>(
    currentFilter?.byChannels || [],
  );

  const connectedChannels = realm
    .objects<Channel>('Channel')
    .sorted('metadata.name', false)
    .filtered('connected == true');

  const selectedChannelsToggle = (item: Channel) => {
    selectedChannels.filter(channel => channel.id === item.id).length > 0
      ? setSelectedChannels(
          selectedChannels.filter(channel => channel.id !== item.id),
        )
      : setSelectedChannels(selectedChannels => [...selectedChannels, item]);

    if (currentFilter) {
      realm.write(() => {
        currentFilter.byChannels = selectedChannels;
      });
    }
  };

  useEffect(() => {
    if (currentFilter) {
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
    if (filterReset) {
      setSelectedChannels([]);
      realm.write(() => {
        currentFilter.byChannels = selectedChannels;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterReset]);

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
            selectedChannels.find(channel => channel.id === item.id)
              ? {backgroundColor: colorBackgroundBlue}
              : {backgroundColor: 'white'},
          ]}>
          <View style={styles.iconChannelCheckmarkContainer}>
            <View style={styles.iconChannel}>
              <IconChannel
                source={item.source}
                sourceChannelId={item.sourceChannelId}
                metadataName={item.metadata?.name}
                customWidth={windowWidth / 3.3}
                showAvatar
                showName
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
      keyExtractor={(item, index) => item.id + index}
      renderItem={({item}) => {
        return <ChannelItem item={item} />;
      }}
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
