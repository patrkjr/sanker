import FontScale from '@/constants/FontScale';
import Colors from '@/constants/Colors';
import Spacings from '@/constants/Spacings';
import { Text, TextProps as RnTextProps, useColorScheme } from 'react-native';

interface TextProps extends RnTextProps {
  secondary?: boolean;
  indent?: 'sm' | 'md';
  bold?: boolean;
  error?: boolean;
}

const basicFontStyle = {
  fontFamily: 'Nunito',
  fontWeight: '500',
};

const Mono = function ({
  children,
  bold = false,
  secondary = false,
  ...textProps
}: TextProps) {
  const theme = useColorScheme() || 'light';

  const colors = Colors[theme];

  return (
    <Text
      style={[
        {
          fontFamily: 'Fira Mono',
          fontWeight: bold ? '700' : '500',
          fontSize: FontScale['sm'],
          color: secondary ? colors.textSecondary : colors.text,
        },
        textProps?.style,
      ]}
    >
      {children}
    </Text>
  );
};
Mono.displayName = 'Mono';

const Label = function ({
  children,
  indent = 'md',
  secondary = false,
  ...textProps
}: TextProps) {
  const theme = useColorScheme() || 'light';

  const colors = Colors[theme];

  return (
    <Text
      style={[
        basicFontStyle,
        {
          fontWeight: '800',
          paddingHorizontal: Spacings[indent],
          fontSize: FontScale['sm'],
          color: secondary ? colors.textSecondary : colors.text,
        },
        textProps?.style,
      ]}
    >
      {children}
    </Text>
  );
};
Label.displayName = 'Label';

const P = function ({
  children,
  secondary = false,
  bold = false,
  error = false,
  ...textProps
}: TextProps) {
  const theme = useColorScheme() || 'light';

  const colors = Colors[theme];

  let textColor = colors.text;

  if (secondary) {
    textColor = colors.textSecondary;
  }

  if (error) {
    textColor = colors.textError;
  }

  return (
    <Text
      style={[
        basicFontStyle,
        { fontSize: FontScale['md'], color: textColor },
        bold && { fontWeight: '800' },
        textProps?.style,
      ]}
    >
      {children}
    </Text>
  );
};
P.displayName = 'P';

const Small = function ({
  children,
  bold = false,
  secondary = false,
  error = false,
  ...textProps
}: TextProps) {
  const theme = useColorScheme() || 'light';

  const colors = Colors[theme];

  let textColor = colors.text;

  if (secondary) {
    textColor = colors.textSecondary;
  }

  if (error) {
    textColor = colors.textError;
  }

  return (
    <Text
      style={[
        basicFontStyle,
        { fontSize: FontScale['sm'], color: textColor },
        bold && { fontWeight: '700' },
        textProps?.style,
      ]}
    >
      {children}
    </Text>
  );
};
Small.displayName = 'Small';

const Large = function ({
  children,
  secondary = false,
  error = false,
  bold = false,
  ...textProps
}: TextProps) {
  const theme = useColorScheme() || 'light';

  const colors = Colors[theme];

  let textColor = colors.text;

  if (secondary) {
    textColor = colors.textSecondary;
  }

  if (error) {
    textColor = colors.textError;
  }

  return (
    <Text
      {...textProps}
      style={[
        basicFontStyle,
        { fontSize: FontScale['lg'], color: textColor },
        bold && { fontWeight: '800' },
        textProps?.style,
      ]}
    >
      {children}
    </Text>
  );
};
Large.displayName = 'Large';

const H1 = function ({ children, ...textProps }: TextProps) {
  const theme = useColorScheme() || 'light';

  const colors = Colors[theme];

  return (
    <Text
      style={[
        basicFontStyle,
        { fontSize: FontScale['3xl'], fontWeight: '800', color: colors.text },
        textProps?.style,
      ]}
    >
      {children}
    </Text>
  );
};
H1.displayName = 'H1';

const H2 = function ({ children, ...textProps }: TextProps) {
  const theme = useColorScheme() || 'light';

  const colors = Colors[theme];

  return (
    <Text
      style={[
        basicFontStyle,
        { fontSize: FontScale['2xl'], fontWeight: '800', color: colors.text },
        textProps?.style,
      ]}
    >
      {children}
    </Text>
  );
};
H2.displayName = 'H2';

const H3 = function ({ children, ...textProps }: TextProps) {
  const theme = useColorScheme() || 'light';

  const colors = Colors[theme];

  return (
    <Text
      style={[
        basicFontStyle,
        { fontSize: FontScale['xl'], fontWeight: '800', color: colors.text },
        textProps?.style,
      ]}
    >
      {children}
    </Text>
  );
};
H3.displayName = 'H3';

const H4 = function ({ children, ...textProps }: TextProps) {
  const theme = useColorScheme() || 'light';

  const colors = Colors[theme];

  return (
    <Text
      style={[
        basicFontStyle,
        { fontSize: FontScale['lg'], fontWeight: '800', color: colors.text },
        textProps?.style,
      ]}
      {...textProps}
    >
      {children}
    </Text>
  );
};

H4.displayName = 'H4';

export { Label, P, H1, H2, H3, H4, Large, Mono, Small };
