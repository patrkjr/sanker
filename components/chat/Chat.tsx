import { supabase } from '@/config/supabase';
import Spacings from '@/constants/Spacings';
import { useSupabase } from '@/context/supabase-provider';
import { useConversationStore } from '@/stores/useConversationStore';
import {
  Stack,
  router,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../Themed';
import { H3, P } from '../typography';
import LoadingMessages from './LoadingMessages';
import MessagesList from './MessagesList';
import StickyInput from './StickyInput';

export default function Chat() {
  const { id, seller_id, buyer_id, item_id } = useLocalSearchParams();
  const { user } = useSupabase();
  const {
    fetchConversation,
    conversation,
    isFetching,
    error,
    createConversation,
    resetConversation,
    subscribeToMessages,
  } = useConversationStore();

  const navigation = useNavigation();

  useEffect(() => {
    if (id && id !== 'new') {
      fetchConversation(id);
      const unsubscribe = subscribeToMessages(id);
      return () => {
        unsubscribe();
        resetConversation();
      };
    }
  }, [id]);

  async function handleSendMessage(text) {
    if (text.trim() !== '' && !text.match(/^ +$/)) {
      const cleanedText = text.replace(/\s{2,}/g, ' ');
      try {
        let conversation_id = id;
        if (conversation_id === 'new') {
          conversation_id = await createConversation({
            buyer_id,
            seller_id,
            item_id,
          });
          router.setParams({ id: conversation_id });
        }

        const message = {
          conversation_id,
          sender_id: user?.id,
          content: cleanedText,
        };
        const { error: messageError } = await supabase
          .from('messages')
          .insert(message);
        //TODO: Use limit to fetch like 50 messages at a time (Pagination of messages)
        if (messageError) throw messageError;
      } catch (error) {
        console.warn('Error sending message:', error);
      }
    }
  }

  const Header = () => {
    return (
      <>
        <Stack.Screen options={{ headerBackTitle: 'Messages' }} />
      </>
    );
  };

  if (isFetching) {
    return (
      <>
        <Header />
        <LoadingMessages />
        <StickyInput />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <View style={styles.emptyStateContainer}>
          <H3>Something went wrong</H3>
          <P style={styles.emptyStateMessage} secondary>
            {error}
          </P>
        </View>
        <StickyInput />
      </>
    );
  }

  if (id === 'new' || !conversation) {
    return (
      <>
        <Header />
        <View style={styles.emptyStateContainer}>
          <H3>No conversation yet</H3>
          <P style={styles.emptyStateMessage} secondary>
            Start a conversation
          </P>
        </View>
        <StickyInput onSend={handleSendMessage} />
      </>
    );
  }

  return (
    <>
      <Header />
      <MessagesList messages={conversation.messages} isLoading={isFetching} />
      <StickyInput onSend={handleSendMessage} />
    </>
  );
}

const styles = StyleSheet.create({
  emptyStateContainer: {
    flex: 1,
    gap: Spacings.sm,
    paddingHorizontal: Spacings.md,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: -80 }],
  },
  emptyStateMessage: {
    textAlign: 'center',
  },
});
