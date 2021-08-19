import React, {ReactNode} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Avatar} from '../Avatar';
import {Contact} from '../../model';
import {colorTextGray} from '../../assets/colors';

type MessageInfoWrapperProps = {
  children: ReactNode;
  lastInGroup?: boolean;
  isChatPlugin: boolean;
  fromContact?: boolean;
  contact?: Contact;
  sentAt?: string;
  decoration?: ReactNode;
};

export const MessageInfoWrapper = (props: MessageInfoWrapperProps) => {
  const {sentAt, contact, fromContact, children, lastInGroup, isChatPlugin, decoration} = props;

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
        {sentAt && contact && (
          <View style={styles.avatar}>
            <Avatar contact={contact} />
          </View>
        )}
        <Text
          style={[styles.contactContent, lastInGroup === false && isChatPlugin === false ? {marginLeft: '48px'} : {}]}>
          {children}
        </Text>
        {decoration}
      </View>
      <Text style={styles.time}>{sentAt}</Text>
    </>
  );

  return <>{isContact ? <ContactMessage /> : <MemberMessage />}</>;
};

const styles = StyleSheet.create({
  contact: {
    alignItems: 'flex-start',
  },
  contactContent: {
    overflow: 'hidden',
    maxWidth: '100%',
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
    
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 8,
    marginBottom: 8,
    flexShrink: 0
  },
  time: {
    fontSize: 13,
    color: colorTextGray,
    marginTop: 5,
    paddingLeft: 50
  }
});

