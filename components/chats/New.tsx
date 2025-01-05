import { StyleSheet, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import StickyInput from '../chat/StickyInput';
import { View } from '../Themed';
import getConversationIdAsync from '@/utils/getConversationIdAsync';
import { ScrollView } from 'react-native-gesture-handler';
import { H3 } from '../typography';
import MessagesList from '../chat/MessagesList';

export default function New() {
  const { seller_id, buyer_id, item_id, back_title } = useLocalSearchParams();
  const router = useRouter();

  // const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    checkForConversation();
  }, []);

  async function checkForConversation() {
    try {
      const conversationId = await getConversationIdAsync({
        seller_id,
        buyer_id,
        item_id,
      });
      if (!conversationId) {
        //console.log('No conversation, go ahead an create one');
      } else {
        //Failsafe if conversation already exists, but should not be possible on this screen
        router.replace(`/chat/${conversationId}?back_title=Item`);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerBackTitle: back_title || 'Back',
        }}
      />
      <MessagesList messages={[]} isLoading={isLoading} />
      <StickyInput />
    </>
  );
}

const styles = StyleSheet.create({});
