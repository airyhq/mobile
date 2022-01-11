import 'react-native-gesture-handler';
import React from 'react';
import {TabBar} from './components/TabBar';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {WebSocket} from './components/Websocket';
import {AuthWrapper} from './components/auth/AuthWrapper';

const App = () => (
  <SafeAreaProvider>
    <NavigationContainer>
      <AuthWrapper>
        <WebSocket>
          <TabBar />
        </WebSocket>
      </AuthWrapper>
    </NavigationContainer>
  </SafeAreaProvider>
);

export default App;
