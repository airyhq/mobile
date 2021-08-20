import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {formatTime, isSameDay} from '../../../services/dates';
import {formatDateOfMessage} from '../../../services/format/date';
import {MessageInfoWrapper} from '../../../components/MessageInfoWrapper';
import {SourceMessage} from '../../../render/SourceMessage';
import {colorBackgroundGray, colorTextGray} from '../../../assets/colors';
import { Message } from '../../../model/Message';

type MessageProps = {
    message: any, 
    index: number, 
    messages: any,
    source: any, 
    contact: any
}

const hasDateChanged = (prevMessage: Message, message: Message) => {
  if (prevMessage == null) {
    return true;
  }

  return !isSameDay(prevMessage.sentAt, message.sentAt);
};


export const MessageComponent = ({message, index, messages, source, contact}: MessageProps) => {

    const prevMessage = messages[index - 1];
    const nextMessage = messages[index + 1];

    const lastInGroup = nextMessage
      ? message.fromContact !== nextMessage.fromContact
      : true;

    const sentAt: any = lastInGroup ? formatTime(message.sentAt) : null;

    return(
          <View key={message.id} style={styles.messageList}>
            {hasDateChanged(prevMessage, message) && (
              <View key={`date-${message.id}`} style={styles.dateHeader}>
                <Text>{formatDateOfMessage(message)}</Text>
              </View>
            )}
            <MessageInfoWrapper
              fromContact={message.fromContact}
              contact={contact}
              sentAt={sentAt}
              lastInGroup={lastInGroup}
              isChatPlugin={false}>
              <SourceMessage
                source={source}
                message={message}
                contentType="message"
              />
            </MessageInfoWrapper>
          </View>
        );
            }


const styles = StyleSheet.create({
    messageList: {
      marginRight: 5,
    },
    dateHeader: {
      margin: 8,
      marginBottom: 8,
      left: '50%',
      marginLeft: -25,
      paddingTop: 4,
      paddingBottom: 8,
      paddingRight: 4,
      paddingLeft: 4,
      borderRadius: 4,
      backgroundColor: colorBackgroundGray,
      color: colorTextGray,
      width: 72,
      textAlign: 'center',
    },
  });