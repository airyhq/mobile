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
  filterReseted: boolean;
};

export const ChannelComponent = (props: ChannelComponentProps) => {
  const {filterReseted} = props;
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
    .filtered('connected == true');

  // const selectedChannelsToggle = (item: Channel) => {
  //   const index = selectedChannels.indexOf(item);
  //   index === -1
  //     ? selectedChannels.push(item)
  //     : selectedChannels.splice(index, 1);

  //   if (currentFilter) {
  //     realm.write(() => {
  //       currentFilter.byChannels = selectedChannels;
  //     });
  //   }
  // };

  const selectedChannelsToggle = (item: Channel) => {
    selectedChannels.filter(channel => channel.id === item.id).length > 0
      ? console.log('')
      : setSelectedChannels(selectedChannels => [...selectedChannels, item]);

    if (currentFilter) {
      realm.write(() => {
        currentFilter.byChannels = selectedChannels;
      });
    }
  };

  useEffect(() => {
    if (currentFilter) {
      filterReseted && setSelectedChannels([]);
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
          displayName: null,
        });
      });
    }
  }, [selectedChannels]);

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
                // selectedChannels.includes(item) && {
                //   backgroundColor: colorBackgroundBlue,
                // },
                // ? {
                //     backgroundColor: colorBackgroundBlue,
                //   }
                // : {backgroundColor: 'white'},
              ]}>
              <IconChannel
                source={item.source}
                sourceChannelId={item.sourceChannelId}
                metadataName={item.metadata?.name}
                customWidth={windowWidth / 3}
                showAvatar
                showName
              />
              <View
                style={{
                  position: 'absolute',
                  right: 4,
                  top: 4,
                }}>
                {/* {selectedChannels.includes(item) && (
                  <Checkmark height={20} width={20} fill={colorSoftGreen} />
                )} */}
              </View>
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  connectedChannelList: {
    height: 110,
    marginBottom: 8,
  },
});
