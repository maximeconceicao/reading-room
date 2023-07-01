import { Button, Typography } from '@mui/material';
import { Box, Stack, styled, Theme } from '@mui/system';
import * as React from 'react';
import { BsFillMicFill, BsFillTrashFill, BsSubtract } from 'react-icons/bs';
import { SimpleDialogContext } from '../../context/SimpleDialogContext';
import { useSnackbar } from 'notistack';
import { BlockContext } from '../../context/BlockContext';
import { Droppable } from 'react-beautiful-dnd';
import { DroppableZone } from '../../constants/dragDrop';
import { SERVER_URL, SocketStatus } from '../../constants/transcription';
import { TranscriptionService, TranscriptionServiceConfig } from '../../services/TranscriptionService';
import { BlockType } from '../../constants/transcription';
import ListeningAnimation from '../ListeningAnimation';
import * as Tone from 'tone';

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
  transition: 'all .3s, transform .3s',
}));

const iconColor = (theme: Theme) => {
  return theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800];
  //return theme.palette.grey[100];
};

const toolbarPulseAnimation = {
  animation: 'pulse-animation 2s 1',
  '@keyframes pulse-animation': {
    '0%': {
      border: `solid rgba(255, 255, 255, 1)`,
    },
    '100%': {
      border: `solid rgba(255, 255, 255, 0)`,
    },
  },
};

const StyledButton = styled(Button)(({ theme }) => ({
  maxWidth: '40px',
  minWidth: '40px',
  height: '40px',
  borderRadius: '50%',
  color: iconColor(theme),
  transition: 'all .3s, transform .3s',
  ':hover': { backgroundColor: 'gray' },
}));

const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const bgColor = (theme: Theme) => {
  return theme.palette.mode === 'light' ? theme.palette.grey[900] : theme.palette.grey[100];
};

const iconHover = () => {
  return {
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800],
    color: (theme: Theme) => (theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[100]),
  };
};

const StyledStack = styled(Stack)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  borderRadius: '30px',
  backgroundColor: bgColor(theme),
  transition: 'all .3s, transform .3s',
}));

const synth = new Tone.Synth({
  oscillator: {
    type: 'sine',
  },
  envelope: {
    attack: 0.2,
    decay: 0.4,
    sustain: 0.6,
    release: 1,
  },
}).toDestination();

const Toolbar = () => {
  const [isListening, setIsListening] = React.useState(false);

  const { openSimpleDialog } = React.useContext(SimpleDialogContext);

  const { enqueueSnackbar } = useSnackbar();

  const { blocks, setBlocks } = React.useContext(BlockContext);

  const [partialText, setPartialText] = React.useState('');
  const [socketStatus, setSocketStatus] = React.useState<string>(SocketStatus.START);
  const [isReadOnly, setIsReadOnly] = React.useState<boolean>();
  const [isTranscriptionServiceRunning, setIsTranscriptionServiceRunning] = React.useState<boolean>(false);

  const [isBlockBeingWritten, setIsBlockBeingWritten] = React.useState(false);

  const transcriptionServiceConfig: TranscriptionServiceConfig = {
    server: SERVER_URL,

    onReadyForSpeech: () => {
      setIsTranscriptionServiceRunning(true);
      console.log('VOSK SERVICE READY !');
    },

    onEndOfSpeech: () => {
      setIsTranscriptionServiceRunning(false);
    },

    onResults: (command: BlockType, result: string) => {
      console.log('ON RESULTS : ', result, command);
      setPartialText('');
      // addResult(result);
      setBlocks({ type: 'add', blockType: command, content: capitalizeFirstLetter(result) });
      setIsBlockBeingWritten(false);
      const now = Tone.now();
      synth.triggerAttackRelease('D4', '8n', now);
      synth.triggerAttackRelease('G4', '8n', now + 0.1);
    },
    onCommand: (command: BlockType) => {
      console.log('ON COMMAND : ', command);
      synth.triggerAttackRelease('D4', '8n');
      setIsBlockBeingWritten(true);
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

  const copyToClipboard = () => {
    const textToCopy = convertBlocksToMarkdown();
    navigator.clipboard.writeText(textToCopy);
    enqueueSnackbar('Notes copied to Clipboard !', { variant: 'info' });
  };

  const convertBlocksToMarkdown = () => {
    let markdown = '';
    for (let block of blocks) {
      switch (block.type) {
        case BlockType.TITLE:
          markdown += '# ' + block.content + '\n\n';
          break;
        case BlockType.SUBTITLE:
          markdown += '## ' + block.content + '\n\n';
          break;
        case BlockType.NOTE:
          markdown += block.content + '\n\n';
          break;
        case BlockType.QUOTE:
          markdown += '>*' + block.content + '* \n\n';
          break;
      }
    }
    return markdown;
  };

  return (
    <StyledBox>
      <StyledStack
        direction={'column'}
        sx={{ height: isListening ? '150px' : '60px', ...(isBlockBeingWritten && toolbarPulseAnimation) }}
      >
        <Box
          sx={{
            height: isListening ? '80px' : '0px',
            paddingTop: isListening ? '0px' : '0px',
            visibility: isListening ? 'visible' : 'hidden',
            color: isListening ? 'black' : 'white',
            transition: 'all .3s',
          }}
        >
          <Box
            sx={{
              opacity: isListening ? '1' : '0',
              transition: isListening ? 'all .5s' : 'all .1s',
            }}
          >
            <Typography sx={{ marginTop: '10px', marginBottom: '15px', height: '24px', color: 'white' }}>
              {partialText ? partialText : <em>listening...</em>}
            </Typography>

            <ListeningAnimation />
          </Box>
        </Box>
        <StyledStackToolbar
          direction={'row'}
          sx={{ paddingX: isListening ? '20px' : '0px', width: isListening ? '220px' : '160px' }}
        >
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
                sx={{
                  ':hover': {
                    ...iconHover(),
                  },
                }}
              >
                <BsFillTrashFill size={18} />
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
                setPartialText('');
                resumeRecording();
              }
              setIsListening(!isListening);
            }}
            sx={{
              height: isListening ? '50px' : '40px',
              width: isListening ? '50px' : '40px',
              maxWidth: isListening ? '50px' : '40px',
              ...(isListening && {
                ...iconHover(),
              }),
              ':hover': {
                ...iconHover(),
              },
            }}
          >
            <BsFillMicFill size={18} />
          </StyledButton>
          <StyledButton
            disabled={isListening}
            onClick={() => copyToClipboard()}
            sx={{
              ':hover': {
                ...iconHover(),
              },
            }}
          >
            <BsSubtract size={18} />
          </StyledButton>
        </StyledStackToolbar>
      </StyledStack>
    </StyledBox>
  );
};

export default Toolbar;
