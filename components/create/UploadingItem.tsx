import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { View } from '../Themed';
import { H2, P } from '../typography';
import { Pressable, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import Spacings from '@/constants/Spacings';
import { useRouter, useSegments } from 'expo-router';
import useCreateItem from '@/hooks/useCreateItem';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { timingConfig } from '@/constants/Animations';
import { useThemedColors } from '@/hooks/useThemedColors';
import useItemFormStore from '@/stores/itemFormStore';

export default function UploadingItem() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { createItem, uploadStatus, id } = useCreateItem();
  const colors = useThemedColors();
  const { data } = useItemFormStore();

  function handleCancel() {
    router.dismiss(1);
  }
  useEffect(() => {
    createItem(data);
    opacity.value = withRepeat(
      withTiming(1, { ...timingConfig.md, duration: 650 }),
      -1,
      true
    );
  }, []);

  const progress = useSharedValue(0);
  const opacity = useSharedValue(0.4);

  const animatedProgress = useAnimatedStyle(() => {
    return {
      width: withTiming(`${progress.value}%`, timingConfig.md),
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    progress.value = uploadStatus.progress;
    if (uploadStatus.progress === 100) {
      if (id !== null) {
        opacity.value = withRepeat(withTiming(1, { duration: 200 }), 5, true);
        handleRedirect();
      }
    }

    if (uploadStatus.error) {
      setTimeout(() => {
        router.dismiss(1);
      }, 5000);
    }
  }, [uploadStatus]);

  function handleRedirect() {
    setTimeout(() => {
      router.dismiss(1);
      router.push(`/create/item/${id}`);
    }, 2000);
  }

  const { error, message } = uploadStatus;

  return (
    <Animated.View
      style={[
        { paddingTop: insets.top, paddingBottom: insets.bottom },
        styles.pageContainer,
      ]}
    >
      <Pressable
        style={styles.hiddenButton}
        onLongPress={handleCancel}
        delayLongPress={5000}
      />
      <H2>Creating item</H2>
      <P error={error}>{error || message}</P>
      <View
        style={[styles.progressBar, { backgroundColor: colors.cardDisabled }]}
      >
        <Animated.View
          style={[
            {
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              borderRadius: Spacings.borderRadius.round,
              backgroundColor: colors.primary,
            },
            animatedProgress,
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    width: '100%',
    gap: Spacings.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacings.md,
    paddingVertical: Spacings.lg,
  },
  progressBar: {
    justifyContent: 'flex-start',
    width: '80%',
    overflow: 'hidden',
    backgroundColor: 'red',
    height: Spacings.xs,
    borderRadius: Spacings.borderRadius.round,
  },
  hiddenButton: {
    backgroundColor: 'transparent',
    position: 'absolute',
    height: 100,
    width: 150,
    right: 20,
    top: 50,
  },
});
