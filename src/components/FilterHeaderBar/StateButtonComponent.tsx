import React, {useState} from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {
  colorAiryBlue,
  colorContrast,
  colorRedAlert,
  colorSoftGreen,
} from '../../assets/colors';

export const StateButtonComponent = () => {
  const [stateActiveOpen, setStateActiveOpen] = useState(0);

  return (
    <View
      style={{
        marginBottom: 12,
      }}>
      <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
        <TouchableOpacity
          style={[
            stateActiveOpen === 0 ? styles.buttonActive : styles.buttonInactive,
            {
              flex: 1,
              height: 24,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: 24,
              borderBottomLeftRadius: 24,
            },
          ]}
          onPress={() => setStateActiveOpen(0)}>
          <Text
            style={{color: stateActiveOpen === 0 ? 'white' : colorContrast}}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            stateActiveOpen === 1 ? styles.buttonActive : styles.buttonInactive,
            {
              flex: 1,
              height: 24,
              justifyContent: 'center',
              alignItems: 'center',
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
            },
          ]}
          onPress={() => setStateActiveOpen(1)}>
          <Text
            style={{color: stateActiveOpen === 1 ? 'white' : colorRedAlert}}>
            Open
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            stateActiveOpen === 2 ? styles.buttonActive : styles.buttonInactive,
            {
              flex: 1,
              height: 24,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopRightRadius: 24,
              borderBottomRightRadius: 24,
            },
          ]}
          onPress={() => setStateActiveOpen(2)}>
          <Text
            style={{color: stateActiveOpen === 2 ? 'white' : colorSoftGreen}}>
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
