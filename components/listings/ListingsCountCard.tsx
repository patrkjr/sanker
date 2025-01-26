import { useUserItems } from '@/hooks/useUserItems';
import useUserProfileStore from '@/stores/useUserProfileStore';
import { useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import Card from '../ui/Card';
import Item from '../ui/Item';

export default function ListingsCountCard() {
  const { userProfile } = useUserProfileStore();
  const {
    isLoading: isLoadingUserItems,
    fetchUserItems,
    itemsCount,
  } = useUserItems();

  useFocusEffect(
    useCallback(() => {
      fetchUserItems();
    }, [userProfile?.id])
  );

  return (
    <>
      <Card>
        <Item
          href={'./listings'}
          relativeToDirectory
          skeleton={isLoadingUserItems}
        >
          <Item.Label>Listings</Item.Label>
          <Item.Value>{itemsCount}</Item.Value>
        </Item>
        <Item disabled isLastItem>
          <Item.Label>Favorites</Item.Label>
          <Item.Value></Item.Value>
        </Item>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({});
