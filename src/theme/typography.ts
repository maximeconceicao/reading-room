// ----------------------------------------------------------------------

export function remToPx(value: string) {
  return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value: number) {
  return `${value / 16}rem`;
}

const semiBold = '600';

// ----------------------------------------------------------------------

const FONT_PRIMARY = 'Open Sans, sans-serif' as const; // Google Font
const FONT_SECONDARY = 'Poppins, sans-serif'; // Local Font

const typography = {
  fontFamily: FONT_PRIMARY,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  headlineLarge: {
    fontFamily: FONT_SECONDARY,
    fontWeight: 'bold',
    lineHeight: 80 / 64,
    fontSize: pxToRem(26),
  },
  headlineMedium: {
    fontFamily: FONT_SECONDARY,
    fontWeight: 'bold',
    lineHeight: 80 / 64,
    fontSize: pxToRem(22),
  },
  title: {
    fontFamily: FONT_PRIMARY,
    fontWeight: 'bold',
    lineHeight: 1.5,
    fontSize: pxToRem(18),
  },
  action: {
    fontWeight: semiBold,
    lineHeight: 24 / 14,
    fontSize: pxToRem(15),
    textTransform: 'none',
  },
  labelText: {
    fontWeight: 'normal',
    lineHeight: 1.5,
    fontSize: pxToRem(15),
  },
  bodySmall: {
    lineHeight: 1.5,
    fontSize: pxToRem(14),
  },
  bodyBold: {
    fontWeight: 'bold',
    lineHeight: 1.5,
    fontSize: pxToRem(14),
  },
  caption: {
    lineHeight: 1.5,
    fontWeight: 'normal',
    fontSize: pxToRem(12),
  },
} as const;

export default typography;
