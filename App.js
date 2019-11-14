/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

// import Splashscreen from './src/Screens/Splashscreen/Splashscreen';
import {UserProvider} from './src/UserProvider';

import Router from './src/Routes/Router';

const App = () => {
  return (
    <UserProvider>
      <StatusBar barStyle="light-content" backgroundColor="#FB5286" />
      <Router />
    </UserProvider>
  );
};

export default App;
