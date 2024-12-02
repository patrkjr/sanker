import { SupabaseProvider } from "@/context/supabase-provider";

import { Slot } from "expo-router";

export default function AppLayout() {
  return (
    <SupabaseProvider>
      <Slot />
    </SupabaseProvider>
  );
}
