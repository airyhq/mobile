import React, {useCallback, useEffect, useState} from 'react';
import LottieView from 'lottie-react-native';
import {RealmDB} from '../../storage/realm';

import {Results, UpdateMode} from 'realm';
import {UserInfo} from '../../model/userInfo';
import {HttpClient} from '@airyhq/http-client';
import {Login} from './Login';
import CookieManager from '@react-native-cookies/cookies';
import {View} from 'react-native';
import OneSignal from 'react-native-onesignal';

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
  const [loading, setLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    const realm = RealmDB.getInstance();
    realm.write(() => {
      realm.deleteAll();
    });
  }, []);

  const refreshUser = useCallback(
    async (id, orgName, host, token) => {
      // Only refresh if the instance connection changed
      if (
        user?.id === id &&
        user?.orgName === orgName &&
        user?.host === host &&
        user?.token === token
      ) {
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
            id,
            token,
            host,
            orgName,
            name: userProfile.name,
            avatarUrl: userProfile.avatarUrl,
          };
          const realm = RealmDB.getInstance();
          realm.write(() => {
            realm.create('UserInfo', nextUser, UpdateMode.Modified);
          });

          if (orgName) {
            OneSignal.setExternalUserId(orgName);
            OneSignal.disablePush(false);
          }
          setUser(nextUser);
          setIsAuthenticated(true);
          setLoading(false);
        })
        .catch(error => {
          logout();
          // TODO The instance is likely not available and this should be displayed
          console.error(error);
        });
    },
    [user, logout],
  );

  const onUserChange = useCallback(
    (users: any) => {
      if (users.length > 0) {
        const userChanged = users[users.length - 1];
        const {id, orgName, host, token} = userChanged;
        if (id && host && orgName && token) {
          refreshUser(id, orgName, host, token);
        }
      } else {
        setLoading(false);
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

  if (loading) {
    return (
      <View
        style={{
          height: '100%',
          width: '100%',
        }}>
        <LottieView
          source={require('../../assets/animations/loading.json')}
          autoPlay
          loop
        />
      </View>
    );
  }

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