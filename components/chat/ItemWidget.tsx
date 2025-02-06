import { supabase } from '@/config/supabase';
import Spacings from '@/constants/Spacings';
import { useThemedColors } from '@/hooks/useThemedColors';
import type { Item } from '@/types/itemTypes';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../Themed';
import ProductItem from '../item/ProductItem';
import LoadingShimmer from '../ui/LoadingShimmer';

export default function Header({ itemId }: { itemId: string | string[] }) {
  const [item, setItem] = useState<Item | null>(null);
  const colors = useThemedColors();

  async function fetchItem() {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('title, price, image_urls')
        .eq('id', itemId)
        .single();

      if (error) {
        console.error('Error fetching item', error);
      }

      setItem(data);
    } catch (error) {
      console.error('Error fetching item', error);
    }
  }

  useEffect(() => {
    fetchItem();
  }, []);

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      {item ? (
        <ProductItem
          id={itemId}
          title={item.title}
          price={item.price}
          imageUrl={item.image_urls[0]}
        />
      ) : (
        <View style={{ height: 64 + 32 }}>
          <LoadingShimmer />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacings.md,
    paddingHorizontal: Spacings.md,
  },
});
