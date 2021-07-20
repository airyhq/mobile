import React, {useEffect, useRef} from 'react';
import {Link} from 'react-router-native';
import {View, Button, StyleSheet, SectionList, Pressable} from 'react-native';
import {HttpClient} from '@airyhq/http-client';
import {debounce} from 'lodash-es';
import {Conversation} from '../../../model/Conversation';
import IconChannel from '../../../components/IconChannel';
import {Avatar, SourceMessagePreview} from 'render';
import {formatTimeOfMessage} from '../../../services/format/date';
import {ReactComponent as Checkmark} from '../../../assets/images/icons/checkmark-circle.svg';
import {INBOX_CONVERSATIONS_ROUTE} from '../../../routes/routes';

type ConversationListItemProps = {
  conversation: Conversation;
  active: boolean;
};

const ConversationListItem = (props: ConversationListItemProps) => {
  const {conversation, active} = props;

  const participant = conversation.metadata.contact;
  const unread = conversation.metadata.unreadCount > 0;
  const currentConversationState = conversation.metadata.state || 'OPEN';

  const eventHandler = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const newState = currentConversationState === 'OPEN' ? 'CLOSED' : 'OPEN';
    conversationState(conversation.id, newState);
    event.preventDefault();
    event.stopPropagation();
  };

  const OpenStateButton = () => {
    return (
      <View style={styles.openStateButton}>
        <Button
          title="Set to closed"
          onPress={(event: any) => eventHandler(event)}
        />
      </View>
    );
  };

  const ClosedStateButton = () => {
    return (
      <View style={styles.closedStateButton}>
        <Button
          title="Set to open"
          onPress={(event: any) => eventHandler(event)}>
          <Checkmark />
        </Button>
      </View>
    );
  };

  const markAsRead = () => {
    if (active && unread) {
      readConversations(conversation.id);
    }
  };

  useEffect(() => {
    markAsRead();
  }, [active, conversation, currentConversationState]);

  return (
    <Pressable style={styles.clickableListItem} onPress={markAsRead}>
      <Link to={`${INBOX_CONVERSATIONS_ROUTE}/${conversation.id}`}>
        <View
          style={[
            active ? styles.containerListItemActive : styles.containerListItem,
            unread ? styles.unread : '',
          ]}>
          <View style={styles.profileImage}>
            <Avatar contact={participant} />
          </View>
          <View style={styles.contactDetails}>
            <View style={styles.topRow}>
              <View style={[styles.profileName, unread ? styles.unread : '']}>
                {participant && participant.displayName}
              </View>
              {currentConversationState === 'OPEN' ? (
                <OpenStateButton />
              ) : (
                <ClosedStateButton />
              )}
            </View>
            <View
              style={[styles.contactLastMessage, unread ? styles.unread : '']}>
              <SourceMessagePreview conversation={conversation} />
            </View>
            <View style={styles.bottomRow}>
              <View style={styles.source}>
                {conversation.channel && (
                  <IconChannel
                    channel={conversation.channel}
                    showAvatar
                    showName
                  />
                )}
              </View>
              <View style={styles.contactLastMessageDate}>
                {formatTimeOfMessage(conversation.lastMessage)}
              </View>
            </View>
          </View>
        </View>
      </Link>
    </Pressable>
  );
};

export default ConversationListItem;

const styles = StyleSheet.create({
  openStateButton: {},
  closedStateButton: {},
  clickableListItem: {},
  containerListItemActive: {},
  containerListItem: {},
  profileImage: {},
  unread: {},
  contactDetails: {},
  topRow: {},
  profileName: {},
  contactLastMessage: {},
  bottomRow: {},
  source: {},
  contactLastMessageDate: {},
});
