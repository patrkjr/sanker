import React from 'react';
import {
  ErrorBoundary,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router';
import { View } from '../Themed';
import { H2, H4, Label, P } from '../typography';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { supabase } from '@/config/supabase';
import Spacings from '@/constants/Spacings';
import ProfileCard from '../profile/ProfileCard';
import SelectableTag from '../ui/SelectableTag';
import Button from '../ui/Button';
import ImageCarousel from '../ui/ImageCarousel';
import { useSupabase } from '@/context/supabase-provider';
import ItemScreenLoader from './ItemScreenLoader';
import ItemNotFound from './ItemNotFound';
import useItemStore from '@/stores/itemStore';

const conditionStrings = {
  used: 'Nice but used',
  new: 'Like new',
  worn: 'Worn',
};

export default function ItemScreen() {
  const { user } = useSupabase();
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  // TODO: Get item from itemStore, then set it in state to prevent showing the same item across multiple ItemScreens
  //const { item, setItem } = useItemStore();
  const [item, setItem] = useState();

  useEffect(() => {
    getItemAsync();
    return () => {
      // Cleanup function to reset item state and loading status
      //setItem(null);
      setIsLoading(false);
    };
  }, []);

  async function getItemAsync() {
    try {
      const {
        data,
        error: itemError,
        status,
      } = await supabase.from('items').select('*').eq('id', id).single();

      if (status === 406) {
        setItem(null);
        return;
      }

      if (itemError) {
        throw itemError;
      }

      if (data) {
        setItem(data);
        navigation.setOptions({ title: data.title });
      } else {
        setItem(null);
      }
    } catch (error) {
      // setItem(null);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <ItemScreenLoader />;

  if (!item) {
    return <ItemNotFound />;
  }

  function askForDeletion() {
    Alert.alert('Delete this item?', 'You cannot recreate it, ever.', [
      {
        text: 'Go back',
        style: 'cancel',
        isPreferred: true,
      },
      {
        text: 'Delete',
        onPress: handleDeleteItem,
        style: 'destructive',
      },
    ]);
  }

  async function handleDeleteItem() {
    // Currently deletes item from database. In the future, deleted items should be store elsewhere for analytics
    setIsLoading(true);
    try {
      const { data: list, error: listError } = await supabase.storage
        .from('images')
        .list(`items/${item.id}`);
      const filesToRemove = list.map((x) => `items/${item.id}/${x.name}`);

      if (listError) {
        throw listError;
      }

      const { error: imagesError } = await supabase.storage
        .from('images')
        .remove(filesToRemove);

      if (imagesError) {
        throw imagesError;
      }

      const { error: itemError } = await supabase
        .from('items')
        .delete()
        .eq('id', item?.id);
      if (itemError) {
        throw itemError;
      }
    } catch (e) {
      console.log(e);
      alert(e.message);
    } finally {
      navigation.goBack();
      setIsLoading(false);
    }
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageContent}>
        <ImageCarousel imageUrls={item?.image_urls} />
        <View style={styles.subHeader}>
          <H4 bold secondary>
            {item.price} kr.
          </H4>
          <SelectableTag
            showSelectable={false}
            text={conditionStrings[item.condition]}
          />
        </View>
        <H2>{item.title}</H2>
        <ProfileCard profileId={item.owner_id} />
        <Button title="Message seller" themed disabled />
        <Button title="Share" ghost disabled />
        {item.description && (
          <View style={styles.description}>
            <Label indent={false}>Description</Label>
            {item.description && <P>{item.description}</P>}
          </View>
        )}
        {item.owner_id === user.id && (
          <Button
            variant="descructive"
            title="Delete item"
            onPress={askForDeletion}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    padding: Spacings.md,
    gap: Spacings.md,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    gap: Spacings.xs,
    paddingHorizontal: Spacings.md,
  },
});
