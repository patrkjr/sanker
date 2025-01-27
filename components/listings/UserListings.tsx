import { View } from '@/components/Themed';
import { P } from '@/components/typography';
import { useUserItems } from '@/hooks/useUserItems';
import useUserProfileStore from '@/stores/useUserProfileStore';
import { useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import ProductItem from '../item/ProductItem';
import PageScrollView from '../ui/PageScrollView';

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
