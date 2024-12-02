import { supabase } from '@/config/supabase';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import useUserStore from '@/stores/userStore';

export function useUserItems() {
  const [isLoading, setIsLoading] = useState(true);
  const user = useUserStore((state) => state.user);
  const setItems = useUserStore((state) => state.setItems);

  const fetchUserItems = useCallback(async () => {
    try {
      const { data, error, status } = await supabase
        .from('items')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      if (error && status !== 406) throw error;
      if (data) setItems(data);
    } catch (error) {
      Alert.alert(error.message || 'Failed to fetch items');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, setItems]);

  useEffect(() => {
    if (user?.id) fetchUserItems();
  }, [user?.id, fetchUserItems]);

  return { isLoading, fetchUserItems };
}
