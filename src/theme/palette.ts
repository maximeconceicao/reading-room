import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

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

const COMMON = {
  common: { black: '#000', white: '#fff' },
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
    block: {
      background: GREY[100],
    },
    toolbar: {
      color: GREY[100],
      background: GREY[900],
      iconHover: GREY[900],
      backgroundHover: GREY[100],
    },
    snackbar: {
      background: GREY[900],
      icon: GREY[100],
    },
    toggle: {
      icon: GREY[100],
      background: GREY[800],
    },
    dialog: {
      color: GREY[100],
      background: GREY[900],
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
    block: {
      background: GREY[700],
    },
    toolbar: {
      color: GREY[800],
      background: GREY[100],
      iconHover: GREY[100],
      backgroundHover: GREY[800],
    },
    snackbar: {
      background: GREY[100],
      icon: GREY[800],
    },
    toggle: {
      icon: GREY[800],
      background: GREY[100],
    },
    dialog: {
      color: GREY[800],
      background: GREY[100],
    },
  } as const;

  return themeMode === 'light' ? light : dark;
}
