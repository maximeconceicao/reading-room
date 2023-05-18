import { ChangeEvent, useState } from 'react';
import './App.css';
import { SpeechToTextServiceConfig, SpeechToTextService } from './services/SpeechToTextService';
import EndPoints from './services/endpoint';
import { SocketStatus } from './constants/speechToText';
import { BsFillPauseFill, BsMicFill, BsFillStopFill, BsFillTrashFill } from 'react-icons/bs';

function App() {
  const [partialText, setPartialText] = useState('');
  const [resultText, setResultText] = useState('');
  const [socketStatus, setSocketStatus] = useState<string>(SocketStatus.START);
  const [isReadOnly, setIsReadOnly] = useState<boolean>();
  const [isSpeechToTextServiceRunning, setIsSpeechToTextServiceRunning] = useState<boolean>(false);

  const speechToTextServiceConfig: SpeechToTextServiceConfig = {
    server: EndPoints.SOCKET_BASE_URL,

    onReadyForSpeech: () => {
      setIsSpeechToTextServiceRunning(true);
    },

    onEndOfSpeech: () => {
      setIsSpeechToTextServiceRunning(false);
    },

    onResults: (result: string) => {
      console.log('ON RESULTS : ', result);
      setPartialText('');
      addResult(result);
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

  const speechToTextService = new SpeechToTextService(speechToTextServiceConfig);

  const startRecording = () => {
    setIsReadOnly(true);
    setSocketStatus(SocketStatus.LISTENING);
    setResultText('');
    setPartialText('');

    if (!speechToTextService.isInitialized()) {
      speechToTextService.start();
    } else if (speechToTextService.isRunning()) {
      speechToTextService.resume();
      setSocketStatus(SocketStatus.LISTENING);
    } else {
      speechToTextService.pause();
      setSocketStatus(SocketStatus.PAUSE);
    }
  };

  const pauseRecording = () => {
    if (socketStatus === SocketStatus.LISTENING) {
      speechToTextService.pause();
      setSocketStatus(SocketStatus.PAUSE);
    }
  };

  const resumeRecording = () => {
    if (!speechToTextService.isRunning() && socketStatus === SocketStatus.PAUSE) {
      speechToTextService.resume();
      setSocketStatus(SocketStatus.LISTENING);
    }
  };

  const stopRecording = () => {
    speechToTextService.stop();

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

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement;
    setResultText(target.value);
  };

  return (
    <div className="App">
      <h1 style={{ marginBottom: '15px' }}>Vosk Client</h1>
      <div className={getStatusDotClasses()}>
        {socketStatus === SocketStatus.LISTENING && <div className="pulse-ring"></div>}
      </div>
      <div style={{ height: '10px' }}>
        <p style={{ margin: '10px' }} className="info">
          {partialText}
        </p>
      </div>
      <div className="card">
        <div style={{ paddingBottom: '20px', textAlign: 'left' }}>
          <label>Transcribed text :</label>
          <textarea
            id="story"
            name="story"
            value={resultText}
            readOnly={isReadOnly}
            onChange={(e) => handleChange(e)}
            rows={5}
            style={{ display: 'block', minWidth: '500px', height: '200px' }}
          >
            It was a dark and stormy night...
          </textarea>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <button
            onClick={() => {
              if (socketStatus === SocketStatus.START) {
                startRecording();
              }
              if (socketStatus === SocketStatus.PAUSE) {
                resumeRecording();
              }
            }}
          >
            <BsMicFill />
          </button>
          <button onClick={() => pauseRecording()}>
            <BsFillPauseFill />
          </button>
          <button onClick={() => stopRecording()}>
            <BsFillStopFill />
          </button>
          <button onClick={() => clearResults()}>
            <BsFillTrashFill />
          </button>
        </div>
      </div>
      <h4 className="info">WS Connection : {isSpeechToTextServiceRunning ? '✅' : '😴'}</h4>
    </div>
  );
}

export default App;
