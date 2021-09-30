import {RealmDB} from '../storage/realm';
import {api} from '../api';

export const sendMessage = (conversationId: string, message: any) => {
  api
    .sendMessages({
      conversationId,
      message,
    })
    .then((response: any) => {
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
      console.log('Error: ', error);
    });
};
