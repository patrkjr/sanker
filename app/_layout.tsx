import { SupabaseProvider } from '@/context/supabase-provider';
import React from 'react';

import { Slot } from 'expo-router';

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
