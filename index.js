import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import * as encoding from 'text-encoding';

AppRegistry.registerComponent(appName, () => App);
