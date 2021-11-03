import {api} from '../../api';
import {Channel} from '../../model/Channel';
import {RealmDB} from '../../storage/realm';
import {Conversation} from '../../model/Conversation';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {hapticFeedbackOptions} from '../../services/HapticFeedback';

const realm = RealmDB.getInstance();

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

export const listChannels = () => {
  api
    .listChannels()
    .then((response: any) => {
      realm.write(() => {
        for (const channel of response) {
          const isStored: Channel | undefined =
            realm.objectForPrimaryKey<Channel>(
              'Channel',
              channel.sourceChannelId,
            );

          if (isStored) {
            realm.delete(isStored);
          }

          realm.create('Channel', channel);
        }
      });
    })
    .catch((error: Error) => {
      console.error(error);
    });
};
