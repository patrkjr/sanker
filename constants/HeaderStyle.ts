import { Platform } from 'react-native';

type HeaderStyleType = {
  headerShadowVisible: boolean;
  headerTitleStyle: { fontFamily: string };
  headerBackTitleStyle: { fontFamily: string };
  headerLargeTitleStyle?: { fontFamily: string };
  headerLargeTitle?: boolean;
  // headerTransparent?: boolean;
  // headerBlurEffect?: string;
};

const HeaderStyle: HeaderStyleType = {
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
