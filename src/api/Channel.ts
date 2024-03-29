import {api} from '../api';
import {Channel} from '../model/Channel';
import {RealmDB} from '../storage/realm';

const realm = RealmDB.getInstance();

export const listChannels = () => {
  api
    .listChannels()
    .then((response: Channel[]) => {
      realm.write(() => {
        for (const channel of response) {
          const isStored: Channel | undefined =
            realm.objectForPrimaryKey<Channel>('Channel', channel.id);

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
