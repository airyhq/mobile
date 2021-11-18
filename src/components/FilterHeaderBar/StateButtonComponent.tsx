import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {
  colorAiryBlue,
  colorContrast,
  colorRedAlert,
  colorSoftGreen,
} from '../../assets/colors';
import {ConversationFilter} from '../../model';
import {RealmDB} from '../../storage/realm';

type StateButtonCompontentProps = {
  currentFilter: ConversationFilter;
};

export const StateButtonComponent = (props: StateButtonCompontentProps) => {
  const {currentFilter} = props;
  const realm = RealmDB.getInstance();
  const [stateActiveOpen, setStateActiveOpen] = useState<boolean>(
    currentFilter?.isStateOpen,
  );

  useEffect(() => {
    if (currentFilter) {
      realm.write(() => {
        currentFilter.isStateOpen = stateActiveOpen;
      });
    } else {
      realm.write(() => {
        realm.create<ConversationFilter>('ConversationFilter', {
          isStateOpen: stateActiveOpen,
          unreadOnly: null,
          readOnly: null,
          byChannels: [],
          displayName: '',
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateActiveOpen, setStateActiveOpen]);

  useEffect(() => {
    setStateActiveOpen(currentFilter.isStateOpen);
  }, [currentFilter]);

  return (
    <View
      style={{
        marginBottom: 12,
      }}>
      <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
        <TouchableOpacity
          style={[
            stateActiveOpen === null
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
          onPress={() => setStateActiveOpen(null)}>
          <Text
            style={[
              styles.text,
              {
                color: stateActiveOpen === null ? 'white' : colorContrast,
              },
            ]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            stateActiveOpen === true
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
          onPress={() => setStateActiveOpen(true)}>
          <Text
            style={[
              styles.text,
              {color: stateActiveOpen === true ? 'white' : colorRedAlert},
            ]}>
            Open
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            stateActiveOpen === false
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
          onPress={() => setStateActiveOpen(false)}>
          <Text
            style={[
              styles.text,
              {
                color: stateActiveOpen === false ? 'white' : colorSoftGreen,
              },
            ]}>
            Done
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
  text: {
    fontFamily: 'Lato',
  },
});
