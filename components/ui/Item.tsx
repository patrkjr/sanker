import { Pressable, StyleSheet, useColorScheme } from 'react-native';
import { View } from '../Themed';
import { P, Label } from '../typography';
import Colors from '@/constants/Colors';
import Spacings from '@/constants/Spacings';
import { Link } from 'expo-router';
import { LinkComponent } from 'expo-router/build/link/Link';
import Icon from './Icon';

interface ItemProps {
  label: string;
  value?: string;
  href?: LinkComponent;
  hasTrailingIcon?: boolean;
  leadingIconName?: string;
  trailingIconName?: string;
  disabled?: boolean;
  isLastItem?: boolean;
  hasTrailingIcon?: boolean;
  trailingIcon?: JSX.Element;
}

export default function Item({
  onPress,
  isLastItem = false,
  href,
  disabled = false,
  skeleton = false,
  children,
}: ItemProps) {
  const theme = useColorScheme() || 'light';
  const colors = Colors[theme];

  const content = (
    <Pressable disabled={disabled || skeleton} onPress={onPress}>
      <View
        style={[
          {
            opacity: disabled ? 0.5 : 1,
            borderColor: colors.border,
            borderBottomWidth: 1,
            height: 60,
          },
          isLastItem && { borderBottomWidth: 0 },
          styles.container,
        ]}
      >
        {!skeleton ? (
          children
        ) : (
          <View
            style={[
              styles.skeletonBox,
              { backgroundColor: colors.textSecondary },
            ]}
          />
        )}
      </View>
    </Pressable>
  );

  if (href) {
    return (
      <Link href={href} asChild>
        {content}
      </Link>
    );
  }

  return content;
}

const Value = ({
  children,
  hasTrailingIcon = true,
  trailingIcon = <TrailingIcon />,
}) => {
  return (
    <View style={styles.valueContainer}>
      <P bold>{children}</P>
      {hasTrailingIcon && trailingIcon}
    </View>
  );
};

const TrailingIcon = ({ trailingIcon = <Icon name="chevron-right" /> }) => {
  return trailingIcon;
};

Item.Label = P;
Item.Value = Value;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: Spacings.xxxl,
    paddingVertical: Spacings.md,
    backgroundColor: 'transparent',
  },
  valueContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacings.xxs,
  },
  skeletonBox: {
    height: 20,
    width: 90,
    opacity: 0.3,
    borderRadius: Spacings.borderRadius.sm,
  },
});
