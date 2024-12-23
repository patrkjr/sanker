import React from 'react';
import { useThemedColors } from '@/hooks/useThemedColors';
import { icons } from 'lucide-react-native';
import { ViewStyle } from 'react-native';

interface IconProps {
  name?: string;
  color?: string;
  size?: number;
  style?: ViewStyle;
}

const Icon = ({ name = 'ChevronDown', color, size = 24, style }: IconProps) => {
  const colors = useThemedColors();
  const LucidIcon = icons[name];

  return <LucidIcon style={style} color={color || colors.text} size={size} />;
};

export default Icon;
