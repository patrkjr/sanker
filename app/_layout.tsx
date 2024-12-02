import { SupabaseProvider } from '@/context/supabase-provider';

import { Slot, SplashScreen } from 'expo-router';
import { useEffect, useState } from 'react';

export default function AppLayout() {
  return (
    <SupabaseProvider>
      <Slot />
    </SupabaseProvider>
  );
}
