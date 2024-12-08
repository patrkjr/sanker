import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { View } from './Themed';
import { H2, H3, H4, Label, Large, P, Small } from './typography';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { supabase } from '@/config/supabase';
import Spacings from '@/constants/Spacings';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';
import ProfileCard from './profile/ProfileCard';
import SelectableTag from './ui/SelectableTag';
import Button from './ui/Button';

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

  if (isLoading) return <ActivityIndicator />;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageContent}>
        <View style={styles.imageContainer}>
          <Image style={{ height: IMAGE_HEIGHT }} src={item.image_urls[0]} />
        </View>
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
