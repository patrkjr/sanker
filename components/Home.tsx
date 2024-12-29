import { Alert, StyleSheet } from 'react-native';
import Spacings from '@/constants/Spacings';
import { useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import FeaturedList from './home/FeaturedList';
import * as Haptics from 'expo-haptics';
import usePreferencesStore from '@/stores/preferenceStore';

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
