import React, {useRef} from 'react';
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

export const ChannelComponent = () => {
  const selectedChannels: Channel[] = [];
  const channelListRef = useRef<FlatList>(null);
  const CHANNEL_PADDING = 48;
  const windowWidth = Dimensions.get('window').width;
  const realm = RealmDB.getInstance();

  const connectedChannels = realm
    .objects<Channel>('Channel')
    .filtered('connected == true');

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
                metadataName={item.metadata?.name}
                customWidth={windowWidth / 3}
                showAvatar
                showName
              />
              <View
                style={{
                  position: 'absolute',
                  right: 4,
                  alignSelf: 'center',
                }}>
                {!selectedChannels.includes(item) && (
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

const styles = StyleSheet.create({
  connectedChannelList: {
    height: 110,
    marginBottom: 8,
  },
});
