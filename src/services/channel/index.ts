import {api} from '../../api';
import {Conversation} from '../../model/Conversation';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {hapticFeedbackOptions} from '../../assets/hapticFeedback';

export const changeConversationState = (
  currentConversationState: string,
  conversationId: string,
  realm: Realm,
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
