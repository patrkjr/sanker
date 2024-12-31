import FontScale from '@/constants/FontScale';
import Colors from '@/constants/Colors';
import Spacings from '@/constants/Spacings';
import { Text, TextProps as RnTextProps, useColorScheme } from 'react-native';
import { useThemedColors } from '@/hooks/useThemedColors';

interface TextProps extends RnTextProps {
  secondary?: boolean;
  indent?: string | false;
  bold?: boolean;
  error?: boolean;
}

const basicFontStyle = {
  fontFamily: 'Nunito-Medium',
};

const Mono = function ({
  children,
  bold = false,
  secondary = false,
  ...textProps
}: TextProps) {
  const colors = useThemedColors();

  return (
    <Text
      style={[
        {
          fontFamily: bold ? 'Nunito-ExtraBold' : 'FiraMono-Medium',
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
  secondary = true,
  indent = 'md',
  ...textProps
}: TextProps) {
  const colors = useThemedColors();

  return (
    <Text
      style={[
        basicFontStyle,
        indent && { paddingHorizontal: Spacings[indent] },
        {
          fontFamily: 'Nunito-ExtraBold',
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
  const colors = useThemedColors();

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
        bold && { fontFamily: 'Nunito-ExtraBold' },
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
  const colors = useThemedColors();

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
        bold && { fontFamily: 'Nunito-ExtraBold' },
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
  const colors = useThemedColors();

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
        bold && { fontFamily: 'Nunito-ExtraBold' },
        textProps?.style,
      ]}
    >
      {children}
    </Text>
  );
};
Large.displayName = 'Large';

const H1 = function ({ children, ...textProps }: TextProps) {
  const colors = useThemedColors();

  return (
    <Text
      style={[
        basicFontStyle,
        {
          fontSize: FontScale['3xl'],
          fontFamily: 'Nunito-ExtraBold',
          color: colors.text,
        },
        textProps?.style,
      ]}
    >
      {children}
    </Text>
  );
};
H1.displayName = 'H1';

const H2 = function ({ children, ...textProps }: TextProps) {
  const colors = useThemedColors();

  return (
    <Text
      style={[
        basicFontStyle,
        {
          fontSize: FontScale['2xl'],
          fontFamily: 'Nunito-ExtraBold',
          color: colors.text,
        },
        textProps?.style,
      ]}
    >
      {children}
    </Text>
  );
};
H2.displayName = 'H2';

const H3 = function ({ children, ...textProps }: TextProps) {
  const colors = useThemedColors();

  return (
    <Text
      style={[
        basicFontStyle,
        {
          fontSize: FontScale['xl'],
          fontFamily: 'Nunito-ExtraBold',
          color: colors.text,
        },
        textProps?.style,
      ]}
    >
      {children}
    </Text>
  );
};
H3.displayName = 'H3';

const H4 = function ({ children, secondary = false, ...textProps }: TextProps) {
  const colors = useThemedColors();

  return (
    <Text
      style={[
        basicFontStyle,
        {
          fontSize: FontScale['lg'],
          fontFamily: 'Nunito-ExtraBold',
          color: secondary ? colors.textSecondary : colors.text,
        },
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
