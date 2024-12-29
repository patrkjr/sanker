import { StyleSheet } from 'react-native';
import Spacings from './Spacings';

const DefaultStyles = StyleSheet.create({
  pageContainer: {
    gap: Spacings.md,
    paddingHorizontal: Spacings.md,
    paddingVertical: Spacings.lg,
  },
});

export default DefaultStyles;
