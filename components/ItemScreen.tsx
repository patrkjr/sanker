import { useLocalSearchParams, useNavigation } from 'expo-router';
import { View } from './Themed';
import { H2, H3, H4, Label, P } from './typography';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from 'react-native';
import { supabase } from '@/config/supabase';
import Spacings from '@/constants/Spacings';
import ProfileCard from './profile/ProfileCard';
import SelectableTag from './ui/SelectableTag';
import Button from './ui/Button';
import ImageCarousel from './ui/ImageCarousel';

const IMAGE_HEIGHT = 300;

const conditionStrings = {
  used: 'Nice but used',
  new: 'Like new',
  worn: 'Worn',
};

export default function ItemScreen() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState(null);
  const navigation = useNavigation();

  //const ref = React.useRef<ICarouselInstance>(null);

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
        // if (data.image_urls.length > 1) {
        //   setShowMultipleImages(true);
        // }
        setItem(data);
        navigation.setOptions({ title: data.title });
      }
    } catch (error) {
      Alert.alert(error?.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <ActivityIndicator color="red" />;

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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: IMAGE_HEIGHT,
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    borderRadius: Spacings.borderRadius.lg,
    overflow: 'hidden',
  },
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
