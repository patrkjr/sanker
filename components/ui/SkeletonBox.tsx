import Spacings from '@/constants/Spacings';
import { useThemedColors } from '@/hooks/useThemedColors';
import { View } from '../Themed';

export default function SkeletonBox({
  borderRadius = Spacings.borderRadius.md,
}) {
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
