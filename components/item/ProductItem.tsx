import { Image, StyleSheet } from 'react-native';
import { View } from '../Themed';
import { Large, P, Small } from '../typography';
import Spacings from '@/constants/Spacings';
import { useThemedColors } from '@/hooks/useThemedColors';
import { Link } from 'expo-router';

const IMAGE_SIZE = 64;

export default function ProductItem({
  children,
  id,
  title,
  price,
  imageUrl,
  ...otherProps
}) {
  const colors = useThemedColors();

  return (
    <Link href={`/profile/item/${id}`}>
      <View style={styles.outerContainer} {...otherProps}>
        <View style={styles.valuesContainer}>
          <View style={[styles.imageStyle, { backgroundColor: colors.card }]}>
            <Image
              src={imageUrl}
              style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
            />
          </View>
          <View>
            <P bold>{title}</P>
            <Small bold secondary>
              {price} kr.
            </Small>
          </View>
        </View>
      </View>
    </Link>
  );
}

function Value({ children }) {
  return (
    <View>
      <P bold>{children}</P>
    </View>
  );
}

ProductItem.Label = P;
ProductItem.Value = Value;

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacings.md,
  },
  imageStyle: {
    overflow: 'hidden',
    borderRadius: Spacings.borderRadius.md,
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
  },
  valuesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacings.sm,
  },
});
