import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
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
import {DarkMode} from './model/DarkMode';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['EventEmitter.removeListener']);

export const navigationRef = React.createRef<NavigationContainerRef>();

export default function App() {
  const colorScheme = useColorScheme();
  const systemDarkMode = colorScheme === 'dark' ? true : false;
  const realm = RealmDB.getInstance();
  const darkMode = realm.objects<DarkMode>('DarkMode')[0];
  const [isDarkMode, setIsDarkMode] = useState(systemDarkMode);

  !darkMode &&
    realm.write(() => {
      realm.create('DarkMode', {
        isDarkModeOn: systemDarkMode,
      });
    });

  useEffect(() => {
    const darkModeChange = changes => {
      setIsDarkMode(changes.isDarkModeOn);
    };
    try {
      darkMode.addListener(darkModeChange);
    } catch (error) {
      console.error(error);
    }
    return () => {
      darkMode && darkMode.removeListener(darkModeChange);
    };
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
