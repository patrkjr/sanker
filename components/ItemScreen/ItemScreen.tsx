import { supabase } from '@/config/supabase';
import Spacings from '@/constants/Spacings';
import { useSupabase } from '@/context/supabase-provider';
import type { Item } from '@/types/itemTypes';
import getConversationIdAsync from '@/utils/getConversationIdAsync';
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { View } from '../Themed';
import ProfileCard from '../profile/ProfileCard';
import { H2, H4, Label, Mono, P } from '../typography';
import ImageCarousel from '../ui/ImageCarousel';
import PageScrollView from '../ui/PageScrollView';
import SelectableTag from '../ui/SelectableTag';
import BuyerOptions from './BuyerOptions';
import EditOptions from './EditOptions';
import ItemNotFound from './ItemNotFound';
import ItemScreenLoader from './ItemScreenLoader';
import NotAuthorized from './NotAuthorized';

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
  const [item, setItem] = useState<Item | null>(null);
  const [conversationHref, setConversationHref] = useState<boolean | string>(
    false
  );

  useFocusEffect(
    useCallback(() => {
      getItemAsync();
      return () => {
        setIsLoading(false);
      };
    }, [])
  );

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
      }

      if (user !== null) {
        if (data.owner_id !== user?.id) {
          const conversationId = await getConversationIdAsync({
            item_id: id,
            buyer_id: user?.id,
            seller_id: data.owner_id,
          });
          if (conversationId) {
            setConversationHref(conversationId);
          } else {
            setConversationHref('new');
          }
        }
      }
    } catch (error) {
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
      console.warn(e);
      alert(e.message);
    } finally {
      navigation.goBack();
      setIsLoading(false);
    }
  }

  function availableActions() {
    if (user === null) {
      return <NotAuthorized />;
    }

    if (item.owner_id !== user?.id) {
      return (
        <BuyerOptions
          conversationHref={conversationHref}
          user={user}
          item={item}
          id={id}
        />
      );
    }

    return (
      <>
        <EditOptions onPressDelete={askForDeletion} />
      </>
    );
  }

  return (
    <PageScrollView>
      <ImageCarousel imageUrls={item?.image_urls} />
      <View style={styles.indent}>
        <Mono secondary>
          Created{' '}
          <Mono secondary bold>
            {getPrettyDate(item?.created_at)}
          </Mono>
        </Mono>
      </View>

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

      {availableActions()}
    </PageScrollView>
  );
}

const styles = StyleSheet.create({
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
