/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect } from 'react';
import {
  SafeAreaView,
  useColorScheme,
} from 'react-native';

import {
  Colors,
  Header,
} from 'react-native/Libraries/NewAppScreen';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import store, { persistor } from './src/state/store';
import { HomeNavigator } from './src/navigators/HomeNavigator';
import TrackPlayer, { Capability } from 'react-native-track-player';
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
    width: '100%'
  };

  const setUpPlayer = async () => {
    await TrackPlayer.setupPlayer();
    
    TrackPlayer.updateOptions({
      capabilities: [
        Capability.Pause,
        Capability.Play,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
        Capability.SeekTo,
        Capability.Skip
      ],
      compactCapabilities: [Capability.Play, Capability.Pause]
    });
  };

  useEffect(() => {
    setUpPlayer();
  }, [])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaView style={backgroundStyle}>
            <HomeNavigator />
            <Toast />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

export default App;
