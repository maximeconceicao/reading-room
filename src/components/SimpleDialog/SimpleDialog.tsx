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

type SimpleDialogProps = {
  dialogTitle: string;
  dialogContentText: string;
  isOpen: boolean;
  handleClose: () => void;
  handleConfirm?: () => void;
};

const StyledButton = styled(Button)(({ theme }) => ({
  width: '130px',
  fontWeight: 'bold',
  fontSize: '15px',
}));

function SimpleDialog(props: SimpleDialogProps) {
  const { dialogTitle, dialogContentText, isOpen, handleClose, handleConfirm } = props;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      sx={{ textAlign: 'center', margin: 'auto' }}
      PaperProps={{
        style: { borderRadius: 25 },
      }}
    >
      <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: '#212B36',
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
        <DialogContentText sx={{ wordWrap: 'break-word', fontSize: '14px' }}>{dialogContentText}</DialogContentText>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', marginBottom: 2 }}>
        <StyledButton autoFocus onClick={handleClose}>
          Cancel
        </StyledButton>
        <StyledButton
          variant="contained"
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
