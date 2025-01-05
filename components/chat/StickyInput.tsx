import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import Spacings from '@/constants/Spacings';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { timingConfig } from '@/constants/Animations';
import Input from '../ui/Input';
import IconButton from '../ui/IconButton';
import { useThemedColors } from '@/hooks/useThemedColors';

export default function StickyInput({
  autoFocus = false,
  onSend,
}: {
  autoFocus: boolean;
  onSend: (text: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState<string>('');
  const colors = useThemedColors();

  const keyboard = useAnimatedKeyboard();

  const INPUT_HEIGHT = 80; //This is manually set to 80 in StickyInput as well.

  const animatedInputStyle = useAnimatedStyle(() => ({
    height:
      keyboard.state.value === 1 || keyboard.state.value === 2
        ? 0 + INPUT_HEIGHT
        : insets.bottom + INPUT_HEIGHT,
    bottom: 0,
    backgroundColor: colors.background,
    transform: [{ translateY: -keyboard.height.value }],
  }));

  return (
    <Animated.View style={[styles.inputContainer, animatedInputStyle]}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'transparent',
        }}
      >
        <Input autoFocus={autoFocus} value={text} onChangeText={setText} />
      </View>

      <IconButton
        name={'ArrowUp'}
        onPress={() => (onSend(text), setText(''))}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    alignItems: 'flex-start',
    paddingVertical: Spacings.sm,
    paddingHorizontal: Spacings.sm,
    gap: Spacings.sm,
    width: '100%',
  },
});
