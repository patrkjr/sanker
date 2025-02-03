import { supabase } from '@/config/supabase';
import Spacings from '@/constants/Spacings';
import { useSupabase } from '@/context/supabase-provider';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { View } from '../Themed';
import ConversationItem from '../chats/ConversationItem';
import { H3, P } from '../typography';
import Card from '../ui/Card';
import PageScrollView from '../ui/PageScrollView';

export default function Chats() {
  const { user } = useSupabase();
  const [conversations, setConversations] = useState<[]>([]);

  useFocusEffect(
    useCallback(() => {
      getConversationsAsync();
      return () => {};
    }, [])
  );

  // useEffect(() => {
  //   getConversationsAsync();
  // }, []);

  async function getConversationsAsync() {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`buyer_id.eq.${user?.id},seller_id.eq.${user?.id}`);

      if (data) {
        setConversations(data);
      }
    } catch (error) {
      console.warn(error);
    }
  }

  function getParticipantId(sellerId, buyerId) {
    if (sellerId === user?.id) {
      return buyerId;
    }
    return sellerId;
  }

  function tagMessage(sellerId) {
    if (user?.id === sellerId) {
      return 'Selling';
    }
    return 'Buying';
  }

  return (
    <PageScrollView nestedScrollEnabled={true}>
      <FlatList
        scrollEnabled={false}
        contentContainerStyle={{ gap: Spacings.lg }}
        data={conversations}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <ConversationItem
            href={{
              pathname: '/chats/[id]',
              params: {
                id: item.id,
                seller_id: item.seller_id,
                buyer_id: item.buyer_id,
                item_id: item.item_id,
              },
            }}
            userId={getParticipantId(item?.seller_id, item?.buyer_id)}
            tagMessage={tagMessage(item.seller_id)}
          />
        )}
        ListEmptyComponent={ChatEmptyScreen}
      />
    </PageScrollView>
  );
}

function ChatEmptyScreen() {
  return (
    <View style={{ flex: 1, gap: Spacings.md }}>
      <H3>No chats</H3>
      <Card style={styles.emptyContainer}>
        <P>
          Write a seller, or receive a message on your own items, to see chats
          here.
        </P>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    paddingVertical: Spacings.md,
  },
});
