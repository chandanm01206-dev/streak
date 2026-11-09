// App Root Entry Point with Bullseye Entry Animation
import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

import { DarkTheme } from './src/theme';
import { useHabitStore } from './src/store';
import { RootNavigator } from './src/navigation';
import { AppEntryAnimation } from './src/components/AppEntryAnimation';

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  const { initialize, initialized } = useHabitStore();
  const [splashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleAnimationFinish = useCallback(() => {
    setSplashFinished(true);
  }, []);

  const isReady = fontsLoaded && initialized;

  return (
    <GestureHandlerRootView style={styles.root}>
      {isReady && (
        <NavigationContainer>
          <RootNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      )}

      {/* Entry Splash Animation */}
      {(!splashFinished || !isReady) && (
        <AppEntryAnimation onFinish={handleAnimationFinish} />
      )}
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: DarkTheme.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: DarkTheme.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
