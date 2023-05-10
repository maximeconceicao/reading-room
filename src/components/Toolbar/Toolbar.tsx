import { Button } from '@mui/material';
import { Box, Stack, styled, Theme } from '@mui/system';
import * as React from 'react';
import { BsMic, BsTrash } from 'react-icons/bs';
import { FiCopy } from 'react-icons/fi';
import { SimpleDialogContext } from '../../context/SimpleDialogContext';
import { useSnackbar } from 'notistack';
import { BlockContext } from '../../context/BlockContext';

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'fixed',
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'center',
  paddingBottom: '40px',
  bottom: '0',
  width: '100%',
  height: '200px',
  textAlign: 'center',
}));

const StyledStack = styled(Stack)(({ theme }) => ({
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'space-evenly',
  paddingBottom: '10px',
  width: '220px',
  borderRadius: '25px',
  backgroundColor: 'white',
  transition: 'all .3s, transform .3s',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  maxWidth: '40px',
  minWidth: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: 'black',
  color: 'white',
  transition: 'all .3s, transform .3s',
  ':hover': { backgroundColor: 'gray' },
}));

const Toolbar = () => {
  const [isListening, setIsListening] = React.useState(false);

  const { openSimpleDialog } = React.useContext(SimpleDialogContext);

  const { enqueueSnackbar } = useSnackbar();

  const { setBlocks } = React.useContext(BlockContext);

  return (
    <StyledBox>
      <StyledStack
        direction={'row'}
        sx={{ height: isListening ? '130px' : '60px', paddingX: isListening ? '20px' : '0px' }}
      >
        <StyledButton
          disabled={isListening}
          onClick={() =>
            openSimpleDialog(
              'Title !',
              'test de confirmation',
              () => {},
              () => {
                setBlocks({ type: 'reset' });
              },
            )
          }
          sx={{ ':hover': { backgroundColor: (theme: Theme) => `${theme.palette.warning.main}` } }}
        >
          <BsTrash />
        </StyledButton>
        <StyledButton
          onClick={() => setIsListening(!isListening)}
          sx={{
            height: isListening ? '50px' : '40px',
            width: isListening ? '50px' : '40px',
            maxWidth: isListening ? '50px' : '40px',
            backgroundColor: (theme: Theme) => (isListening ? `${theme.palette.info.main}` : 'black'),
            ':hover': { backgroundColor: (theme: Theme) => `${theme.palette.info.main}` },
          }}
        >
          <BsMic />
        </StyledButton>
        <StyledButton
          disabled={isListening}
          onClick={() => enqueueSnackbar('copied !', { variant: 'info' })}
          sx={{ ':hover': { backgroundColor: (theme: Theme) => `${theme.palette.success.main}` } }}
        >
          <FiCopy />
        </StyledButton>
      </StyledStack>
    </StyledBox>
  );
};

export default Toolbar;
