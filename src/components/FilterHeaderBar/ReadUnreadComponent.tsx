import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {
  colorAiryBlue,
  colorRedAlert,
  colorSoftGreen,
} from '../../assets/colors';
import {ConversationFilter} from '../../model/ConversationFilter';
import {RealmDB} from '../../storage/realm';

type ReadUnreadComponentProps = {
  currentFilter: ConversationFilter;
};

export const ReadUnreadComponent = (props: ReadUnreadComponentProps) => {
  const {currentFilter} = props;
  const realm = RealmDB.getInstance();
  const [stateActiveRead, setStateActiveRead] = useState<boolean>(
    currentFilter?.readOnly,
  );
  const [stateActiveUnRead, setStateActiveUnRead] = useState<boolean>(
    currentFilter?.unreadOnly,
  );
  const {colors} = useTheme();

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
    setStateActiveRead(currentFilter.readOnly);
    setStateActiveUnRead(currentFilter.unreadOnly);
  }, [currentFilter]);

  return (
    <View
      style={{
        marginBottom: 12,
        marginTop: 12,
      }}>
      <Text style={{color: colors.text, fontFamily: 'Lato', paddingBottom: 8}}>
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
              borderRightWidth: 0,
            },
          ]}
          onPress={() => {
            setStateActiveRead(null);
            setStateActiveUnRead(null);
          }}>
          <Text
            style={[
              styles.text,
              {
                color:
                  (stateActiveRead || stateActiveUnRead) === null
                    ? 'white'
                    : colors.text,
              },
            ]}>
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
              borderRightWidth: 0,
            },
          ]}
          onPress={() => {
            setStateActiveRead(false);
            setStateActiveUnRead(true);
          }}>
          <Text
            style={[
              styles.text,
              {
                color: stateActiveUnRead === true ? 'white' : colorRedAlert,
              },
            ]}>
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
            style={[
              styles.text,
              {
                color: stateActiveRead === true ? 'white' : colorSoftGreen,
              },
            ]}>
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
    borderColor: colorAiryBlue,
  },
  buttonInactive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colorAiryBlue,
  },
  text: {
    fontFamily: 'Lato',
  },
});
