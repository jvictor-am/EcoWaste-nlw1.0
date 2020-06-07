import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';

import SplashScreen from 'react-native-splash-screen';

import Routes from './src/routes';

declare const global: {HermesInternal: null | {}};

const App = () => {
  useEffect(() => {
    // setTimeout(() => {
    SplashScreen.hide();
    // });
  }, []);

  return (
    <>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="dark-content"
      />
      <Routes />
    </>
  );
};

export default App;
