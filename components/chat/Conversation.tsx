import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { View } from '../Themed';
import { H3, P } from '../typography';
import useItemStore from '@/stores/itemStore';
import { useSupabase } from '@/context/supabase-provider';
import { supabase } from '@/config/supabase';
import LoadingShimmer from '../ui/LoadingShimmer';
import DefaultStyles from '@/constants/DefaultStyles';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { FlatList } from 'react-native-gesture-handler';

export default function Conversation() {
  const { item } = useItemStore();
  const { user } = useSupabase();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversationDetails, setConversationDetails] = useState<{} | null>(
    null
  );
  const [text, setText] = useState<string>('');
  const [messages, setMessages] = useState<[]>([]);

  //WARNING: Only works with current navigation setup
  const buyer_id = user?.id;
  const seller_id = item?.owner_id;
  const item_id = item?.id;

  useEffect(() => {
    getConversationId();
  }, []);

  useEffect(() => {
    if (conversationId) {
      getMessagesAsync();
    }
  }, [conversationId]);

  useEffect(() => {
    if (conversationId) {
      const subscription = supabase
        .channel('test_room')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new]); // Update state incrementally
          }
        )
        .subscribe();
      return () => supabase.removeChannel(subscription);
    }
  }, [conversationId]);

  async function getConversationId() {
    try {
      const {
        data,
        error: conversationError,
        state,
      } = await supabase
        .from('conversations')
        .select('*')
        .eq('buyer_id', buyer_id)
        .eq('seller_id', seller_id)
        .eq('item_id', item_id)
        .single();

      if (!data) {
        console.log('No conversation, set to null');
        setConversationId(null);
        setConversationDetails(null);
      } else {
        setConversationId(data.id);
        setConversationDetails(data);
      }

      if (conversationError) {
        throw conversationError;
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getMessagesAsync() {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId);

      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.warn(error);
    }
  }

  async function sendMessage() {
    try {
      let conversation_id = conversationId;
      if (!conversation_id) {
        console.log('Lets create conversation before proceeding');
        conversation_id = await createConversation();
        console.log(
          'Updated the id to ' +
            conversationDetails +
            '. Go ahead and post the message'
        );
      } else {
        console.log('Conversation exists, just post the message');
      }
      if (!conversation_id) {
        throw new Error('Missing conversation ID');
      }
      const { data, error: messageError } = await supabase
        .from('messages')
        .insert({ conversation_id, sender_id: user?.id, content: text });

      if (messageError) {
        throw messageError;
      }

      setText('');
    } catch (error) {
      console.warn(error);
    }
  }

  async function createConversation() {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert([
          { buyer_id, seller_id, item_id }, // Insert the new conversation
        ])
        .select('id'); // Select the newly created conversation's ID

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const newConversationId = data[0].id;
        setConversationId(newConversationId);
        setConversationDetails(data);
        console.log('New conversation created with ID:', newConversationId);
        return newConversationId;
      } else {
        console.error('No conversation ID returned');
        return null;
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  }

  function handleSend() {
    sendMessage();
  }

  if (isLoading) {
    return (
      <View style={pageContainer}>
        <LoadingShimmer style={{ height: 80 }} />
      </View>
    );
  }

  return (
    <View style={pageContainer}>
      {conversationId ? (
        <H3>Convo: {conversationId}</H3>
      ) : (
        <H3>Start the conversation</H3>
      )}
      {messages && (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.created_at}
          renderItem={({ item: message }) => <P>{message.content}</P>}
        />
      )}
      <Input autoFocus onChangeText={setText} value={text} />
      <Button themed title="Send" onPress={handleSend} />
    </View>
  );
}

const { pageContainer } = DefaultStyles;

const styles = StyleSheet.create({});
