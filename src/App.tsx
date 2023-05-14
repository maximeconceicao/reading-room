import Header from './components/Header';
import { BlockProvider } from './context/BlockContext/BlockContext';
import { SimpleDialogProvider } from './context/SimpleDialogContext/SimpleDialogContext';
import { SnackbarProvider } from './context/SnackbarContext';
import ThemeProvider from './theme';
import Main from './components/Main';

export default function App() {
  return (
    <ThemeProvider>
      <SnackbarProvider>
        <SimpleDialogProvider>
          <BlockProvider>
            <Header />
            <Main />
          </BlockProvider>
        </SimpleDialogProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
