import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

export type ColorSchema = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    neutral: string;
  }
  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
}

// SETUP COLORS
const GREY = {
  0: '#FFFFFF',
  100: '#FDFDFD',
  200: '#EDEBED',
  300: '#DFE3E8',
  400: '#BCBCBC',
  500: '#919EAB',
  600: '#637381',
  700: '#303030',
  800: '#191919',
  900: '#020202',
} as const;

const PRIMARY = {
  lighter: '#85979D',
  light: '#526C74',
  main: '#153843',
  dark: '#112d36',
  darker: '#0b1c22',
  contrastText: '#fff',
} as const;

const SECONDARY = {
  lighter: '#fab3a7',
  light: '#f68572',
  main: '#F4664F',
  dark: '#c3523f',
  darker: '#7a3328',
  contrastText: '#fff',
} as const;

const INFO = {
  lighter: '#C2FDFF',
  light: '#5CFAFF',
  main: '#47b8f7',
  dark: '#006366',
  darker: '#003B3D',
  contrastText: '#fff',
} as const;

const SUCCESS = {
  lighter: '#DFF6EC',
  light: '#8FE0BC',
  main: '#84B082',
  dark: '#1A6041',
  darker: '#092016',
  contrastText: '#fff',
} as const;

const WARNING = {
  lighter: '#FDEDED',
  light: '#F7B6B6',
  main: '#E93535',
  dark: '#B81414',
  darker: '#810E0E',
  contrastText: GREY[800],
} as const;

const ERROR = {
  lighter: '#FEECED',
  light: '#FBB1B6',
  main: '#F51F2C',
  dark: '#AF0813',
  darker: '#75060D',
  contrastText: '#fff',
} as const;

const COMMON = {
  common: { black: '#000', white: '#fff' },
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  divider: alpha(GREY[500], 0.24),
  action: {
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
} as const;

export default function palette(themeMode: 'light' | 'dark') {
  const light = {
    ...COMMON,
    mode: 'light',
    text: {
      primary: GREY[800],
      secondary: GREY[600],
      disabled: GREY[500],
    },
    background: { paper: '#fff', default: GREY[200], neutral: GREY[200] },
    action: {
      ...COMMON.action,
      active: GREY[600],
    },
  } as const;

  const dark = {
    ...COMMON,
    mode: 'dark',
    text: {
      primary: GREY[100],
      secondary: GREY[500],
      disabled: GREY[600],
    },
    background: {
      paper: GREY[800],
      default: GREY[800],
      neutral: alpha(GREY[500], 0.16),
    },
    action: {
      ...COMMON.action,
      active: GREY[500],
    },
  } as const;

  return themeMode === 'light' ? light : dark;
}
