import {RealmDB} from '../storage/realm';
import {api} from '../api';
import {Conversation, Message} from '../Model';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {hapticFeedbackOptions} from '../services/HapticFeedback';

const realm = RealmDB.getInstance();

export const sendMessage = (conversationId: string, message: any) => {
  api
    .sendMessages({
      conversationId,
      message,
    })
    .then((response: Message) => {
      const realm = RealmDB.getInstance();
      realm.write(() => {
        realm.create('Message', {
          id: response.id,
          content: {text: response.content.text},
          deliveryState: response.deliveryState,
          fromContact: response.fromContact,
          sentAt: response.sentAt,
          metadata: response.metadata,
        });
      });
    })
    .catch((error: Error) => {
      console.error('Error: ', error);
    });
};

export const changeConversationState = (
  currentConversationState: string,
  conversationId: string,
  setState?: (newState: string) => void,
) => {
  const newState = currentConversationState === 'OPEN' ? 'CLOSED' : 'OPEN';
  api
    .setStateConversation({
      conversationId: conversationId,
      state: newState,
    })
    .then(() => {
      realm.write(() => {
        const changedConversation: Conversation | undefined =
          realm.objectForPrimaryKey('Conversation', conversationId);

        if (changedConversation?.metadata?.state) {
          changedConversation.metadata.state = newState;
        }
      });
    });
  setState && setState(newState);
  ReactNativeHapticFeedback.trigger('impactHeavy', hapticFeedbackOptions);
};
