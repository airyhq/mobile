import {api} from '../api';
import {Conversation} from '../model/Conversation';
import {RealmDB} from '../storage/realm';

const realm = RealmDB.getInstance();

export const changeContactDisplayName = (
  conversationId: string,
  displayName: string,
) => {
  api
    .updateContact({
      conversationId: conversationId,
      displayName: displayName,
    })
    .then(() => {
      realm.write(() => {
        const changedConversationDisplayName: Conversation | undefined =
          realm.objectForPrimaryKey('Conversation', conversationId);

        if (changedConversationDisplayName?.metadata?.contact.displayName) {
          changedConversationDisplayName.metadata.contact.displayName =
            displayName;
        }
      });
    })
    .catch((error: Error) => {
      console.error(error);
    });
};
