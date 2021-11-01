import React, {useCallback, useEffect, useState} from 'react';
import {RealmDB} from '../../storage/realm';

import {Results} from 'realm';
import {UserInfo} from '../../model/userInfo';
import {HttpClient} from '@airyhq/http-client';
import {Login} from './Login';
import CookieManager from '@react-native-cookies/cookies';

export let api = new HttpClient();

export interface AuthContext {
  isAuthenticated: boolean;
  user?: UserInfo;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContext>({
  isAuthenticated: false,
  user: null,
  logout: () => {
    RealmDB.getInstance().deleteAll();
  },
});

export const AuthWrapper = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo>(null);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    const realm = RealmDB.getInstance();
    realm.write(() => {
      realm.deleteAll();
    });
  }, []);

  const refreshUser = useCallback(
    async (host, token) => {
      // Only refresh if the instance connection changed
      if (user?.host === host || user?.token === token) {
        return;
      }

      await CookieManager.clearAll();
      await CookieManager.set(host, {
        name: 'airy_auth_token',
        value: token,
        path: '/',
        domain: host.split('//')[1],
      });

      api = new HttpClient(host, error => {
        console.error('Authentication error. Logging user out.', error);
        logout();
      });

      api
        .getConfig()
        .then(({userProfile}) => {
          const nextUser = {
            token,
            host,
            name: userProfile.name,
            avatarUrl: userProfile.avatarUrl,
          };
          const realm = RealmDB.getInstance();
          realm.write(() => {
            realm.create('UserInfo', nextUser, 'modified');
          });
          setUser(nextUser);
          setIsAuthenticated(true);
        })
        .catch(error => error);
    },
    [user, logout],
  );

  const onUserChange = useCallback(
    (users: any) => {
      if (users.length > 0) {
        const userChanged = users[users.length - 1];
        const host = userChanged.host;
        const token = userChanged.token;
        if (host && token) {
          refreshUser(host, token);
        }
      }
    },
    [refreshUser],
  );

  useEffect(() => {
    RealmDB.getInstance().objects('UserInfo').addListener(onUserChange);
  }, [onUserChange]);

  useEffect(() => {
    const users: Results<UserInfo> = RealmDB.getInstance()?.objects('UserInfo');
    onUserChange(users);
  }, [onUserChange]);

  return isAuthenticated ? (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  ) : (
    <Login />
  );
};
