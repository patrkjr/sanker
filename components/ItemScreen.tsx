import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { View } from './Themed';
import { H2, H3, H4, Label, Large, P, Small } from './typography';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { supabase } from '@/config/supabase';
import Spacings from '@/constants/Spacings';
import ProfileCard from './profile/ProfileCard';
import SelectableTag from './ui/SelectableTag';
import Button from './ui/Button';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { Basic as DotIndicators } from './Pagination';
import { grey } from '@/constants/Colors';

const IMAGE_HEIGHT = 300;

const conditionStrings = {
  used: 'Nice but used',
  new: 'Like new',
  worn: 'Worn',
};

export default function ItemScreen() {
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [showMultipleImages, setShowMultipleImages] = useState(false);
  const [item, setItem] = useState(null);
  const navigation = useNavigation();

  const progress = useSharedValue<number>(0);

  const ref = useRef<ICarouselInstance>(null);
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
        if (data.image_urls.length > 1) {
          setShowMultipleImages(true);
        }
        setItem(data);
        navigation.setOptions({ title: data.title });
      }
    } catch (error) {
      Alert.alert(error?.message);
    } finally {
      setIsLoading(false);
    }
  }

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  if (isLoading) return <ActivityIndicator color="red" />;

  return (
    <ScrollView
      style={{ marginTop: 48 }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageContent}>
        <View
          style={styles.imageContainer}
          dataSet={{ kind: 'utils', name: 'pagination' }}
        >
          <Carousel
            ref={ref}
            width={width - Spacings.md * 2}
            loop={false}
            data={item.image_urls}
            style={{ width: '100%' }}
            enabled={showMultipleImages}
            onProgressChange={(offsetProgress, absoluteProgress) =>
              (progress.value = absoluteProgress)
            }
            renderItem={({ item, index }) => (
              <Image style={{ height: IMAGE_HEIGHT }} src={item} />
            )}
          />
          <DotIndicators
            progress={progress}
            data={item.image_urls}
            onPress={onPressPagination}
            dotStyle={{
              backgroundColor: grey[700],
              borderRadius: Spacings.borderRadius.round,
            }}
            activeDotStyle={{
              backgroundColor: grey[50],
              borderRadius: Spacings.borderRadius.round,
            }}
            containerStyle={{
              gap: Spacings.xs,
              paddingHorizontal: Spacings.sm,
              paddingVertical: Spacings.xs,
              borderRadius: Spacings.borderRadius.round,
              backgroundColor: grey[800],
              position: 'absolute',
              bottom: Spacings.sm,
              display: !showMultipleImages && 'none',
            }}
          />
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
