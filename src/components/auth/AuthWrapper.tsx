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
            //TOOD: This is a hack to get the id from the host, will be removed when we have a proper solution
            OneSignal.setExternalUserId(mapHostToUUID[orgName] || '9802e181-dedb-4f2e-a2d8-85ccf7a6ab92');
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

// TODO: This is a hack to get the id from the host, will be removed when we have a proper solution
const mapHostToUUID: { [host: string]: string } = {
  "allinsports": "01d47051-c5f6-4c56-bcb1-8c1ed0eb90df",
  "aws-observability": "ff292978-cf0b-4d3a-8e8a-fbac0835664a",
  "blaupunkt": "4a6c1021-cff1-4e28-b893-c58cb58fe5b3",
  "cert-manager": "d70c583c-935f-4729-bf2b-9ae3c5873a7f",
  "default": "6ff2eefe-addf-4f45-8b7c-cce3e71b69c5",
  "demo": "df03baf3-9836-449c-9ef2-2a06216ae186",
  "endy": "1e96e1ae-4341-4f6a-9722-2e68019261ce",
  "friedrichstadtpalast": "b4d64836-c4b2-4cf1-8460-66402d561fe4",
  "gourmetfleisch": "75796e2a-e3f2-43cb-aa1f-25d9ea6e79ce",
  "johnreed": "cdf0191d-a9ba-4523-96c5-636c3c7d5dc5",
  "justthetonic": "1add01a9-4484-4f51-ac47-c7018c9cf7ff",
  "kik": "8e5caa9d-7ae0-4d42-91cf-1215fdf3dd04",
  "komische-oper-berlin": "71b66edf-2571-4e1f-84bb-3b66f1e341b6",
  "konzerthaus-berlin": "ebd23e74-18d3-46a9-9a1d-5e5654ea7b39",
  "kube-node-lease": "43677142-3de5-46e3-8933-e33474f61092",
  "kube-public": "09d620c7-43ad-466a-b899-a6aedd2f24ab",
  "kube-system": "383f1b57-f0a0-4466-9608-d54d09be488b",
  "logs": "5291c8f3-9914-49b9-9142-06b9b2a5b53e",
  "lotuscrafts": "a86f5b3a-8668-4c72-8c89-349ed3cc5d66",
  "monitoring": "25e8aa77-7252-44cf-8119-0b2b65e6a327",
  "protyre": "205d19cb-86c3-4fa4-9e8b-203d4f260b70",
  "staatsoper-berlin": "4588f80a-29a0-4a73-9c87-30b53b56439a",
  "staging": "85b26431-f33a-43bb-bdf2-84b671f5b6af",
  "support": "a9324a47-c736-44c7-9312-6c2855f18ab7",
  "tedi": "4c4b12b8-d41d-4129-88c2-632e931966c9",
  "weinfreunde": "5370b2af-ebd0-44ad-8409-28cd4d98f664",
  "zooroyal": "19607e2b-d9f0-481d-9adb-705df8bebbce",
}