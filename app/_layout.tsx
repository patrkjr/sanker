import React from 'react';
import { SupabaseProvider } from '@/context/supabase-provider';

import { Slot, SplashScreen } from 'expo-router';

if (__DEV__) {
  require('../ReactotronConfig');
}

export default function AppLayout() {
  return (
    <SupabaseProvider>
      <Slot />
    </SupabaseProvider>
  );
}
