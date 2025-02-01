type ColorShades = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  1000: string;
  1100: string;
};

type ThemeColors = {
  text: string;
  textSecondary: string;
  textPlaceholder: string;
  textError: string;
  textActive: string;
  background: string;
  card: string;
  cardDisabled: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
  border: string;
  borderActive: string;
  primary: string;
  thumb: string;
  thumbDisabled: string;
  thumbBackground: string;
  themed: {
    text: string;
    textSecondary: string;
    card: string;
    border: string;
  };
  warning: {
    text: string;
    border: string;
    background: string;
  };
  descructive: {
    text: string;
    border: string;
    background: string;
  };
  permanent: {
    white: string;
    black: string;
  };
  darkScrim: string;
};

type ThemeObject = {
  light: ThemeColors;
  dark: ThemeColors;
};

const darkScrim = 'rgba(0,0,0,0.52)';

const green: ColorShades = {
  50: '#fdfefc',
  100: '#e6f5dd',
  200: '#c8ecbd',
  300: '#a4e19e',
  400: '#7ed77e',
  500: '#5fcc6a',
  600: '#3fc061',
  700: '#20b45c',
  800: '#00A75D',
  900: '#156924',
  1000: '#093D15',
  1100: '#171717',
};

// "Neutral" from tail wind
const grey: ColorShades = {
  50: '#ffffff',
  '100': '#F7F7F7',
  '200': '#EBEBEB',
  '300': '#d4d4d4',
  '400': '#a3a3a3',
  '500': '#737373',
  '600': '#525252',
  '700': '#404040',
  '800': '#262626',
  '900': '#1F1F1F',
  '1000': '#141414',
  1100: '#000000',
};

const blue: ColorShades = {
  50: '#ffffff',
  100: '#f9fafb',
  200: '#f3f4f6',
  300: '#e5e7eb',
  400: '#d1d5db',
  500: '#9ca3af',
  600: '#6b7280',
  700: '#4b5563',
  800: '#374151',
  900: '#1f2937',
  1000: '#111827',
  1100: '#000000',
};

const yellow: ColorShades = {
  '50': '#fefce8',
  '100': '#fef9c3',
  '200': '#fef08a',
  '300': '#fde047',
  '400': '#facc15',
  '500': '#eab308',
  '600': '#ca8a04',
  '700': '#a16207',
  '800': '#854d0e',
  '900': '#713f12',
  '1000': '#422006',
  '1100': '#271202',
};

const red: ColorShades = {
  50: '#fff5f5', // Very light red, almost white
  100: '#ffe3e3', // Pale red
  200: '#ffc9c9', // Light red
  300: '#ffa8a8', // Soft red
  400: '#ff8787', // Muted medium red
  500: '#ff6b6b', // Standard red
  600: '#fa5252', // Slightly deeper red
  700: '#f03e3e', // Strong red
  800: '#e03131', // Deep red
  900: '#c92a2a', // Dark red
  1000: '#a51111', // Very dark red, approaching black
  1100: '#5a0707', // Almost black with the faintest red tint
};

export { blue, green, grey, red, yellow };

const Colors: ThemeObject = {
  light: {
    text: grey['800'],
    textSecondary: grey[500],
    textPlaceholder: grey[400],
    textError: red[600],
    textActive: green[700],
    background: grey[50],
    card: grey[100],
    cardDisabled: grey[200],
    tint: green[300],
    tabIconDefault: grey[200],
    tabIconSelected: green[300],
    border: grey[200],
    borderActive: green[700],
    primary: green[800],
    thumb: grey[50],
    thumbDisabled: grey[100],
    thumbBackground: grey[300],
    themed: {
      text: green[800],
      textSecondary: green[500],
      card: green[100],
      border: green[200],
    },
    warning: {
      text: yellow[600],
      border: yellow[300],
      background: yellow[50],
    },
    descructive: {
      text: red[600],
      border: red[200],
      background: red[100],
    },
    permanent: {
      white: grey[50],
      black: grey[1100],
    },
    darkScrim,
  },
  dark: {
    text: grey[300],
    textSecondary: grey[500],
    textPlaceholder: grey[700],
    textError: red[400],
    textActive: green[700],
    background: grey[1100],
    card: grey[1000],
    cardDisabled: grey[800],
    tint: grey[200],
    tabIconDefault: grey[200],
    tabIconSelected: green[100],
    border: grey[900],
    borderActive: green[700],
    primary: green[500],
    thumb: grey[50],
    thumbDisabled: grey[200],
    thumbBackground: grey[600],
    themed: {
      text: green[800],
      textSecondary: green[900],
      card: green[1000],
      border: green[900],
    },
    warning: {
      text: yellow[500],
      background: yellow[1100],
      border: yellow[800],
    },
    descructive: {
      text: red[500],
      border: red[900],
      background: red[1100],
    },
    permanent: {
      white: grey[50],
      black: grey[1100],
    },
    darkScrim,
  },
};

export default Colors;
