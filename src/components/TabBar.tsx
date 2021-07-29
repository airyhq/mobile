import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import ConversationList from '../views/inbox/ConversationList';
import Inbox from '../assets/images/icons/bubble_icon.svg';
import Settings from '../assets/images/icons/settings_icon.svg';
import {Link} from 'react-router-native';
import {INBOX_ROUTE} from '../routes/routes';
export const TabBar = (props:any) => {
  const [isActive, setIsActive] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.inbox}>
        <Pressable
          onPress={() => setIsActive(0)}
          style={{alignItems: 'center'}}>
          <Link to={INBOX_ROUTE} component={TouchableOpacity}>
            <View style={styles.icons}>
              <Inbox
                width={32}
                height={32}
                fill={isActive == 0 ? '#1578d4' : 'gray'}
              />
              <Text style={isActive == 0 ? styles.textActive : styles.text}>
                Inbox
              </Text>
            </View>
          </Link>
        </Pressable>
      </View>
      <View style={styles.settings}>
        <Pressable
          onPress={() => setIsActive(1)}
          style={{alignItems: 'center'}}>
            <View style={styles.icons}>
              <Settings
                width={32}
                height={32}
                fill={isActive == 1 ? '#1578d4' : 'gray'}
              />
              <Text style={isActive == 1 ? styles.textActive : styles.text}>
                Settings
              </Text>
            </View>
        </Pressable>
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
    position: 'absolute',
    bottom: 0, 
    left: 0, 
    right:0, 
    backgroundColor: 'white'
  },
  inbox: {
    display: 'flex',
    flex: 0.33,
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    marginTop: 20,
  },
  settings: {
    display: 'flex',
    flex: 0.33,
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: 'gray',
  },
  textActive: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1578d4',
  },
  icons: {
    alignItems: 'center',
  },
});
