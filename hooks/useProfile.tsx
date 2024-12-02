import { supabase } from "@/config/supabase";
import { useSupabase } from "@/context/supabase-provider";

export default function useProfile() {
  // Not functional yet
  const { user, session } = useSupabase();
}
