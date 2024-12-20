import {
  TextInput,
  TextInputProps,
  ViewStyle,
  TextStyle,
  StyleSheetProperties,
} from 'react-native';
import { View } from '../Themed';
import Spacings from '@/constants/Spacings';
import Colors from '@/constants/Colors';
import FontScale from '@/constants/FontScale';
import { useColorScheme } from 'react-native';
import { Label, P, Small } from '../typography';
import { forwardRef } from 'react';

interface InputProps extends TextInputProps {
  /** Optional style for the container wrapping the TextInput */
  label?: string;
  active?: boolean;
  helperMessage?: string;
  errorMessage?: string;
  containerStyle?: ViewStyle;
}

const Input = forwardRef(function Input(
  {
    label,
    active = false,
    helperMessage,
    errorMessage,
    containerStyle,
    style,
    ...textInputProps
  }: InputProps,
  ref
) {
  //const theme = useThemeColor();
  const theme = useColorScheme() || 'light';
  const colors = Colors[theme];
  const fontSize = FontScale;

  const inputStyles: TextStyle = {
    color: colors.text,
    fontSize: fontSize['lg'],
    fontFamily: 'Nunito',
    fontWeight: '600',
    paddingHorizontal: Spacings.md,
    paddingVertical: Spacings.sm,
    backgroundColor: colors.card,
    borderColor: active ? colors.borderActive : colors.border,
    borderWidth: 1,
    borderRadius: Spacings.borderRadius.sm,
  };

  const wrapperStyles = {
    gap: Spacings.xs,
  };

  return (
    <View style={[wrapperStyles, containerStyle]}>
      {label && (
        <Label
          style={[
            active && { color: colors.textActive },
            { paddingHorizontal: Spacings.sm },
          ]}
        >
          {label}
        </Label>
      )}
      <TextInput
        ref={ref}
        selectionColor={colors.textSecondary}
        style={[inputStyles, style]}
        placeholderTextColor={colors.textPlaceholder}
        {...textInputProps}
      />
      {helperMessage && (
        <Small style={{ paddingHorizontal: Spacings.sm }} secondary>
          {helperMessage}
        </Small>
      )}
      {errorMessage && (
        <Small style={{ paddingHorizontal: Spacings.sm }} error>
          {errorMessage}
        </Small>
      )}
    </View>
  );
});

export default Input;
