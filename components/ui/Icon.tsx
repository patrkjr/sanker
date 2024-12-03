import { useThemedColors } from '@/hooks/useThemedColors';
import { icons } from 'lucide-react-native';
import { Text } from '../Themed';

interface IconProps {
  name?: string;
  color?: string;
  size?: number;
}

const Icon = ({ name = 'ChevronDown', color, size = 24 }: IconProps) => {
  const colors = useThemedColors();
  const LucidIcon = icons[name];

  return <LucidIcon color={color || colors.text} size={size} />;
};

export default Icon;
