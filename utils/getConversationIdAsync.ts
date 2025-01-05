import { supabase } from '@/config/supabase';

interface ConversationParams {
  buyer_id: string;
  seller_id: string;
  item_id: string;
}

export default async function getConversationIdAsync({
  buyer_id,
  seller_id,
  item_id,
}: ConversationParams): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('id')
      .eq('buyer_id', buyer_id)
      .eq('seller_id', seller_id)
      .eq('item_id', item_id)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 indicates "No rows found" in Supabase
      throw error;
    }

    if (!data) {
      return null;
    } else {
      return data.id;
    }
  } catch (error) {
    throw error;
  }
}
