import 'react-native-gesture-handler';
import React from 'react';
import {TabBar} from './components/TabBar';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {WebSocket} from './components/Websocket';
import {AuthWrapper} from './components/auth/AuthWrapper';
import {StatusBar} from 'react-native';

export const navigationRef = React.createRef<NavigationContainerRef>();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer ref={navigationRef}>
        <AuthWrapper>
          <WebSocket>
            <TabBar />
          </WebSocket>
        </AuthWrapper>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
