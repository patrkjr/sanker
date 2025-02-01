import React from 'react';
import { StyleSheet, View } from 'react-native';
import LocationPreferences from './user-preferences/LocationPreferences';

export default function LocationScreen() {
  return (
    <View>
      <LocationPreferences />
    </View>
  );
}

const styles = StyleSheet.create({});
