import React, {ReactNode} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Contact, Message, DeliveryState, Source} from '../../model';
import {resendFailedStateMessage} from '../../api/Message';
import {Contact, Message, Source, Conversation} from '../../model';
import {sendMessage} from '../../api/Message';
import {getOutboundMapper} from '../../render/outbound';
import {OutboundMapper} from '../../render/outbound/mapper';
import ErrorIcon from '../../assets/images/icons/error.svg';
import {colorTextGray, colorAiryBlue} from '../../assets/colors';
import {RealmDB} from '../../storage/realm';
import {api} from '../../api';

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

const realm = RealmDB.getInstance();

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
  const failedMessage = message.deliveryState === 'failed';
  const outboundMapper: OutboundMapper = getOutboundMapper(source);

  const retrySendingFailedMessage = () => {
    // const prevMessage:any = realm.objectForPrimaryKey<Message>(
    //   'Message',
    //   message.id,
    // );

    const messageToSend = outboundMapper.getTextPayload(message.content.text);

    const conversationMsgs = realm.objectForPrimaryKey<Conversation>(
      'Conversation',
      conversationId,
    ).messages;

    let prevMessage;

    conversationMsgs.forEach(msg => {
      if (msg.id === message.id) {
        prevMessage = msg;
      }
    });

    // console.log('prevMessage', prevMessage);

    api
      .sendMessages({
        conversationId,
        message: {
          text: 'Welcome!',
        },
      })
      .then((response: Message) => {
        console.log('response', response);
        realm.write(() => prevMessage.deliveryState = response.deliveryState);
      })
      .catch((error: Error) => {
        console.error('Error: ', error);
      });

    // const messageToSend = outboundMapper.getTextPayload(message.content.text);

    // const conversation = realm.objectForPrimaryKey<Conversation>(
    //   'Conversation',
    //   conversationId,
    // );

    // const prevMessage = conversation.messages.filter(
    //   msg => msg.id === message.id,
    // );
    // console.log('prevMessage', prevMessage);

    // realm.write(() => {
    //   realm.delete(prevMessage);
    // });

    // sendMessage(
    //   conversationId,
    //   messageToSend,
    // );
  };

  const FailedMessageText = () => {
    return (
      <Text style={styles.failedMessageText}>
        Failed to send!{' '}
        <Text
          style={styles.retrySend}
          onPress={() => resendFailedStateMessage(message.id)}>
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
