import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { View } from '../Themed';
import { P } from '../typography';
import DefaultStyles from '@/constants/DefaultStyles';
import Card from '../ui/Card';
import Item from '../ui/Item';
import { Link, Stack, useRouter } from 'expo-router';
import SmallButton from '../ui/SmallButton';
import Button from '../ui/Button';
import useItemFormStore from '@/stores/itemFormStore';
import { supabase } from '@/config/supabase';
import SkeletonBox from '../ui/SkeletonBox';
import LoadingShimmer from '../ui/LoadingShimmer';
import PageScrollView from '../ui/PageScrollView';

// function headerRight() {
//   return (
//     <Link href={'../'} asChild>
//       <SmallButton variant="themed" title="Done" />
//     </Link>
//   );
// }

interface Category {
  name: string;
  slug: string;
}

export default function PickCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { data, setForm } = useItemFormStore();
  const router = useRouter();

  function handleDismiss() {
    router.dismiss();
  }

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('name, slug');
      if (data) setCategories(data);
      if (error) console.error('Error fetching categories:', error);
    }
    fetchCategories();
  }, []);

  if (categories.length === 0) {
    return (
      <PageScrollView>
        <LoadingShimmer style={{ height: 350 }} />
      </PageScrollView>
    );
  }

  return (
    <PageScrollView>
      <Card>
        {categories.map((category, index) => (
          <Item
            key={index}
            onPress={() => {
              setForm({
                category_slug: category.slug,
              });
            }}
            isLastItem={index === categories.length - 1}
          >
            <Item.Label>{category.name}</Item.Label>
            <Item.Value
              hasTrailingIcon={data.category_slug === category.slug}
              trailingIconName="Check"
            >
              {/* Add any necessary children here */}
            </Item.Value>
          </Item>
        ))}
      </Card>
      <Button themed title="Done" onPress={handleDismiss} />
      {data.category_slug && (
        <Button
          title="Remove category"
          ghost
          onPress={() => {
            setForm({ category_slug: null });
          }}
        />
      )}
    </PageScrollView>
  );
}

const styles = StyleSheet.create({});
