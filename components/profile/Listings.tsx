import { View } from '@/components/Themed';
import { H3, P } from '@/components/typography';
import { supabase } from '@/config/supabase';
import Spacings from '@/constants/Spacings';
import useUserStore from '@/stores/userStore';
import { useCallback } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from 'react-native';
import ProductItem from '../item/ProductItem';
import { useUserItems } from '@/hooks/useUserItems';
import { useFocusEffect } from 'expo-router';

export default function Listings() {
  const user = useUserStore((state) => state.user);
  const { isLoading, fetchUserItems } = useUserItems();
  const items = useUserStore((state) => state.user?.items);

  useFocusEffect(
    useCallback(() => {
      fetchUserItems();
    }, [])
  );

  if (isLoading) return <ActivityIndicator />;

  return (
    <ScrollView
      contentContainerStyle={styles.page}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
    >
      {!items ? (
        <P>It seems you've got not listings.</P>
      ) : (
        <View>
          {items.map((item, index) => (
            <ProductItem
              key={index}
              id={item.id}
              title={item.title}
              price={item.price}
              imageUrl={item.image_urls[0]}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: Spacings.sm,
    gap: Spacings.lg,
  },
});
