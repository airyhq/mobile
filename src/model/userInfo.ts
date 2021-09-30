export const UserInfoSchema = {
  name: 'UserInfo',
  properties: {
    token: 'string',
    host: 'string',
    name: 'string?',
    avatarUrl: 'string?',
  },
  primaryKey: 'host',
};

export type UserInfo = {
  token: string;
  host: string;
  name?: string;
  avatarUrl?: string;
};
