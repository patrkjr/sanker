import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { View } from './Themed';
import { H3, Large, P, Small } from './typography';
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

const IMAGE_HEIGHT = 480;

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
      <View style={{ height: IMAGE_HEIGHT }}>
        <Image
          style={{ flex: 1, height: IMAGE_HEIGHT }}
          src={item.image_urls[0]}
        />
      </View>
      <View style={styles.pageContent}>
        <H3>{item.title}</H3>
        <Small bold secondary>
          {item.price} kr.
        </Small>
        {item.description && <P>{item.description}</P>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: IMAGE_HEIGHT,
  },
  pageContent: {
    padding: Spacings.md,
    gap: Spacings.sm,
  },
});
