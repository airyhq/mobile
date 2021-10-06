import {HttpClientInstance} from '../../InitializeAiryApi';
import {Channel} from '../../model/Channel';
import {RealmDB} from '../../storage/realm';

const realm = RealmDB.getInstance();

export const listChannels = () => {
  HttpClientInstance.listChannels()
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
