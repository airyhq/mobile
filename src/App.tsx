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

export const navigationRef = React.createRef<NavigationContainerRef>();

export default function App() {
  return (
    <SafeAreaProvider>
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
