/* eslint-disable react/display-name */
import React from 'react';
import {Channel} from '../model/Channel';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

import FacebookIcon from '../assets/images/icons/facebook_rounded.svg';
import InstagramIcon from '../assets/images/icons/instagram.svg';
import GoogleIcon from '../assets/images/icons/google-messages.svg';
import SmsIcon from '../assets/images/icons/sms-icon.svg';
import WhatsappIcon from '../assets/images/icons/whatsapp-icon.svg';
import MessengerAvatar from '../assets/images/icons/messenger_avatar.svg';
import GoogleAvatar from '../assets/images/icons/google_avatar.svg';
import SmsAvatar from '../assets/images/icons/sms_avatar.svg';
import WhatsappAvatar from '../assets/images/icons/whatsapp_avatar.svg';
import AiryAvatar from '../assets/images/icons/airy_avatar.svg';
import AiryIcon from '../assets/images/icons/airy-icon.svg';

type IconChannelProps = {
  channel: Channel;
  icon?: boolean;
  showAvatar?: boolean;
  showName?: boolean;
  text?: boolean;
};

const PlaceholderChannelData: Channel = {
  id: 'id',
  source: 'facebook',
  metadata: {
    name: 'Retrieving Data...',
  },
  sourceChannelId: 'external_channel_id',
  connected: true,
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
    avatar: () => <InstagramIcon />,
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
  channel,
  icon,
  showAvatar,
  showName,
  text,
}: IconChannelProps): JSX.Element => {
  if (!channel) {
    channel = PlaceholderChannelData;
  }

  const channelInfo = SOURCE_INFO[channel.source];
  const fbFallback = SOURCE_INFO['facebook'];
  const isFromTwilioSource =
    channel.source === 'twilio.sms' || channel.source === 'twilio.whatsapp';

  const ChannelName = () => {
    return (
      <Text style={styles.text} numberOfLines={1}>
        {channel.metadata?.name ||
          (isFromTwilioSource ? channel.sourceChannelId : channel.source)}
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
