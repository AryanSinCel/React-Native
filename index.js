/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { enableScreens } from 'react-native-screens';
import App from './App';
import { name as appName } from './app.json';
// index.js
import TrackPlayer from "react-native-track-player";
import { setupPlayer } from "./musicPlayer";

TrackPlayer.registerPlaybackService(() => setupPlayer);

// Enable screens for React Navigation
enableScreens();

AppRegistry.registerComponent(appName, () => App);
