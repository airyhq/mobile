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

export const StateButtonComponent = () => {
  const realm = RealmDB.getInstance();
  const currentFilter =
    realm.objects<ConversationFilter>('ConversationFilter')[0];
  const [stateActiveOpen, setStateActiveOpen] = useState<boolean>(
    currentFilter.isStateOpen,
  );

  useEffect(() => {
    if (currentFilter) {
      realm.write(() => {
        currentFilter.isStateOpen = stateActiveOpen;
      });
    } else {
      realm.write(() => {
        realm.create<ConversationFilter>('ConversationFilter', {
          readOnly: stateActiveOpen,
        });
      });
    }
  }, [stateActiveOpen, setStateActiveOpen]);

  return (
    <View
      style={{
        marginBottom: 12,
      }}>
      <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
        <TouchableOpacity
          style={[
            stateActiveOpen === undefined
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
          onPress={() => setStateActiveOpen(undefined)}>
          <Text
            style={{
              color: stateActiveOpen === undefined ? 'white' : colorContrast,
            }}>
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
            style={{color: stateActiveOpen === true ? 'white' : colorRedAlert}}>
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
            style={{
              color: stateActiveOpen === false ? 'white' : colorSoftGreen,
            }}>
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
});
