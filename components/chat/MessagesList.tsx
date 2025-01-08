import { StyleSheet, Text } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Animated, {
  LinearTransition,
  useAnimatedKeyboard,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Spacings from '@/constants/Spacings';
import Message from './Message';
import { timingConfig } from '@/constants/Animations';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePreferredTheme } from '@/hooks/usePreferredTheme';

interface MessageListProps {
  item: {
    title: string;
    price: string;
  };
  messages: {
    content: string;
    created_at: string;
    sender_id: string;
  }[];
  isLoading: boolean;
}

const STICKY_HEIGHT = 80;

export default function MessagesList({
  messages,
  isLoading = true,
}: MessageListProps) {
  const { bottom } = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const usePreferedTheme = usePreferredTheme();

  useEffect(() => {
    if (listRef) {
      listRef?.current?.scrollToOffset({ offset: -1 });
    }
  }, [messages]);

  const keyboard = useAnimatedKeyboard();

  const animatedListStyle = useAnimatedStyle(() => ({
    flexGrow: 0,
    overflow: 'visible',
    paddingTop: withTiming(
      keyboard.state.value === 1 || keyboard.state.value === 2
        ? 0 + STICKY_HEIGHT
        : bottom + STICKY_HEIGHT,
      timingConfig.md
    ),
    marginBottom: withTiming(keyboard.height.value, timingConfig.md),
  }));

  return (
    <Animated.FlatList
      ref={listRef}
      inverted
      itemLayoutAnimation={LinearTransition.duration(100)}
      contentContainerStyle={[styles.listContainer]}
      indicatorStyle={usePreferedTheme === 'dark' ? 'white' : 'black'}
      style={[animatedListStyle]}
      data={messages}
      keyExtractor={(item) => item.created_at}
      keyboardShouldPersistTaps="never"
      renderItem={({ item }) => (
        <Message content={item.content} senderId={item.sender_id} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    gap: Spacings.sm,
    padding: Spacings.md,
  },
});
