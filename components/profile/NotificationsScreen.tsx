import React from 'react';
import PageScrollView from '../ui/PageScrollView';
import NotificationPreferences from './user-preferences/NotificationPreferences';

export default function NotificationsScreen() {
  return (
    <PageScrollView>
      <NotificationPreferences />
    </PageScrollView>
  );
}
