import React from 'react';
import { View } from '../Themed';
import { H1, H2, Large } from '../typography';
import { ScrollView, StyleSheet } from 'react-native';
import Spacings from '@/constants/Spacings';
import { useThemedColors } from '@/hooks/useThemedColors';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useRouter } from 'expo-router';

export default function ItemNotFound() {
  const router = useRouter();
  const colors = useThemedColors();
  return (
    <ScrollView contentContainerStyle={styles.pageContainer}>
      <Card style={styles.headerCard}>
        <H1 style={{ fontSize: 120 }}>🏕️</H1>
        <H2 style={{ textAlign: 'center' }}>
          Sorry, we couldn't find this item.
        </H2>
      </Card>
      <Button title="Go back" onPress={() => router.back()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    gap: Spacings.lg,
    paddingHorizontal: Spacings.md,
    paddingVertical: Spacings.lg,
  },
  headerCard: {
    gap: Spacings.md,
    paddingVertical: Spacings.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    width: '100%',
  },
});
