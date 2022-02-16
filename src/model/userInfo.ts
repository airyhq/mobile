export const UserInfoSchema = {
  name: 'UserInfo',
  properties: {
    id: 'string',
    token: 'string',
    host: 'string',
    orgName: 'string',
    name: 'string?',
    avatarUrl: 'string?',
  },
  primaryKey: 'host',
};

export type UserInfo = {
  id: string;
  token: string;
  host: string;
  orgName: string;
  name?: string;
  avatarUrl?: string;
};
