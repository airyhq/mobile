import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {formatTime, isSameDay} from '../../../services/dates';
import {formatDateOfMessage} from '../../../services/format/date';
import {MessageInfoWrapper} from '../../../components/MessageInfoWrapper';
import {SourceMessage} from '../../../render/SourceMessage';
import {colorBackgroundGray, colorTextGray} from '../../../assets/colors';
import {Message, Contact} from '../../../model';

type MessageProps = {
  message: Message;
  index: number;
  messages: Message[];
  source: string;
  contact: Contact;
};

const hasDateChanged = (prevMessage: Message, message: Message) => {
  if (prevMessage == null) {
    return true;
  }
  return !isSameDay(prevMessage.sentAt, message.sentAt);
};

export const MessageComponent = ({
  message,
  index,
  messages,
  source,
  contact,
}: MessageProps) => {
  const prevMessage = messages[index - 1];
  const nextMessage = messages[index + 1];

  const lastInGroup = prevMessage
    ? message.fromContact !== prevMessage.fromContact
    : true;

  const sentAt: any = lastInGroup ? formatTime(message.sentAt) : null;

  return (
    <View key={message.id} style={styles.message}>
      {hasDateChanged(nextMessage, message) && (
        <View key={`date-${message.id}`} style={styles.dateHeader}>
          <Text>{formatDateOfMessage(message)}</Text>
        </View>
      )}

      <MessageInfoWrapper
        fromContact={message.fromContact}
        lastInGroup={lastInGroup}
        contact={contact}
        sentAt={sentAt}
        isChatPlugin={false}>
        <SourceMessage
          source={source}
          message={message}
          contentType="message"
        />
      </MessageInfoWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  message: {
    paddingRight: 16,
    paddingLeft: 16,
  },
  dateHeader: {
    marginTop: 8,
    marginBottom: 8,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 4,
    backgroundColor: colorBackgroundGray,
    color: colorTextGray,
    alignSelf: 'center',
  },
});
