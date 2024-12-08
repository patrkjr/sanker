import { Pressable, StyleSheet } from 'react-native';
import { P } from '../typography';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import Spacings from '@/constants/Spacings';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { timingConfig } from '@/constants/Animations';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

export default function AddImage() {
  const pickImageAsync = async () => {
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ['images'],
    //   allowsMultipleSelection: true,
    //   orderedSelection: true,
    //   quality: 0.5,
    //   exif: false,
    // });
    // if (!result.canceled) {
    //   console.log(result);
    // }
  };

  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, timingConfig.md),
      transform: [{ scale: withTiming(scale.value, timingConfig.md) }],
    };
  });

  return (
    <Pressable
      onPress={pickImageAsync}
      onPressIn={() => ((opacity.value = 0.5), (scale.value = 0.88))}
      onPressOut={() => (
        (opacity.value = 1),
        (scale.value = 1),
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      )}
    >
      <Card style={[styles.card, animatedCardStyle]}>
        <Icon name="ImagePlus" />
        <P secondary style={{ textAlign: 'center' }}>
          Add image
        </P>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 200,
    gap: Spacings.xxs,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
