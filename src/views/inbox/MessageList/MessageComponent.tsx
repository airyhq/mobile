import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {formatTime} from '../../../services/dates';
import {formatDateOfMessage} from '../../../services/format/date';
import {MessageInfoWrapper} from '../../../components/MessageInfoWrapper';
import {SourceMessage} from '../../../render/SourceMessage';
import {colorBackgroundGray, colorTextGray} from '../../../assets/colors';
import {Message, Contact, Source} from '../../../model';

type MessageProps = {
  message: Message;
  source: Source;
  contact: Contact;
  isLastInGroup: boolean;
  dateChanged: boolean;
};

export const MessageComponent = ({
  message,
  source,
  contact,
  isLastInGroup,
  dateChanged,
}: MessageProps) => {
  const sentAt: string | undefined = isLastInGroup
    ? formatTime(message.sentAt)
    : null;

  return (
    <View key={message.id} style={styles.message}>
      {dateChanged && (
        <View key={message.id} style={styles.dateHeader}>
          <Text style={styles.dateHeaderText}>
            {formatDateOfMessage(message)}
          </Text>
        </View>
      )}

      <MessageInfoWrapper
        fromContact={message.fromContact}
        lastInGroup={isLastInGroup}
        contact={contact}
        sentAt={sentAt}
        isChatPlugin={false}
        message={message}>
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
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 6,
    paddingRight: 6,
    borderRadius: 4,
    backgroundColor: colorBackgroundGray,
    color: colorTextGray,
    alignSelf: 'center',
  },
  dateHeaderText: {
    fontFamily: 'Lato',
    fontSize: 16,
  },
});
