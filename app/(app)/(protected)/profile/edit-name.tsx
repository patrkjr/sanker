import EditNameForm from '@/components/profile/EditNameForm';
import React from 'react';
import { Platform, StatusBar } from 'react-native';

export default function EditNameLayout() {
  return (
    <>
      <EditNameForm />
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
    </>
  );
}
