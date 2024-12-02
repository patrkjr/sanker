import Colors from './Colors';
import { DefaultTheme as RNdefaultTheme } from '@react-navigation/native';

const { dark, light } = Colors;
const { fonts } = RNdefaultTheme;

const DefaultTheme = {
  dark: false,
  colors: {
    primary: light.primary,
    background: '#ffffff',
    card: light.background,
    text: light.text,
    border: light.card,
    notification: light.textError,
  },
  fonts,
};

const DarkTheme = {
  dark: true,
  colors: {
    primary: dark.primary,
    background: '#000000',
    card: dark.background,
    text: dark.text,
    border: dark.card,
    notification: dark.textError,
  },
  fonts,
};

export { DarkTheme, DefaultTheme };
