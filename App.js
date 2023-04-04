import React from "react";
import {
  NativeBaseProvider,
} from "native-base";
import { AppNavigator } from './configurations/AppNavigator';
import { DefaultTheme } from "./configurations/DefaultTheme";
import { SafeAreaView, StatusBar } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        animated={true}        
        barStyle="dark-content"
      />
      <NativeBaseProvider theme={DefaultTheme}>
        <AppNavigator />
      </NativeBaseProvider>
    </SafeAreaView>
  );
}
