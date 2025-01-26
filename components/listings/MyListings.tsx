import { Link } from 'expo-router';
import React from 'react';
import { View } from '../Themed';
import Button from '../ui/Button';
import PageScrollView from '../ui/PageScrollView';
import ListingsCountCard from './ListingsCountCard';

export default function MyListings() {
  return (
    <PageScrollView>
      <ListingsCountCard />
      <View>
        <Link href="./create" relativeToDirectory asChild>
          <Button themed title="New item" />
        </Link>
      </View>
    </PageScrollView>
  );
}
