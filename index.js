/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import App from './App';
// @ts-ignore
import { name as appName } from './app.json';

LogBox.ignoreLogs(['Require cycle:']);

AppRegistry.registerComponent(appName, () => App);
