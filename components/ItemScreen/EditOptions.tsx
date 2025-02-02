import { P } from '../typography';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function EditOptions({
  onPressDelete,
}: {
  onPressDelete: () => void;
}) {
  return (
    <>
      <Card variant="warning">
        <P>
          You can't edit an item yet. But you can delete it, and create a new
          one. Sorry about that.
        </P>
      </Card>
      <Button
        variant="destructive"
        title="Delete item"
        onPress={onPressDelete}
      />
    </>
  );
}
