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
import store from './src/state/store';
import { HomeNavigator } from './src/navigators/HomeNavigator';
import TrackPlayer from 'react-native-track-player';

const App = async () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  const setUpPlayer = async () => {
    await TrackPlayer.setupPlayer({});
  };

  useEffect(() => {
    setUpPlayer();  
  }, [])

  return (
    <Provider store={store}>
      <SafeAreaView style={backgroundStyle}>
          <Header />
          <HomeNavigator />
          <Toast />
      </SafeAreaView>
    </Provider>
  );
};

export default App;
