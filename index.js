import React from 'react';
import {AppRegistry} from 'react-native';
import {connect, Provider} from 'react-redux';
import App from './src/App';
import {name as appName} from './app.json';
import {store} from './src/store';

AppComponent = connect()(App)

const AiryMobileApp = () => (
  <Provider store={store}>
    <AppComponent />
  </Provider>
)

AppRegistry.registerComponent(appName, () => AiryMobileApp);