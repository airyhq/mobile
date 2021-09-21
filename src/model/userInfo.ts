// import {Results} from 'realm';
// import {RealmDB} from '../storage/realm';

export const UserInfoSchema = {
  name: 'UserInfo',
  properties: {
    accessToken: 'string',
    name: 'string?',
    email: 'string?',
  },
};

export type UserInfo = {
  accessToken: string;
  name?: string;
  email?: string;
};

//commented out cause we are running into a "Require cycle: src/storage/realm.ts -> src/model/userInfo.ts -> src/storage/realm.ts"

// export const getUserInfo = (): UserInfo | undefined => {
//   const objects: Results<UserInfo> = RealmDB.getInstance()?.objects('UserInfo');
//   if (objects) return objects[0];
// };
