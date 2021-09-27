import {HttpClientInstance} from '../InitializeAiryApi';
import {RealmDB} from '../storage/realm';

export const sendMessageAPI = (conversationId: string, message: any) => {
  HttpClientInstance.sendMessages({
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
