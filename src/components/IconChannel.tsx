/* eslint-disable react/display-name */
import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import FacebookIcon from '../assets/images/icons/facebook_rounded.svg';
import MessengerAvatar from '../assets/images/icons/messenger_avatar.svg';
import GoogleIcon from '../assets/images/icons/google-messages.svg';
import GoogleAvatar from '../assets/images/icons/google_avatar.svg';
import SmsIcon from '../assets/images/icons/sms-icon.svg';
import SmsAvatar from '../assets/images/icons/sms_avatar.svg';
import WhatsappIcon from '../assets/images/icons/whatsapp-icon.svg';
import WhatsappAvatar from '../assets/images/icons/whatsapp_avatar.svg';
import AiryIcon from '../assets/images/icons/airy-icon.svg';
import AiryAvatar from '../assets/images/icons/airy_avatar.svg';
import InstagramIcon from '../assets/images/icons/instagram.svg';
import InstagramAvatar from '../assets/images/icons/instagram_avatar.svg';
import {colorTextGray} from '../assets/colors';

type IconChannelProps = {
  source: string;
  sourceChannelId: string;
  icon?: boolean;
  showAvatar?: boolean;
  showName?: boolean;
  text?: boolean;
};

const SOURCE_INFO: any = {
  facebook: {
    text: 'Facebook page',
    icon: () => <FacebookIcon />,
    avatar: () => <MessengerAvatar />,
  },
  instagram: {
    text: 'Instagram Account',
    icon: () => <InstagramIcon />,
    avatar: () => <InstagramAvatar />,
  },
  google: {
    text: 'Google page',
    icon: () => <GoogleIcon />,
    avatar: () => <GoogleAvatar />,
  },
  'twilio.sms': {
    text: 'SMS phone number',
    icon: () => <SmsIcon />,
    avatar: () => <SmsAvatar />,
  },
  'twilio.whatsapp': {
    text: 'WhatsApp number',
    icon: () => <WhatsappIcon />,
    avatar: () => <WhatsappAvatar />,
  },
  chatplugin: {
    text: 'Airy Live Chat plugin',
    icon: () => <AiryIcon />,
    avatar: () => <AiryAvatar />,
  },
};

const IconChannel: React.FC<IconChannelProps> = ({
  source,
  sourceChannelId,
  icon,
  showAvatar,
  showName,
  text,
}: IconChannelProps): JSX.Element => {
  const channelInfo = SOURCE_INFO[source];
  const fbFallback = SOURCE_INFO['facebook'];
  const isFromTwilioSource =
    source === 'twilio.sms' || source === 'twilio.whatsapp';

  const ChannelName = () => {
    return (
      <Text style={styles.text} numberOfLines={1}>
        {sourceChannelId || (isFromTwilioSource ? sourceChannelId : source)}
      </Text>
    );
  };

  if (icon && showName) {
    return (
      <View style={styles.iconName}>
        {channelInfo.icon()}
        <ChannelName />
      </View>
    );
  }

  if (showAvatar && showName) {
    return (
      <View style={styles.avatarName}>
        {channelInfo.avatar()}
        <ChannelName />
      </View>
    );
  }

  if (icon && text) {
    return (
      <View style={styles.iconText}>
        {channelInfo.icon()}
        <Text style={styles.text}>{channelInfo.text}</Text>
      </View>
    );
  }

  if (showAvatar && text) {
    return (
      <View style={styles.avatarText}>
        {channelInfo.avatar()}
        <Text style={styles.text}>{channelInfo.text}</Text>
      </View>
    );
  }

  if (icon) {
    return <View style={styles.icon}>{channelInfo.icon()}</View>;
  }

  if (showAvatar) {
    return <View style={styles.avatar}>{channelInfo.avatar()}</View>;
  }

  return (
    <>
      {' '}
      {fbFallback.icon()} {fbFallback.text}{' '}
    </>
  );
};

export default IconChannel;

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  iconText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 20,
    height: 20,
  },
  iconName: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 20,
    height: 20,
  },
  avatarText: {
    display: 'flex',
    flexDirection: 'row',
    width: 20,
    height: 20,
    alignItems: 'center',
  },
  avatarName: {
    display: 'flex',
    flexDirection: 'row',
    width: 20,
    height: 20,
    alignItems: 'center',
  },
  text: {
    width: width * 0.5,
    marginLeft: 3,
    fontSize: 13,
    color: colorTextGray,
    fontFamily: 'Lato',
  },
  icon: {
    width: 20,
    height: 20,
  },
  avatar: {
    width: 20,
    height: 20,
  },
});
