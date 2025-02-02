import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../Themed';
import Button from '../ui/Button';

export default function NotAuthorized() {
  return (
    <View>
      <Link href="/login" asChild>
        <Button title="Login to contact seller" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({});
