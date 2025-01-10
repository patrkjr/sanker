import { supabase } from '@/config/supabase';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import useUserProfileStore from '@/stores/useUserProfileStore';

export function useUserItems() {
  const [isLoading, setIsLoading] = useState(true);
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const setItems = useUserProfileStore((state) => state.setItems);

  const fetchUserItems = useCallback(async () => {
    try {
      const { data, error, status } = await supabase
        .from('items')
        .select('*')
        .eq('owner_id', userProfile?.id)
        .order('created_at', { ascending: false });

      if (error && status !== 406) throw error;
      if (data) setItems(data);
    } catch (error) {
      Alert.alert(error.message || 'Failed to fetch items');
    } finally {
      setIsLoading(false);
    }
  }, [userProfile?.id, setItems]);

  useEffect(() => {
    if (userProfile?.id) fetchUserItems();
  }, [userProfile?.id, fetchUserItems]);

  return { isLoading, fetchUserItems };
}
