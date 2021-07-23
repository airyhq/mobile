import React from 'react';
import {Button, StyleSheet, View} from 'react-native';

export const TabBar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.inbox}>
        <View style={{width: 24, height: 24, backgroundColor: 'black'}} />
        <Button title="Inbox" onPress={() => console.log('Inbox')}></Button>
      </View>
      <View style={styles.contacts}>
        <View style={{width: 24, height: 24, backgroundColor: 'black'}} />
        <Button title="Contacts" onPress={() => console.log('Contacts')}></Button>
      </View>
      <View style={styles.settings}>
        <View style={{width: 24, height: 24, backgroundColor: 'black'}} />
        <Button title="Settings" onPress={() => console.log('Settings')}></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '9%',
    borderTopColor: 'gray',
    borderTopWidth: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
  },
  inbox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    marginTop: 20
  },
  contacts: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center'
  },
  settings: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center'
  },
});
