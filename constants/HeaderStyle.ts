const HeaderStyle = {
  headerShadowVisible: false,
  headerTitleStyle: { fontFamily: 'Nunito', fontWeight: '800' },
  headerBackTitleStyle: { fontFamily: 'Nunito' },
};

const HeaderLargeStyle = {
  ...HeaderStyle,
  headerLargeTitleStyle: { fontFamily: 'Nunito', fontWeight: '800' },
  headerLargeTitle: true,
  // headerTransparent: true,
  // headerBlurEffect: 'systemUltraThinMaterial',
};

export { HeaderLargeStyle, HeaderStyle };
