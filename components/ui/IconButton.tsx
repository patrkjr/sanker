import { Pressable, StyleSheet } from 'react-native';
import Icon from './Icon';
import Spacings from '@/constants/Spacings';
import { useThemedColors } from '@/hooks/useThemedColors';
import { View } from '../Themed';

const ICON_SIZE = 44;

interface IconButtonProps {
  name: string;
  onPress?: () => void;
}

export default function IconButton({ name, onPress }: IconButtonProps) {
  const colors = useThemedColors();

  return (
    <Pressable
      onPress={onPress}
      style={[{ backgroundColor: colors.card }, styles.container]}
    >
      <Icon name={name} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacings.borderRadius.round,
  },
});
