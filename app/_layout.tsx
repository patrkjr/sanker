import { SupabaseProvider } from '@/context/supabase-provider';

import { Slot, SplashScreen } from 'expo-router';

export default function AppLayout() {
  return (
    <SupabaseProvider>
      <Slot />
    </SupabaseProvider>
  );
}
