import React, {ReactNode} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Contact} from '../../model';
import {colorTextGray} from '../../assets/colors';

type MessageInfoWrapperProps = {
  children: ReactNode;
  lastInGroup?: boolean;
  isChatPlugin: boolean;
  fromContact?: boolean;
  contact?: Contact;
  sentAt?: string;
};

export const MessageInfoWrapper = (props: MessageInfoWrapperProps) => {
  const {sentAt, fromContact, children, isChatPlugin, lastInGroup} = props;

  const isContact = isChatPlugin ? !fromContact : fromContact;

  const MemberMessage = () => (
    <View style={styles.member}>
      <Text style={styles.memberContent}>
        <View>{children}</View>
      </Text>
      {lastInGroup && <Text style={styles.time}>{sentAt}</Text>}
    </View>
  );

  const ContactMessage = () => (
    <View style={styles.contact}>
      <Text style={styles.contactContent}>
        <View>{children}</View>
      </Text>
      {lastInGroup && <Text style={styles.time}>{sentAt}</Text>}
    </View>
  );

  return <>{isContact ? <ContactMessage /> : <MemberMessage />}</>;
};

const styles = StyleSheet.create({
  contact: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  contactContent: {
    overflow: 'hidden',
    maxWidth: '90%',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  member: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  memberContent: {
    overflow: 'hidden',
    maxWidth: '90%',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  time: {
    fontFamily: 'Lato',
    fontSize: 12,
    color: colorTextGray,
    marginLeft: 5,
    marginRight: 5,
  },
});
