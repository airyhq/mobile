import React, {ReactNode} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Contact, Message, Source} from '../../model';
import {sendMessage} from '../../api/Message';
import {getOutboundMapper} from '../../render/outbound';
import {OutboundMapper} from '../../render/outbound/mapper';
import ErrorIcon from '../../assets/images/icons/error.svg';
import {colorTextGray, colorAiryBlue} from '../../assets/colors';

type MessageInfoWrapperProps = {
  children: ReactNode;
  lastInGroup?: boolean;
  isChatPlugin: boolean;
  fromContact?: boolean;
  contact?: Contact;
  sentAt?: string;
  conversationId: string;
  message: Message;
  source: Source;
};

export const MessageInfoWrapper = (props: MessageInfoWrapperProps) => {
  const {
    sentAt,
    fromContact,
    children,
    isChatPlugin,
    conversationId,
    message,
    source,
  } = props;

  const isContact = isChatPlugin ? !fromContact : fromContact;
  const failedMessage = message.deliveryState === 'FAILED';
  const outboundMapper: OutboundMapper = getOutboundMapper(source);

  const retrySendingFailedMessage = () => {
    sendMessage(
      conversationId,
      outboundMapper.getTextPayload(message.content.text),
    );
  };

  const FailedMessageText = () => {
    return (
      <Text style={styles.failedMessageText}>
        Failed to send!{' '}
        <Text style={styles.retrySend} onPress={retrySendingFailedMessage}>
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
        {failedMessage && <ErrorIcon style={styles.failedMessage} />}
      </View>
      {sentAt && !failedMessage && <Text style={styles.time}>{sentAt}</Text>}
      {failedMessage && <FailedMessageText />}
    </View>
  );

  const ContactMessage = () => (
    <View style={styles.contact}>
      <View style={styles.contactContent}>
        <Text>
          <View>{children}</View>
        </Text>
      </View>
    </View>
  );

  return <>{isContact ? <ContactMessage /> : <MemberMessage />}</>;
};

const styles = StyleSheet.create({
  contact: {
    justifyContent: 'center',
  },
  contactContent: {
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
  failedMessage: {
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
