import { Link } from 'expo-router';
import Button from '../ui/Button';

export default function BuyerOptions({
  conversationHref,
  user,
  item,
  id,
}: {
  conversationHref: string;
}) {
  return (
    <>
      <Link
        href={{
          pathname: `/chats/[id]`,
          params: {
            id: conversationHref,
            buyer_id: user?.id,
            seller_id: item.owner_id,
            item_id: id,
            back_title: 'Item',
          },
        }}
        push
        asChild
      >
        <Button
          title="Message seller"
          variant="themed"
          disabled={!conversationHref}
        />
      </Link>
      <Button title="Share" ghost disabled />
    </>
  );
}
