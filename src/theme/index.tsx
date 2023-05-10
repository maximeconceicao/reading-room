import * as React from 'react';

// @mui
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeOptions, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
//
import palette from './palette';
import GlobalStyles from './globalStyle';

import { ThemeModeContext } from '../context/ThemeModeContext';

type Props = {
  children: React.ReactNode;
};

const ThemeProvider = ({ children }: Props) => {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');

  const colorMode = {
    toggleColorMode: () => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    },
  };

  const themeOptions: ThemeOptions = React.useMemo(
    () => ({
      mode,
      palette: palette(mode),
    }),
    [mode],
  );

  const theme = createTheme(themeOptions);

  return (
    <ThemeModeContext.Provider value={colorMode}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </MUIThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default ThemeProvider;
