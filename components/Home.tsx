import { supabase } from '@/config/supabase';
import Spacings from '@/constants/Spacings';
import usePreferencesStore from '@/stores/preferenceStore';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import FeaturedList from './home/FeaturedList';

export default function Home() {
  const { userPreferences } = usePreferencesStore();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (userPreferences.hasSeenOnboarding === false) {
      //TODO: Show an onboarding screen
    }
    getFeaturedItemsAsync();
  }, []);

  async function getFeaturedItemsAsync() {
    try {
      setIsLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const { data, error } = await supabase
        .from('items')
        .select('id, image_urls, title, price, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

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

  //if (isLoading) return <ActivityIndicator />;

  return (
    <FeaturedList
      onRefresh={getFeaturedItemsAsync}
      refreshing={isLoading}
      items={items}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacings.sm,
  },
});
