import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {
  colorAiryBlue,
  colorContrast,
  colorRedAlert,
  colorSoftGreen,
  colorTextGray,
} from '../../assets/colors';
import {ConversationFilter} from '../../model/ConversationFilter';
import {RealmDB} from '../../storage/realm';

type ReadUnreadComponentProps = {
  filterReset: boolean;
};

export const ReadUnreadComponent = (props: ReadUnreadComponentProps) => {
  const {filterReset} = props;
  const realm = RealmDB.getInstance();
  const currentFilter =
    realm.objects<ConversationFilter>('ConversationFilter')[0];
  const [stateActiveRead, setStateActiveRead] = useState<boolean>(
    currentFilter?.readOnly || null,
  );
  const [stateActiveUnRead, setStateActiveUnRead] = useState<boolean>(
    currentFilter?.unreadOnly || null,
  );

  useEffect(() => {
    if (currentFilter) {
      realm.write(() => {
        currentFilter.readOnly = stateActiveRead;
        currentFilter.unreadOnly = stateActiveUnRead;
      });
    } else {
      realm.write(() => {
        realm.create<ConversationFilter>('ConversationFilter', {
          readOnly: stateActiveRead,
          unreadOnly: stateActiveUnRead,
          byChannels: [],
          isStateOpen: null,
          displayName: '',
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    stateActiveRead,
    setStateActiveRead,
    stateActiveUnRead,
    setStateActiveUnRead,
  ]);

  useEffect(() => {
    if (filterReset) {
      setStateActiveRead(null);
      setStateActiveUnRead(null);
      realm.write(() => {
        currentFilter.readOnly = stateActiveRead;
        currentFilter.unreadOnly = stateActiveUnRead;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterReset]);

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
            (stateActiveRead || stateActiveUnRead) === null
              ? styles.buttonActive
              : styles.buttonInactive,
            {
              flex: 1,
              height: 24,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: 24,
              borderBottomLeftRadius: 24,
            },
          ]}
          onPress={() => {
            setStateActiveRead(null);
            setStateActiveUnRead(null);
          }}>
          <Text
            style={{
              color:
                (stateActiveRead || stateActiveUnRead) === null
                  ? 'white'
                  : colorContrast,
            }}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            stateActiveUnRead === true
              ? styles.buttonActive
              : styles.buttonInactive,
            {
              flex: 1,
              height: 24,
              justifyContent: 'center',
              alignItems: 'center',
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
            },
          ]}
          onPress={() => {
            setStateActiveRead(false);
            setStateActiveUnRead(true);
          }}>
          <Text
            style={{
              color: stateActiveUnRead === true ? 'white' : colorRedAlert,
            }}>
            Unread
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            stateActiveRead === true
              ? styles.buttonActive
              : styles.buttonInactive,
            {
              flex: 1,
              height: 24,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopRightRadius: 24,
              borderBottomRightRadius: 24,
            },
          ]}
          onPress={() => {
            setStateActiveRead(true);
            setStateActiveUnRead(false);
          }}>
          <Text
            style={{
              color: stateActiveRead === true ? 'white' : colorSoftGreen,
            }}>
            Read
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
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
});
