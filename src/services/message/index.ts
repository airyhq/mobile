import {sortBy} from 'lodash-es';
import {Conversation} from '../../model/Conversation';
import {Message, parseToRealmMessage} from '../../model/Message';
import {RealmDB} from '../../storage/realm';

const realm = RealmDB.getInstance();

export const addMessageToConversation = (
  conversationId: string,
  message: Message,
) => {
  realm.write(() => {
    const currentConversation: Conversation | undefined =
      realm.objectForPrimaryKey<Conversation>('Conversation', conversationId);

      const editmessage = {...message, deliveryState: 'failed'}

      //console.log('editMessage', editmessage);

    if (currentConversation) {
      currentConversation.lastMessage = parseToRealmMessage(
        editmessage,
        currentConversation.channel.source,
      );

      if (currentConversation && currentConversation.messages) {
        currentConversation.messages = mergeMessages(
          currentConversation.messages,
          [editmessage],
        );
      }
    }
  });
};

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

export const decodeURIComponentMessage = (
  messageContent: string,
  contentStart: string,
  contentEnd: string,
) => {
  const enCodedMessageStartIndex = messageContent.search(contentStart);
  const enCodedMessageStartLength = contentStart.length;

  const enCodedMessageEndIndex = messageContent.search(contentEnd);

  const enCodedMessage = messageContent.substring(
    enCodedMessageStartIndex + enCodedMessageStartLength,
    enCodedMessageEndIndex,
  );
  const formattedEnCodedMessage = enCodedMessage.split('+').join(' ');
  const decodedMessage = decodeURIComponent(formattedEnCodedMessage);

  return decodedMessage;
};
