import { styled } from '@mui/material/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
} from '@mui/material';
import Iconify from '../Iconify';
import { Theme, useTheme } from '@mui/system';

type SimpleDialogProps = {
  dialogTitle: string;
  dialogContentText: string;
  isOpen: boolean;
  handleClose: () => void;
  handleConfirm?: () => void;
};

const StyledButton = styled(Button)(({ theme }: { theme: Theme }) => ({
  width: '130px',
  fontWeight: 'bold',
  fontSize: '15px',
  color: theme.palette.dialog.color,
}));

function SimpleDialog(props: SimpleDialogProps) {
  const { dialogTitle, dialogContentText, isOpen, handleClose, handleConfirm } = props;
  const theme = useTheme();

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      sx={{ textAlign: 'center', margin: 'auto' }}
      PaperProps={{
        style: {
          borderRadius: 25,
          backgroundColor: theme.palette.dialog.background,
          color: theme.palette.dialog.color,
        },
      }}
    >
      <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: (theme: Theme) => theme.palette.dialog.icon,
            position: 'absolute',
            right: 15,
            top: 10,
            zIndex: 1,
          }}
        >
          <Iconify icon="bi:x" width={24} />
        </IconButton>
      </DialogTitle>
      <DialogTitle sx={{ fontSize: '16px', fontWeight: 800, paddingTop: '0', paddingBottom: '10px' }}>
        {dialogTitle}
      </DialogTitle>
      <DialogContent sx={{ width: '400px' }}>
        <DialogContentText
          sx={{ wordWrap: 'break-word', fontSize: '14px', color: (theme: Theme) => theme.palette.dialog.color }}
        >
          {dialogContentText}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', marginBottom: 2 }}>
        <StyledButton autoFocus onClick={handleClose}>
          Cancel
        </StyledButton>
        <StyledButton
          variant="outlined"
          color="warning"
          onClick={() => {
            if (typeof handleConfirm === 'function') {
              handleConfirm();
            }
            handleClose();
          }}
        >
          Delete All
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
}

export default SimpleDialog;
