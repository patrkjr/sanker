import { useLocalSearchParams, useNavigation } from 'expo-router';
import { View } from './Themed';
import { H2, H4, Label, P } from './typography';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from 'react-native';
import { supabase } from '@/config/supabase';
import Spacings from '@/constants/Spacings';
import ProfileCard from './profile/ProfileCard';
import SelectableTag from './ui/SelectableTag';
import Button from './ui/Button';
import ImageCarousel from './ui/ImageCarousel';
import { useSupabase } from '@/context/supabase-provider';

const conditionStrings = {
  used: 'Nice but used',
  new: 'Like new',
  worn: 'Worn',
};

export default function ItemScreen() {
  const { user } = useSupabase();
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,
      headerBlurEffect: 'systemMaterial',
    });
    getItemAsync();
  }, []);

  async function getItemAsync() {
    try {
      const { data, error, status } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setItem(data);
        navigation.setOptions({ title: data.title });
      }
    } catch (error) {
      Alert.alert(error?.message);
    } finally {
      setIsLoading(false);
    }
  }
  const [isDeleting, setIsDeleting] = useState(false);

  if (isLoading) return <ActivityIndicator color="red" />;

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
    setIsDeleting(true);
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
      setIsDeleting(false);
    }
  }

  return (
    <ScrollView
      style={{ marginTop: 48 }}
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
