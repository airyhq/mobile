import React, {ReactNode} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Contact, DeliveryState} from '../../model';
import {resendFailedStateMessage} from '../../api/Message';
import ErrorIcon from '../../assets/images/icons/error.svg';
import {colorTextGray, colorAiryBlue, colorRedAlert} from '../../assets/colors';

type MessageInfoWrapperProps = {
  children: ReactNode;
  lastInGroup?: boolean;
  isChatPlugin: boolean;
  fromContact?: boolean;
  contact?: Contact;
  sentAt?: string;
  deliveryStateMessage: DeliveryState;
  messageId: string;
};

export const MessageInfoWrapper = (props: MessageInfoWrapperProps) => {
  const {
    sentAt,
    fromContact,
    children,
    isChatPlugin,
    deliveryStateMessage,
    messageId,
  } = props;

  const isContact = isChatPlugin ? !fromContact : fromContact;
  const failedMessage = deliveryStateMessage === DeliveryState.failed;

  const FailedMessageText = () => {
    return (
      <Text style={[styles.failedMessageText]}>
        Failed to send!{' '}
        <Text
          style={styles.retrySend}
          onPress={() => resendFailedStateMessage(messageId)}>
          Retry
        </Text>
      </Text>
    );
  };

  const MemberMessage = () => (
    <View style={styles.member}>
      <View style={styles.memberContent}>
        <Text>
          <View>{children}</View>
        </Text>
        {failedMessage && (
          <ErrorIcon style={styles.failedMessageIcon} fill={colorRedAlert} />
        )}
      </View>
      {sentAt && !failedMessage && <Text style={styles.time}>{sentAt}</Text>}
      {failedMessage && <FailedMessageText />}
    </View>
  );

  const ContactMessage = () => (
    <View style={styles.contact}>
      <Text style={styles.contactContent}>
        <View>{children}</View>
      </Text>
      {sentAt && <Text style={styles.time}>{sentAt}</Text>}
    </View>
  );

  return <>{isContact ? <ContactMessage /> : <MemberMessage />}</>;
};

const styles = StyleSheet.create({
  contact: {
    justifyContent: 'center',
  },
  contactContent: {
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
  },
  memberMessage: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  member: {
    alignItems: 'flex-end',
  },
  memberContent: {
    overflow: 'hidden',
    maxWidth: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  time: {
    fontFamily: 'Lato',
    fontSize: 12,
    color: colorTextGray,
    marginLeft: 5,
    marginRight: 5,
  },
  failedMessageIcon: {
    marginLeft: 6,
  },
  failedMessageText: {
    color: colorTextGray,
    fontFamily: 'Lato',
    fontSize: 13,
  },
  retrySend: {
    color: colorAiryBlue,
  },
});
