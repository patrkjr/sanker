import React, { useCallback, useEffect, useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/config/supabase';
import { useSupabase } from '@/context/supabase-provider';
import StickyInput from './StickyInput';
import MessagesList from './MessagesList';
import getConversationIdAsync from '@/utils/getConversationIdAsync';
import { useConversationStore } from '@/stores/useConversationStore';
import LoadingMessages from './LoadingMessages';
import { View } from '../Themed';
import { H3, P } from '../typography';
import { StyleSheet } from 'react-native';
import Spacings from '@/constants/Spacings';

export default function Chat() {
  const { id, seller_id, buyer_id, item_id, back_title } =
    useLocalSearchParams();
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
    return <Stack.Screen options={{ headerBackTitle: back_title }} />;
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
