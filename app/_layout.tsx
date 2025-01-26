import { defaultToastStyles } from '@/constants/ToastsConfig';
import { SupabaseProvider } from '@/context/supabase-provider';
import { Toasts } from '@backpackapp-io/react-native-toast';
import { Slot } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

if (__DEV__) {
  require('../ReactotronConfig');
}

export default function AppLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SupabaseProvider>
          <Slot />
        </SupabaseProvider>
        <Toasts
          globalAnimationType="spring"
          globalAnimationConfig={{
            duration: 500,
            stiffness: 100,
          }}
          defaultStyle={defaultToastStyles}
        />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
