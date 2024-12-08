import { useThemedColors } from '@/hooks/useThemedColors';
import { StyleSheet } from 'react-native';
import { View } from '../Themed';
import Spacings from '@/constants/Spacings';

export default function SkeletonBox({ borderRadius }) {
  const colors = useThemedColors();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.cardDisabled,
        borderRadius: borderRadius || Spacings.borderRadius.md,
      }}
    />
  );
}
