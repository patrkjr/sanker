// components/ToastProvider.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ProgressToast from './ProgressWidget';

const ProgressWidgetProvider: React.FC = ({ children }) => {
  return (
    <View style={styles.container}>
      {children}
      <ProgressToast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProgressWidgetProvider;
