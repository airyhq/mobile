import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

// /!/ removing this import causes errors
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as encoding from 'text-encoding';

AppRegistry.registerComponent(appName, () => App);
