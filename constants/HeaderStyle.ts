import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

const HeaderStyle: NativeStackNavigationOptions = {
  headerShadowVisible: false,
  headerTitleStyle: {
    fontFamily: 'Nunito-ExtraBold',
    fontWeight: Platform.OS !== 'android' ? '800' : '400',
  },
  headerBackTitleStyle: { fontFamily: 'Nunito-ExtraBold' },
};

const HeaderLargeStyle: HeaderStyleType = {
  ...HeaderStyle,
  headerLargeTitleStyle: {
    fontFamily: 'Nunito-ExtraBold',
    fontWeight: '800',
  },
  headerLargeTitle: true,
  // headerTransparent: true,
  // headerBlurEffect: 'systemUltraThinMaterial',
};

export { HeaderLargeStyle, HeaderStyle };
