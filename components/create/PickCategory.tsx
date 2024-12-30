import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { View } from '../Themed';
import { P } from '../typography';
import DefaultStyles from '@/constants/DefaultStyles';
import { ScrollView } from 'react-native-gesture-handler';
import Card from '../ui/Card';
import Item from '../ui/Item';
import { Link, Stack, useRouter } from 'expo-router';
import SmallButton from '../ui/SmallButton';
import Button from '../ui/Button';

interface CategoryType {
  categoryId?: number | null;
}

// function headerRight() {
//   return (
//     <Link href={'../'} asChild>
//       <SmallButton variant="themed" title="Done" />
//     </Link>
//   );
// }

export default function PickCategory({ categoryId = null }: CategoryType) {
  const [selected, setSelected] = useState<null | number>(null);
  const router = useRouter();

  function handleDismiss() {
    router.dismiss();
  }

  return (
    <ScrollView contentContainerStyle={pageContainer}>
      <Card>
        <Item onPress={() => setSelected(1)}>
          <Item.Label>Gear</Item.Label>
          <Item.Value
            hasTrailingIcon={selected === 1}
            trailingIconName="Check"
          ></Item.Value>
        </Item>

        <Item onPress={() => setSelected(2)}>
          <Item.Label>Clothing</Item.Label>
          <Item.Value
            hasTrailingIcon={selected === 2}
            trailingIconName="Check"
          ></Item.Value>
        </Item>

        <Item onPress={() => setSelected(3)}>
          <Item.Label>Food & cooking</Item.Label>
          <Item.Value
            hasTrailingIcon={selected === 3}
            trailingIconName="Check"
          ></Item.Value>
        </Item>

        <Item onPress={() => setSelected(4)}>
          <Item.Label>Navigation & safety</Item.Label>
          <Item.Value
            hasTrailingIcon={selected === 4}
            trailingIconName="Check"
          ></Item.Value>
        </Item>

        <Item onPress={() => setSelected(5)} isLastItem>
          <Item.Label>Kids and family</Item.Label>
          <Item.Value
            hasTrailingIcon={selected === 5}
            trailingIconName="Check"
          ></Item.Value>
        </Item>
      </Card>
      <Button themed title="Done" onPress={handleDismiss} />
    </ScrollView>
  );
}

const { pageContainer } = DefaultStyles;

const styles = StyleSheet.create({});
