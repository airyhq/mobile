import {Results} from 'realm';
import {getInfoNewConversation} from '../../api/Conversation';
import {Conversation} from '../../model/Conversation';
import {RealmDB} from '../../storage/realm';

export const getConversations = (): Conversation | undefined => {
  const objects: Results<Conversation> =
    RealmDB.getInstance()?.objects('Conversation');
  if (objects) {
    return objects[0];
  }
};

export const getAndOrFetchConversationById = (
  conversationId: string,
): Promise<Conversation> => {
  return new Promise((resolve, reject) => {
    const currentConversationData: (Conversation & Realm.Object) | undefined =
      RealmDB.getInstance().objectForPrimaryKey<Conversation>(
        'Conversation',
        conversationId,
      );
    if (currentConversationData) {
      return resolve(currentConversationData);
    }
    getInfoNewConversation(conversationId, 0)
      .then((conversation: Conversation) => {
        resolve(conversation);
      })
      .catch((error: Error) => {
        reject(error);
      });
  });
};
