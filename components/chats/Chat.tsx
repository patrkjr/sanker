import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/config/supabase';
import { View } from '../Themed';
import { P } from '../typography';
import DefaultStyles from '@/constants/DefaultStyles';
import { FlatList } from 'react-native-gesture-handler';
import Message from './Message';
import Spacings from '@/constants/Spacings';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Input from '../ui/Input';

const STICKY_HEIGHT = 62;

export default function Chat() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
            setMessages((prev) => [...prev, payload.new]); // Update state incrementally
          }
        )
        .subscribe();
      return () => supabase.removeChannel(subscription);
    }
  }, [id]);

  async function getMessagesAsync() {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', id);

      if (data) {
        setMessages(data);
      }
    } catch (error) {}
  }

  const keyboard = useAnimatedKeyboard();

  const animatedInputStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value }],
  }));

  // Can initialScrollIndex={} be used to present the last item always?

  return (
    <>
      <View style={[pageContainer, { flex: 1 }]}>
        <FlatList
          contentContainerStyle={{
            flex: 1,
            paddingBottom: STICKY_HEIGHT,
            gap: Spacings.md,
          }}
          data={messages}
          keyExtractor={(item) => item.created_at}
          renderItem={({ item }) => (
            <Message content={item.content} senderId={item.sender_id} />
          )}
        />
      </View>
      <Animated.View style={[styles.inputContainer, animatedInputStyle]}>
        <Input />
      </Animated.View>
    </>
  );
}

const { pageContainer } = DefaultStyles;

const styles = StyleSheet.create({
  inputContainer: {
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
    height: STICKY_HEIGHT,
    backgroundColor: 'red',
    width: '100%',
  },
});
