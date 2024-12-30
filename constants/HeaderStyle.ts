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
  headerTitleStyle: { fontFamily: 'Nunito-ExtraBold' },
  headerBackTitleStyle: { fontFamily: 'Nunito-Bold' },
};

const HeaderLargeStyle: HeaderStyleType = {
  ...HeaderStyle,
  headerLargeTitleStyle: {
    fontFamily: 'Nunito-ExtraBold',
  },
  headerLargeTitle: true,
  // headerTransparent: true,
  // headerBlurEffect: 'systemUltraThinMaterial',
};

export { HeaderLargeStyle, HeaderStyle };
