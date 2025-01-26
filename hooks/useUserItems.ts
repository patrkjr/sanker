import { supabase } from '@/config/supabase';
import useUserProfileStore from '@/stores/useUserProfileStore';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useUserItems() {
  const [isLoading, setIsLoading] = useState(true);
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const setItems = useUserProfileStore((state) => state.setItems);
  const [itemsCount, setItemsCount] = useState<number | undefined>(undefined);

  const fetchUserItems = useCallback(async () => {
    try {
      const { data, count, error, status } = await supabase
        .from('items')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', userProfile?.id)
        .order('created_at', { ascending: false });

      if (error && status !== 406) throw error;
      if (data) setItems(data);
      if (count) setItemsCount(count);
    } catch (error) {
      Alert.alert(error.message || 'Failed to fetch items');
    } finally {
      setIsLoading(false);
    }
  }, [userProfile?.id, setItems]);

  // const userItemsCount = useCallback(async () => {
  //   try {
  //     const { count, error } = await supabase
  //       .from('items')
  //       .select('*', { count: 'exact', head: true })
  //       .eq('owner_id', userProfile?.id);

  //     if (error) throw error;
  //     return count || 0;
  //   } catch (error) {
  //     Alert.alert(error.message || 'Failed to count items');
  //     return 0;
  //   }
  // }, [userProfile?.id]);

  useEffect(() => {
    if (userProfile?.id) fetchUserItems();
  }, [userProfile?.id, fetchUserItems]);

  return { isLoading, fetchUserItems, itemsCount };
}
