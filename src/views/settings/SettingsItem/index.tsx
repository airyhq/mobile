import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Linking,
  Alert,
  Switch,
  View,
  Platform,
} from 'react-native';
import LogoutIcon from '../../../assets/images/icons/logout.svg';
import PrivacyPolicy from '../../../assets/images/icons/privacyPolicy.svg';
import TermsAndService from '../../../assets/images/icons/termsAndServiceIcon.svg';
import Heart from '../../../assets/images/icons/heartIcon.svg';
import Mail from '../../../assets/images/icons/mailIcon.svg';
import Moon from '../../../assets/images/icons/moon.svg';
import {colorRedAlert} from '../../../assets/colors';
import {AuthContext} from '../../../components/auth/AuthWrapper';
import OneSignal from 'react-native-onesignal';
import {useTheme} from '@react-navigation/native';
import {useContext} from 'react';
import {RealmDB} from '../../../storage/realm';
import {DarkMode} from '../../../model/DarkMode';

type SettingsItemProps = {
  title: string;
};

export const SettingsItem = (props: SettingsItemProps) => {
  const {title} = props;
  const {colors} = useTheme();
  const contextAuth = useContext(AuthContext);
  const realm = RealmDB.getInstance();
  const DarkMode = realm.objects<DarkMode>('DarkMode')[0];
  const [switchOn, setSwitchOn] = useState(DarkMode.isDarkModeOn);

  const logoutAlert = () => {
    Alert.alert('Are you sure?', '', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          OneSignal.removeExternalUserId();
          OneSignal.disablePush(true);
          contextAuth.logout();
        },
      },
    ]);
  };

  const selectedItem = (selectedItemTitle: string) => {
    switch (selectedItemTitle) {
      case 'Contact Airy':
        return Linking.openURL('mailto:support@airy.co?');
      case 'Rate Airy':
        return Platform.OS === 'ios'
          ? Linking.openURL(
              'https://apps.apple.com/us/app/airy-mobile/id1591428862',
            )
          : Linking.openURL(
              'https://play.google.com/store/apps/details?id=com.airycloud.mobile',
            );
      case 'Terms of Service':
        return Linking.openURL('https://airy.co/terms-of-service');
      case 'Privacy Policy':
        return Linking.openURL('https://airy.co/privacy-policy');
      case 'Dark Mode':
        return 'abc';
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
          <Mail height={24} width={24} fill={colors.text} style={styles.icon} />
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
            color={colors.text}
            style={styles.icon}
          />
        );
      case 'Privacy Policy':
        return (
          <PrivacyPolicy
            height={24}
            width={24}
            fill={colors.text}
            style={styles.icon}
          />
        );
      case 'Dark Mode':
        return (
          <Moon height={24} width={24} color="orange" style={styles.icon} />
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

  const switchAction = () => {
    realm.write(() => {
      DarkMode.isDarkModeOn === true
        ? (DarkMode.isDarkModeOn = false)
        : (DarkMode.isDarkModeOn = true);
    });
    setSwitchOn(DarkMode.isDarkModeOn);
  };

  return (
    <TouchableOpacity
      onPress={() => selectedItem(title)}
      disabled={title === 'Dark Mode'}
      style={[styles.itemContainer, {backgroundColor: colors.background}]}>
      <View style={{flexDirection: 'row'}}>
        {ItemIcon(title)}
        <Text style={[styles.text, {color: colors.text}]}>{title}</Text>
      </View>
      {title === 'Dark Mode' && (
        <Switch onChange={switchAction} value={switchOn} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    height: 35,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 16,
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
