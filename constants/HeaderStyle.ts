type HeaderStyleType = {
  headerShadowVisible: boolean;
  headerTitleStyle: { fontFamily: string; fontWeight: string };
  headerBackTitleStyle: { fontFamily: string };
  headerLargeTitleStyle?: { fontFamily: string; fontWeight: string };
  headerLargeTitle?: boolean;
  // headerTransparent?: boolean;
  // headerBlurEffect?: string;
};

const HeaderStyle: HeaderStyleType = {
  headerShadowVisible: false,
  headerTitleStyle: { fontFamily: 'Nunito', fontWeight: '800' },
  headerBackTitleStyle: { fontFamily: 'Nunito' },
};

const HeaderLargeStyle: HeaderStyleType = {
  ...HeaderStyle,
  headerLargeTitleStyle: { fontFamily: 'Nunito', fontWeight: '800' },
  headerLargeTitle: true,
  // headerTransparent: true,
  // headerBlurEffect: 'systemUltraThinMaterial',
};

export { HeaderLargeStyle, HeaderStyle };
