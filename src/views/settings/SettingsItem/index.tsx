import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Linking, Alert} from 'react-native';
import {RealmDB} from '../../../storage/realm';
import LogoutIcon from '../../../assets/images/icons/logout.svg';
import PrivacyPolicy from '../../../assets/images/icons/privacyPolicy.svg';
import TermsAndService from '../../../assets/images/icons/termsAndServiceIcon.svg';
import Heart from '../../../assets/images/icons/heartIcon.svg';
import Mail from '../../../assets/images/icons/mailIcon.svg';
import {colorContrast, colorRedAlert} from '../../../assets/colors';

type SettingsItemProps = {
  title: string;
};

export const SettingsItem = (props: SettingsItemProps) => {
  const {title} = props;

  const logoutAlert = () => {
    const realm = RealmDB.getInstance();
    Alert.alert('Are you sure?', '', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () =>
          realm.write(() => {
            realm.deleteAll();
          }),
      },
    ]);
  };

  const selectedItem = (selectedItemTitle: string) => {
    switch (selectedItemTitle) {
      case 'Contact Airy':
        return Linking.openURL('mailto:support@airy.co?');
      case 'Rate Airy':
        return console.log('Rate Airy');
      case 'Terms of Service':
        return Linking.openURL('https://airy.co/terms-of-service');
      case 'Privacy Policy':
        return Linking.openURL('https://airy.co/privacy-policy');
      case 'Log Out':
        return logoutAlert();
    }
  };

  const ItemIcon = (itemIconTitle: string) => {
    switch (itemIconTitle) {
      case 'Account':
        return;
      case 'Contact Airy':
        return (
          <Mail
            height={24}
            width={24}
            fill={colorContrast}
            style={styles.icon}
          />
        );
      case 'Rate Airy':
        return (
          <Heart
            height={24}
            width={24}
            fill={colorRedAlert}
            style={styles.icon}
          />
        );
      case 'Terms of Service':
        return (
          <TermsAndService
            height={24}
            width={24}
            fill={colorContrast}
            style={styles.icon}
          />
        );
      case 'Privacy Policy':
        return (
          <PrivacyPolicy
            height={24}
            width={24}
            fill={colorContrast}
            style={styles.icon}
          />
        );
      case 'Log Out':
        return (
          <LogoutIcon
            height={24}
            width={24}
            fill={colorRedAlert}
            style={styles.icon}
          />
        );
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => selectedItem(title)}
        style={styles.itemContainer}>
        {ItemIcon(title)}
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    height: 35,
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 4,
  },
  icon: {
    marginRight: 8,
    marginLeft: 16,
  },
  text: {
    fontFamily: 'Lato',
    fontSize: 16,
  },
});
