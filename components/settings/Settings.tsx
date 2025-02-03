import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { P } from '../typography';
import Button from '../ui/Button';
import PageScrollView from '../ui/PageScrollView';
export default function Settings() {
  return (
    <PageScrollView>
      <P style={{ textAlign: 'center' }} secondary>
        Sanker is much better with an account.
      </P>
      <Link href="/auth" asChild>
        <Button title="Join Sanker" variant="themed" onPress={() => {}} />
      </Link>
    </PageScrollView>
  );
}

const styles = StyleSheet.create({});
