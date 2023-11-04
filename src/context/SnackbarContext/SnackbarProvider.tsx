import * as React from 'react';

import { SnackbarProvider as NotistackProvider, SnackbarKey } from 'notistack';
import { IconButton, Collapse, Box } from '@mui/material';
import Iconify, { IconifyProps } from '../../components/Iconify';
import { Theme, useTheme } from '@mui/system';

const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();

  const notistackRef = React.useRef<any>(null);

  const onClose = (key: SnackbarKey) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <NotistackProvider
      ref={notistackRef}
      style={{
        backgroundColor: theme.palette.snackbar.background,
        fontWeight: 800,
        color: theme.palette.snackbar.icon,
      }}
      dense
      maxSnack={3}
      preventDuplicate
      autoHideDuration={3000}
      TransitionComponent={Collapse}
      variant="success" // Set default variant
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      iconVariant={{
        success: <SnackbarIcon icon="eva:checkmark-circle-2-fill" color={theme.palette.snackbar.background} />,
      }}
      // With close as default
      action={(key) => (
        <IconButton size="small" onClick={onClose(key)} sx={{ p: 0.5, opacity: 0.6 }}>
          <Iconify icon="eva:close-fill" color={theme.palette.snackbar.icon} />
        </IconButton>
      )}
    >
      {children}
    </NotistackProvider>
  );
};

type SnackbarIconProps = {
  icon: IconifyProps;
  color: 'success';
};

function SnackbarIcon({ icon, color }: SnackbarIconProps) {
  return (
    <Box
      component="span"
      sx={{
        mr: 1.5,
        width: 40,
        height: 40,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        color: `${color}.main`,
        bgcolor: (theme: Theme) => theme.palette.snackbar.background,
      }}
    >
      <Iconify icon={icon} width={24} />
    </Box>
  );
}

export { SnackbarProvider };
