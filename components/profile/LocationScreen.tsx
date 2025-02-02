import React from 'react';
import PageScrollView from '../ui/PageScrollView';
import LocationPreferences from './user-preferences/LocationPreferences';

export default function LocationScreen() {
  return (
    <PageScrollView>
      <LocationPreferences />
    </PageScrollView>
  );
}
