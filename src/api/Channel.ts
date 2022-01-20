import {api} from '../api';
import {Channel} from '../model/Channel';
import {RealmDB} from '../storage/realm';

const realm = RealmDB.getInstance();

export const listChannels = () => {
  api
    .listChannels()
    .then((response: any) => {
      realm.write(() => {
        console.log('response CHANNEL', response);

        const allStored: any = realm.objects<Channel>('Channel');

        console.log('allStored', allStored);

        for (const channel of response) {
          const isStored: Channel | undefined =
            realm.objectForPrimaryKey<Channel>('Channel', channel.id);

          console.log('isStored', isStored);

          if (!isStored) {
            realm.create('Channel', channel);
          }
        }
      });
    })
    .catch((error: Error) => {
      console.error('LIST CHANNELS', error);
    });
};
