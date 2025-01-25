import { grey } from './Colors';
import Spacings from './Spacings';

export const defaultToastStyles = {
  view: {
    backgroundColor: grey[900],
    borderRadius: Spacings.borderRadius.md,
  },
  text: {
    color: grey[50],
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 16,
  },
};
