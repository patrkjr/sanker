import React, { useEffect } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { View } from '../Themed';
import { H2, H3, Large, P } from '../typography';
import { ScrollView, StyleSheet } from 'react-native';
import Spacings from '@/constants/Spacings';
import Button from '../ui/Button';
import SelectableTag from '../ui/SelectableTag';
import ImageCarousel from '../ui/ImageCarousel';
import useItemStore from '@/stores/itemStore';
import ItemScreenLoader from '../ItemScreen/ItemScreenLoader';

const conditionStrings = {
  used: 'Nice but used',
  new: 'Like new',
  worn: 'Worn',
};

const successMessages: Array = [
  'Congratulations, your item is ready!',
  'Congratulations, your item is now for sale!',
  'Your item is ready to be sold! 🫡',
  'Get ready, your item is for sale!',
  'Your item is ready!',
  'Your item is now on the market!',
  'That looks great!',
];

export default function Success() {
  const { item, setItem } = useItemStore();

  const router = useRouter();
  const navigation = useNavigation();

  const succesMessage: string =
    successMessages[Math.floor(Math.random() * successMessages.length)];

  async function handleDismiss() {
    router.dismissTo({
      pathname: '/create',
      params: { shouldResetForm: 'true' },
    });
  }

  if (!item) {
    return <ItemScreenLoader />;
  }

  const { title, price, condition, image_urls } = item;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <H3 style={{ textAlign: 'center' }}>{succesMessage}</H3>
      {/* //Only show the first image, but we recieve all the images here */}
      <ImageCarousel imageUrls={image_urls} />
      <View style={styles.priceContainer}>
        <Large bold secondary>
          {price} kr.
        </Large>
        <SelectableTag
          text={conditionStrings[condition]}
          showSelectable={false}
          mono
        />
      </View>
      <H2>{title}</H2>
      <Button disabled title="Share" />
      <Button title="Close" ghost onPress={handleDismiss} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacings.md,
    paddingVertical: Spacings.md,
    gap: Spacings.md,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    borderRadius: Spacings.borderRadius.md,
    overflow: 'hidden',
  },
  image: {
    backgroundColor: 'transparent',
  },
  iconContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});
