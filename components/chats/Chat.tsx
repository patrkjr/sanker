import { StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router';
import { supabase } from '@/config/supabase';
import { View } from '../Themed';
import { P } from '../typography';
import DefaultStyles from '@/constants/DefaultStyles';
import { FlatList } from 'react-native-gesture-handler';
import Message from './Message';
import Spacings from '@/constants/Spacings';
import Animated, {
  LinearTransition,
  useAnimatedKeyboard,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Input from '../ui/Input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconButton from '../ui/IconButton';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useSupabase } from '@/context/supabase-provider';
import { timingConfig } from '@/constants/Animations';

const STICKY_HEIGHT = 62 + 8 + 8;

export default function Chat() {
  const { id } = useLocalSearchParams();
  const { user } = useSupabase();
  const [messages, setMessages] = useState<[]>([]);
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const insets = useSafeAreaInsets();
  const colors = useThemedColors();

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Hide tab bar when showing this screen
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
      return () => {
        //Show tab bar when navigating away
        navigation
          .getParent()
          ?.setOptions({ tabBarStyle: { display: 'flex' } });
      };
    }, [])
  );

  useEffect(() => {
    getMessagesAsync();
  }, []);

  useEffect(() => {
    if (id) {
      const subscription = supabase
        .channel('chat_room')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${id}`,
          },
          (payload) => {
            setMessages((prev) => [payload.new, ...prev]); // Update state incrementally
          }
        )
        .subscribe();
      return () => supabase.removeChannel(subscription);
    }
  }, [id]);

  // useEffect(() => {
  //   listRef.current?.scrollToEnd();
  // }, [messages]);

  async function getMessagesAsync() {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: false });

      if (data) {
        setMessages(data);
      }
    } catch (error) {}
  }

  async function handleSendMessage() {
    //TODO: Better validation
    if (text.trim() !== '' && !text.match(/^ +$/)) {
      const cleanedText = text.replace(/\s{2,}/g, ' ');
      const message = {
        conversation_id: id,
        sender_id: user?.id,
        content: cleanedText,
      };
      try {
        const { error } = await supabase.from('messages').insert(message);
        if (error) {
          throw error;
        }
        setText('');
      } catch (error) {
        console.warn(error);
      }
    }
  }

  const keyboard = useAnimatedKeyboard();

  const animatedInputStyle = useAnimatedStyle(() => ({
    bottom: withTiming(
      keyboard.state.value !== 2 ? insets.bottom : 0,
      timingConfig.md
    ),
    backgroundColor: colors.background,
    transform: [{ translateY: -keyboard.height.value }],
  }));

  const animatedListStyle = useAnimatedStyle(() => ({
    paddingTop: withTiming(
      keyboard.state.value !== 2 ? insets.bottom : 0,
      timingConfig.md
    ),
    marginBottom: withTiming(keyboard.height.value, timingConfig.md),
  }));

  const listRef = useRef<FlatList>(null);

  return (
    <>
      <Animated.FlatList
        ref={listRef}
        inverted
        itemLayoutAnimation={LinearTransition.duration(100)}
        contentContainerStyle={[styles.listContainer]}
        style={[animatedListStyle]}
        data={messages}
        keyExtractor={(item) => item.created_at}
        keyboardShouldPersistTaps="never"
        renderItem={({ item }) => (
          <Message content={item.content} senderId={item.sender_id} />
        )}
      />
      <Animated.View style={[styles.inputContainer, animatedInputStyle]}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}
        >
          <Input value={text} onChangeText={setText} />
        </View>

        <IconButton name={'ArrowUp'} onPress={handleSendMessage} />
      </Animated.View>
    </>
  );
}

const { pageContainer } = DefaultStyles;

const styles = StyleSheet.create({
  listContainer: {
    gap: Spacings.sm,
    padding: Spacings.md,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: STICKY_HEIGHT,
    paddingVertical: Spacings.sm,
    paddingHorizontal: Spacings.sm,
    gap: Spacings.sm,
    width: '100%',
  },
});
