import { Alert, ScrollView, StyleSheet } from 'react-native';
import Spacings from '@/constants/Spacings';
import { View } from '../Themed';
import { H2, Label, P } from '../typography';
import Card from '../ui/Card';
import Item from '../ui/Item';
import useUserStore from '@/stores/userStore';
import EditAvatar from './EditAvatar';
import { useSupabase } from '@/context/supabase-provider';

export default function AccountSettings() {
  const { user } = useSupabase();
  const userProfile = useUserStore((state) => state.user);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1 }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.cardWithLabel}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: Spacings.lg,
            gap: Spacings.sm,
          }}
        >
          <EditAvatar editable profile={userProfile} />
        </View>
        <Label>Profile</Label>
        <Card>
          <Item href="profile/edit-name">
            <Item.Label>Name</Item.Label>
            <Item.Value>
              {userProfile?.first_name} {userProfile?.last_name}
            </Item.Value>
          </Item>

          <Item disabled>
            <Item.Label>Email</Item.Label>
            <Item.Value>{user?.email}</Item.Value>
          </Item>

          <Item disabled isLastItem>
            <Item.Label>Phone</Item.Label>
            <Item.Value>Not set </Item.Value>
          </Item>
        </Card>
      </View>

      <View style={styles.cardWithLabel}>
        <Label>Account</Label>
        <Card>
          <Item disabled>
            <Item.Label>Change Password</Item.Label>
            <Item.Value />
          </Item>
          <Item disabled isLastItem>
            <Item.Label>Sign out of all devices</Item.Label>
          </Item>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacings.sm,
    gap: Spacings.md,
  },
  cardWithLabel: {
    gap: Spacings.xs,
  },
});
