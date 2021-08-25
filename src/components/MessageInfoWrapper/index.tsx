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
  const {sentAt, fromContact, children, isChatPlugin} = props;

  const isContact = isChatPlugin ? !fromContact : fromContact;

  const MemberMessage = () => (
    <View style={styles.member}>
      <Text style={styles.memberContent}>{children}</Text>
      <Text style={styles.time}>{sentAt}</Text>
    </View>
  );

  const ContactMessage = () => (
    <>
      <View style={styles.contact}>
        <Text style={styles.contactContent}>{children}</Text>
      </View>
      <Text style={styles.time}>{sentAt}</Text>
    </>
  );

  return <>{isContact ? <ContactMessage /> : <MemberMessage />}</>;
};

const styles = StyleSheet.create({
  contact: {
    display: 'flex',
    flexDirection: 'row',
  },
  contactContent: {
    overflow: 'hidden',
    maxWidth: '100%',
    borderRadius: 12,
  },
  member: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  memberContent: {
    overflow: 'hidden',
    maxWidth: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
    borderRadius: 20,
  },
  time: {
    fontFamily: 'Lato',
    fontSize: 10,
    color: colorTextGray,
    marginTop: 5,
    marginLeft: 5,
  },
});
