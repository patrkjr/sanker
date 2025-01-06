import { TextInput, TextInputProps, ViewStyle, TextStyle } from 'react-native';
import React from 'react';
import { View } from '../Themed';
import Spacings from '@/constants/Spacings';
import FontScale from '@/constants/FontScale';
import { Label, P, Small } from '../typography';
import { forwardRef } from 'react';
import { useThemedColors } from '@/hooks/useThemedColors';
import usePreferencesStore from '@/stores/preferenceStore';

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
    ...otherProps
  }: InputProps,
  ref
) {
  //const theme = useThemeColor();
  const colors = useThemedColors();
  const fontSize = FontScale;
  const { userPreferences } = usePreferencesStore();

  const inputStyles: TextStyle = {
    color: colors.text,
    fontSize: fontSize['lg'],
    fontFamily: 'Nunito-SemiBold',
    paddingHorizontal: Spacings.md,
    paddingVertical: Spacings.sm,
    backgroundColor: colors.card,
    borderColor: active ? colors.borderActive : colors.border,
    borderWidth: 1,
    borderRadius: Spacings.borderRadius.sm,
  };

  const wrapperStyles = {
    backgroundColor: 'transparent',
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
        keyboardAppearance={
          userPreferences.theme === 'system' ? 'default' : userPreferences.theme
        }
        selectionColor={colors.textSecondary}
        style={[inputStyles, style]}
        placeholderTextColor={colors.textPlaceholder}
        {...otherProps}
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
