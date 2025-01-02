import React from 'react';
import {
  ErrorBoundary,
  Link,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router';
import { View } from '../Themed';
import { H2, H4, Label, P, Small } from '../typography';
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
import Card from '../ui/Card';

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

  function getPrettyDate(dateStr: string) {
    //Get created time and make a Date object.
    const date = new Date(dateStr);

    //Form at the date as "m YYYY"
    const formattedCreatedAt = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);

    return formattedCreatedAt;
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
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.pageContent}>
        <ImageCarousel imageUrls={item?.image_urls} />

        <View style={[styles.subHeader, styles.indent]}>
          <H4 bold secondary>
            {item.price} kr.
          </H4>
          <SelectableTag
            showSelectable={false}
            text={conditionStrings[item.condition]}
          />
        </View>
        <View style={[{ gap: Spacings.xs }, styles.indent]}>
          <H2>{item.title}</H2>
        </View>
        {item.description && (
          <View style={styles.description}>
            <Label indent={false}>Description</Label>
            {item.description && <P>{item.description}</P>}
          </View>
        )}
        <ProfileCard profileId={item.owner_id} />

        {item.owner_id !== user.id ? (
          <>
            <Link href={'/chat'} push asChild>
              <Button title="Message seller" themed />
            </Link>
            <Button title="Share" ghost disabled />
          </>
        ) : (
          // If the current user is the owner:
          <>
            <Card variant="warning">
              <P>
                You can't edit an item yet. But you can delete it, and create a
                new one. Sorry about that.
              </P>
            </Card>
            <Button
              variant="descructive"
              title="Delete item"
              onPress={askForDeletion}
            />
          </>
        )}
        <View style={styles.indent}>
          <Small secondary>
            Created{' '}
            <Small secondary bold>
              {getPrettyDate(item?.created_at)}
            </Small>
          </Small>
        </View>
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
  indent: {
    paddingHorizontal: Spacings.md,
  },
});
