import { View } from '@/components/Themed';
import { H3, P } from '@/components/typography';
import { supabase } from '@/config/supabase';
import Spacings from '@/constants/Spacings';
import useUserProfileStore from '@/stores/useUserProfileStore';
import { useCallback } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from 'react-native';
import ProductItem from '../item/ProductItem';
import { useUserItems } from '@/hooks/useUserItems';
import { useFocusEffect } from 'expo-router';
import DefaultStyles from '@/constants/DefaultStyles';
import PageScrollView from '../ui/PageScrollView';
import React from 'react';

export default function UserListings() {
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const { isLoading, fetchUserItems } = useUserItems();
  const items = useUserProfileStore((state) => state.userProfile?.items);

  useFocusEffect(
    useCallback(() => {
      fetchUserItems();
    }, [])
  );

  if (isLoading) return <ActivityIndicator />;

  return (
    <PageScrollView nestedScrollEnabled={true}>
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
    </PageScrollView>
  );
}
