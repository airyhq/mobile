import React, {useState} from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {
  colorAiryBlue,
  colorContrast,
  colorRedAlert,
  colorSoftGreen,
  colorTextGray,
} from '../../assets/colors';

export const ReadUnreadComponent = () => {
  const [stateActiveRead, setStateActiveRead] = useState(0);

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
            stateActiveRead === 0 ? styles.buttonActive : styles.buttonInactive,
            {
              flex: 1,
              height: 24,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: 24,
              borderBottomLeftRadius: 24,
            },
          ]}
          onPress={() => setStateActiveRead(0)}>
          <Text
            style={{color: stateActiveRead === 0 ? 'white' : colorContrast}}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            stateActiveRead === 1 ? styles.buttonActive : styles.buttonInactive,
            {
              flex: 1,
              height: 24,
              justifyContent: 'center',
              alignItems: 'center',
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
            },
          ]}
          onPress={() => setStateActiveRead(1)}>
          <Text
            style={{color: stateActiveRead === 1 ? 'white' : colorRedAlert}}>
            Unread
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            stateActiveRead === 2 ? styles.buttonActive : styles.buttonInactive,
            {
              flex: 1,
              height: 24,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopRightRadius: 24,
              borderBottomRightRadius: 24,
            },
          ]}
          onPress={() => setStateActiveRead(2)}>
          <Text
            style={{color: stateActiveRead === 2 ? 'white' : colorSoftGreen}}>
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
