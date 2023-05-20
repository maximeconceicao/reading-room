import { Button } from '@mui/material';
import { Box, Stack, styled, Theme } from '@mui/system';
import * as React from 'react';
import { BsMic, BsTrash } from 'react-icons/bs';
import { FiCopy } from 'react-icons/fi';
import { SimpleDialogContext } from '../../context/SimpleDialogContext';
import { useSnackbar } from 'notistack';
import { BlockContext } from '../../context/BlockContext';
import { Droppable } from 'react-beautiful-dnd';
import { DroppableZone } from '../../constants/dragDrop';
import { CommandKeyword, SERVER_URL, SocketStatus } from '../../constants/transcription';
import { TranscriptionService, TranscriptionServiceConfig } from '../../services/TranscriptionService';
import { BlockType } from '../../constants/block';

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

const StyledStackToolbar = styled(Stack)(({ theme }) => ({
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'space-evenly',
  width: '220px',
  transition: 'all .3s, transform .3s',
}));

const StyledStack = styled(Stack)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
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

  const [partialText, setPartialText] = React.useState('');
  const [resultText, setResultText] = React.useState('');
  const [socketStatus, setSocketStatus] = React.useState<string>(SocketStatus.START);
  const [isReadOnly, setIsReadOnly] = React.useState<boolean>();
  const [isTranscriptionServiceRunning, setIsTranscriptionServiceRunning] = React.useState<boolean>(false);
  const [isBlockBeingWritten, setIsBlockBeingWritten] = React.useState<boolean>(false);

  React.useEffect(() => {
    console.log('ISBLOCKBEING ', isBlockBeingWritten);
  }, [isBlockBeingWritten]);

  const transcriptionServiceConfig: TranscriptionServiceConfig = {
    server: SERVER_URL,

    onReadyForSpeech: () => {
      setIsTranscriptionServiceRunning(true);
      console.log('VOSK SERVICE READY !');
    },

    onEndOfSpeech: () => {
      setIsTranscriptionServiceRunning(false);
    },

    onResults: (result: string) => {
      console.log('ON RESULTS : ', result);
      setPartialText('');
      addResult(result);
      handleResult(result);
    },
    onPartialResults: (partial: any) => {
      console.log('ON PARTIAL : ', partial);
      setPartialText(partial);
    },
    onError: (code: number, data: string) => {
      console.log('ERROR :', code, data);
      stopRecording();
    },
    onEvent: (code: number, data: string) => {
      console.log('EVENT :', code, data);
    },
  };

  const transcriptionService = new TranscriptionService(transcriptionServiceConfig);

  const startRecording = () => {
    setIsReadOnly(true);
    setSocketStatus(SocketStatus.LISTENING);
    setResultText('');
    setPartialText('');

    if (!transcriptionService.isInitialized()) {
      transcriptionService.start();
    } else if (transcriptionService.isRunning()) {
      transcriptionService.resume();
      setSocketStatus(SocketStatus.LISTENING);
    } else {
      transcriptionService.pause();
      setSocketStatus(SocketStatus.PAUSE);
    }
  };

  const pauseRecording = () => {
    if (socketStatus === SocketStatus.LISTENING) {
      transcriptionService.pause();
      setSocketStatus(SocketStatus.PAUSE);
    }
  };

  const resumeRecording = () => {
    if (!transcriptionService.isRunning() && socketStatus === SocketStatus.PAUSE) {
      transcriptionService.resume();
      setSocketStatus(SocketStatus.LISTENING);
    }
  };

  const stopRecording = () => {
    transcriptionService.stop();

    setSocketStatus(SocketStatus.START);
    setIsReadOnly(false);
  };

  const addResult = (result: string) => {
    setResultText((prevResultText) => prevResultText + ' ' + result);
  };

  const clearResults = () => {
    setResultText('');
    setPartialText('');
  };

  const getStatusInfo = () => {
    if (socketStatus === SocketStatus.START) {
      return 'Ready to start !';
    }
    if (socketStatus === SocketStatus.LISTENING) {
      return 'Listening...';
    }
    if (socketStatus === SocketStatus.PAUSE) {
      return 'Pause';
    }
  };

  const getStatusDotClasses = () => {
    let classes = 'status-dot';
    if (socketStatus !== SocketStatus.START) {
      classes += ' active';
    }
    if (socketStatus === SocketStatus.LISTENING) {
      classes += ' listening';
    }
    return classes;
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement;
    setResultText(target.value);
  };

  const handleResult = (result: string) => {
    console.log('WTFFF', isBlockBeingWritten);
    if (isBlockBeingWritten) {
      console.log('IF');
      if (Object.values(CommandKeyword).includes(result)) {
        console.log("LET'S GO ! ", result);
        setIsBlockBeingWritten(true);
      }
    } else {
      console.log('ELSE ???');
      setBlocks({ type: 'add', blockType: BlockType.NOTE, content: result });
      setResultText('');
      setIsBlockBeingWritten(false);
    }
  };

  return (
    <StyledBox>
      <StyledStack direction={'column'} sx={{ height: isListening ? '130px' : '60px' }}>
        <Box
          sx={{
            height: isListening ? '60px' : '0px',
            visibility: isListening ? 'visible' : 'hidden',
            color: isListening ? 'black' : 'white',
            transition: 'all .3s, transform .3s',
          }}
        >
          <p>{partialText}</p>
        </Box>
        <StyledStackToolbar direction={'row'} sx={{ paddingX: isListening ? '20px' : '0px' }}>
          <Droppable droppableId={DroppableZone.TRASH}>
            {(provided, snapshot) => (
              <StyledButton
                {...provided.droppableProps}
                ref={provided.innerRef}
                //style={getListStyle(snapshot.isDraggingOver)}
                disabled={isListening}
                onClick={() =>
                  openSimpleDialog(
                    '/!\\',
                    'Are you sure you want to delete all of your notes?',
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
            )}
          </Droppable>
          <StyledButton
            onClick={() => {
              if (socketStatus === SocketStatus.START) {
                startRecording();
              }
              if (socketStatus === SocketStatus.LISTENING) {
                pauseRecording();
              }
              if (socketStatus === SocketStatus.PAUSE) {
                resumeRecording();
              }
              setIsListening(!isListening);
            }}
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
            onClick={() => enqueueSnackbar('Notes copied to Clipboard !', { variant: 'info' })}
            sx={{ ':hover': { backgroundColor: (theme: Theme) => `${theme.palette.success.main}` } }}
          >
            <FiCopy />
          </StyledButton>
        </StyledStackToolbar>
      </StyledStack>
    </StyledBox>
  );
};

export default Toolbar;
