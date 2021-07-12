import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App/src/App';
import {name as appName} from './App.json';
import {connect} from 'react-redux';
import {Provider} from 'react-redux';
import {store} from './App/src/store';


AppComponent = connect()(App)

const AiryMobileApp = () => (
  <Provider store={store}>
    <AppComponent />
  </Provider>
)


AppRegistry.registerComponent(appName, () => AiryMobileApp);
