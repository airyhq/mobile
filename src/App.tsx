import 'react-native-gesture-handler';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {TabBar} from './components/TabBar';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {WebSocket} from './components/Websocket';
import {AuthWrapper} from './components/auth/AuthWrapper';
import {StatusBar, useColorScheme} from 'react-native';
import {DarkTheme, LightTheme} from './assets/colors';
import {RealmDB} from './storage/realm';
import {Settings} from './model/Settings';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['EventEmitter.removeListener']);

export const navigationRef = React.createRef<NavigationContainerRef>();

export default function App() {
  const colorScheme = useColorScheme();
  const systemDarkMode = colorScheme === 'dark' ? true : false;
  const realm = RealmDB.getInstance();
  const settingsObject = realm.objects<Settings>('Settings')[0];
  const [isDarkMode, setIsDarkMode] = useState(systemDarkMode);

  const createSettings = () => {
    !settingsObject &&
      realm.write(() => {
        realm.create('Settings', {
          isDarkModeOn: systemDarkMode,
        });
      });
    return realm.objects<Settings>('Settings')[0];
  };

  const addListenerSettings = async () => {
    const darkModeChange = changes => {
      setIsDarkMode(changes.isDarkModeOn);
    };

    const settings = await createSettings();

    try {
      settings.addListener(darkModeChange);
    } catch (error) {
      console.error(error);
    }
    return () => {
      settings.removeListener(darkModeChange);
    };
  };

  useEffect(() => {
    addListenerSettings();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer
        ref={navigationRef}
        theme={isDarkMode ? DarkTheme : LightTheme}>
        <AuthWrapper>
          <WebSocket>
            <TabBar />
          </WebSocket>
        </AuthWrapper>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
