import Header from './components/Header';
import Toolbar from './components/Toolbar';
import * as React from 'react';
import BlockList from './components/BlockList';
import { BlockProvider } from './context/BlockContext/BlockContext';
import { SimpleDialogProvider } from './context/SimpleDialogContext/SimpleDialogContext';
import { SnackbarProvider } from './context/SnackbarContext';
import ThemeProvider from './theme';

export default function App() {
  // const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  // const colorMode = {
  //   toggleColorMode: () => {
  //     setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  //   },
  // };

  // const theme = React.useMemo(
  //   () =>
  //     createTheme({
  //       palette: {
  //         mode,
  //       },
  //     }),
  //   [mode],
  // );

  return (
    <ThemeProvider>
      <SnackbarProvider>
        <SimpleDialogProvider>
          <BlockProvider>
            <Header />
            <BlockList />
            <Toolbar />
          </BlockProvider>
        </SimpleDialogProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
