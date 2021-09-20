import {sortBy} from 'lodash-es';
import {Message, parseToRealmMessage} from '../../model/Message';

export function mergeMessages(
  oldMessages: Message[],
  newMessages: Message[],
): Message[] {
  newMessages.forEach((message: Message) => {
    if (!oldMessages.some((item: Message) => item.id === message.id)) {
      oldMessages.push(parseToRealmMessage(message, message.source));
    }
  });

  return sortBy(oldMessages, message => message.sentAt);
}
