import { FlatList, Image, Pressable, StyleSheet } from 'react-native';
import Card from '../ui/Card';
import { H4, Large, P, Small } from '../typography';
import { View } from '../Themed';
import Spacings from '@/constants/Spacings';
import { useThemedColors } from '@/hooks/useThemedColors';
import { Link } from 'expo-router';
import useItemStore from '@/stores/itemStore';
import { usePreferredTheme } from '@/hooks/usePreferredTheme';

const IMG_HEIGHT = 180;

export default function FeaturedList({ items, onRefresh, refreshing }) {
  const colors = useThemedColors();
  const { item, setItem } = useItemStore();
  const usePreferedTheme = usePreferredTheme();

  function handlePressItem(item) {
    setItem(item);
  }

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      numColumns={2}
      onRefresh={onRefresh}
      refreshing={refreshing}
      showsVerticalScrollIndicator={false}
      indicatorStyle={usePreferedTheme === 'dark' ? 'white' : 'black'}
      columnWrapperStyle={{
        justifyContent: 'space-between',
        gap: Spacings.md,
      }}
      style={{ height: '100%' }}
      contentContainerStyle={styles.items}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        // remove "profile" when you're done
        <Link href={`/(home)/item/${item.id}`} asChild>
          <Pressable style={styles.item} onPress={() => handlePressItem(item)}>
            <View style={[{ backgroundColor: colors.card }, styles.card]}>
              <Image style={{ height: IMG_HEIGHT }} src={item.image_urls[0]} />
            </View>
            <P bold numberOfLines={1}>
              {item.title}
            </P>
            <Small bold>{item.price} kr.</Small>
          </Pressable>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  items: {
    gap: Spacings.lg,
    paddingHorizontal: Spacings.sm,
    paddingVertical: Spacings.md,
  },
  item: {
    flex: 0.5,
    gap: Spacings.xxs,
  },
  card: {
    overflow: 'hidden',
    borderRadius: Spacings.borderRadius.md,
    height: IMG_HEIGHT,
  },
});
