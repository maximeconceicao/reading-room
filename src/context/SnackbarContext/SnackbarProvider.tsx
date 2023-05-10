import * as React from 'react';

import { SnackbarProvider as NotistackProvider, SnackbarKey } from 'notistack';
import { IconButton, Collapse, Box } from '@mui/material';
import Iconify, { IconifyProps } from '../../components/Iconify';
import { alpha } from '@mui/material/styles';

const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const notistackRef = React.useRef<any>(null);

  const onClose = (key: SnackbarKey) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <NotistackProvider
      ref={notistackRef}
      dense
      maxSnack={3}
      preventDuplicate
      autoHideDuration={3000}
      TransitionComponent={Collapse}
      variant="success" // Set default variant
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      iconVariant={{
        info: <SnackbarIcon icon="eva:info-fill" color="info" />,
        success: <SnackbarIcon icon="eva:checkmark-circle-2-fill" color="success" />,
        warning: <SnackbarIcon icon="eva:alert-triangle-fill" color="warning" />,
        error: <SnackbarIcon icon="eva:alert-circle-fill" color="error" />,
      }}
      // With close as default
      action={(key) => (
        <IconButton size="small" onClick={onClose(key)} sx={{ p: 0.5 }}>
          <Iconify icon="eva:close-fill" />
        </IconButton>
      )}
    >
      {children}
    </NotistackProvider>
  );
};

type SnackbarIconProps = {
  icon: IconifyProps;
  color: 'info' | 'success' | 'warning' | 'error';
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
        bgcolor: (theme) => alpha(theme.palette[color].main, 0.16),
      }}
    >
      <Iconify icon={icon} width={24} />
    </Box>
  );
}

export { SnackbarProvider };
