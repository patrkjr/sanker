import { ActivityIndicator, Alert, ScrollView, StyleSheet } from 'react-native';
import { Large, P, Small } from './typography';
import Card from './ui/Card';
import Spacings from '@/constants/Spacings';
import { useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import { View } from './Themed';
import useUserStore from '@/stores/userStore';
import FeaturedList from './home/FeaturedList';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    getFeaturedItemsAsync();
  }, []);

  async function getFeaturedItemsAsync() {
    try {
      setIsLoading(true);
      const { data, error, status } = await supabase.from('items').select('*');

      if (error) {
        throw error;
      }

      if (data) {
        setItems(data);
      }
    } catch (error) {
      Alert.alert(error?.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <ActivityIndicator />;

  return <FeaturedList items={items} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacings.sm,
  },
});
