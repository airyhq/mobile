import {useTheme} from '@react-navigation/native';
import React from 'react';
import {SectionList, Text, StyleSheet, View} from 'react-native';
import {SettingsItem} from './SettingsItem';

const DATA = [
  {
    title: 'Feedback & Support',
    data: ['Contact Airy', 'Rate Airy'],
  },
  {
    title: 'Information',
    data: ['Terms of Service', 'Privacy Policy'],
  },
  {
    title: 'Manage',
    data: ['Log Out'],
  },
];

const SettingsView = () => {
  const {colors} = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <SectionList
        scrollEnabled={true}
        stickySectionHeadersEnabled={true}
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => <SettingsItem title={item} />}
        renderSectionHeader={({section: {title}}) => (
          <Text
            style={[
              styles.header,
              {color: colors.text, backgroundColor: colors.background},
            ]}>
            {title}
          </Text>
        )}
      />
    </View>
  );
};

export default SettingsView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontFamily: 'Lato',
    fontWeight: 'bold',
    fontSize: 20,
    padding: 24,
  },
});
