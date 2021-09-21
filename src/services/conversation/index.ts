import {Results} from 'realm';
import {Conversation} from '../../model/Conversation';
import {RealmDB} from '../../storage/realm';

export const getConversations = (): Conversation | undefined => {
  const objects: Results<Conversation> =
    RealmDB.getInstance()?.objects('Conversation');
  if (objects) {
    return objects[0];
  }
};
