import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
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
import ViberAvatar from '../assets/images/icons/viber_avatar.svg';
import BubbleIcon from '../assets/images/icons/bubble_icon.svg';
import {colorAiryBlue, colorTextGray} from '../assets/colors';
import {Source} from '../model/Channel';

type IconChannelProps = {
  source: string;
  sourceChannelId: string;
  metadataName: string;
  icon?: boolean;
  showAvatar?: boolean;
  showName?: boolean;
  text?: boolean;
};

const SOURCE_INFO = {
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
  viber: {
    text: 'Viber Account',
    icon: () => <ViberAvatar fill="#564E8E" />,
    avatar: () => <ViberAvatar fill="#564E8E" />,
  },
  chatplugin: {
    text: 'Airy Live Chat plugin',
    icon: () => <AiryIcon />,
    avatar: () => <AiryAvatar />,
  },
  unknown: {
    text: 'Unknown Source',
    icon: () => <BubbleIcon fill={colorAiryBlue} />,
    avatar: () => <BubbleIcon fill={colorAiryBlue} />,
  },
};

const IconChannel: React.FC<IconChannelProps> = ({
  source,
  metadataName,
  sourceChannelId,
  icon,
  showAvatar,
  showName,
  text,
}: IconChannelProps): JSX.Element => {
  const channelInfo = SOURCE_INFO[source] || SOURCE_INFO[Source.unknown];
  const fbFallback = SOURCE_INFO[Source.facebook];
  const isFromTwilioSource =
    source === Source.twilioSms || source === Source.twilioWhatsapp;

  const formatTwilioSource = (_source: string) => {
    if (_source.includes('whatsapp:')) {
      return _source.split('whatsapp:').pop();
    }
    return _source;
  };

  const ChannelName = () => {
    return (
      <Text numberOfLines={1} style={styles.text}>
        {metadataName ||
          (isFromTwilioSource ? formatTwilioSource(sourceChannelId) : source)}
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
        <View style={styles.avatar}>{channelInfo.avatar()}</View>
        <ChannelName />
      </View>
    );
  }

  if (icon && text) {
    return (
      <View style={styles.iconText}>
        {channelInfo.icon()}
        <Text numberOfLines={1} style={styles.text}>
          {channelInfo.text}
        </Text>
      </View>
    );
  }

  if (showAvatar && text) {
    return (
      <View style={styles.avatarText}>
        {channelInfo.avatar()}
        <Text numberOfLines={1} style={styles.text}>
          {channelInfo.text}
        </Text>
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

const styles = StyleSheet.create({
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 20,
    height: 20,
  },
  iconName: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 20,
    height: 20,
  },
  avatarText: {
    flexDirection: 'row',
    width: 20,
    height: 20,
    alignItems: 'center',
  },
  avatarName: {
    flexDirection: 'row',
    height: 20,
    alignItems: 'center',
  },
  text: {
    marginLeft: 3,
    fontSize: 13,
    color: colorTextGray,
    fontFamily: 'Lato',
    marginRight: 20,
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
