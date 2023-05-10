import { ChangeEvent, useState } from 'react';
import './App.css';
import { VoskServiceConfig, VoskService } from './services/VoskService';
import EndPoints from './services/endpoint';
import { SocketStatus } from './constants/constants';
import { BsFillPauseFill, BsMicFill, BsFillStopFill, BsFillTrashFill } from 'react-icons/bs';

function App() {
  const [partialText, setPartialText] = useState('');
  const [resultText, setResultText] = useState('');
  const [socketStatus, setSocketStatus] = useState<string>(SocketStatus.START);
  const [isReadOnly, setIsReadOnly] = useState<boolean>();
  const [isVoskServiceRunning, setIsVoskServiceRunning] = useState<boolean>(false);

  const voskServiceConfig: VoskServiceConfig = {
    server: EndPoints.SOCKET_BASE_URL,

    onReadyForSpeech: () => {
      setIsVoskServiceRunning(true);
    },

    onEndOfSpeech: () => {
      setIsVoskServiceRunning(false);
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

  const voskService = new VoskService(voskServiceConfig);

  const startRecording = () => {
    setIsReadOnly(true);
    setSocketStatus(SocketStatus.LISTENING);
    setResultText('');
    setPartialText('');

    if (!voskService.isInitialized()) {
      voskService.start();
    } else if (voskService.isRunning()) {
      voskService.resume();
      setSocketStatus(SocketStatus.LISTENING);
    } else {
      voskService.pause();
      setSocketStatus(SocketStatus.PAUSE);
    }
  };

  const pauseRecording = () => {
    if (socketStatus === SocketStatus.LISTENING) {
      voskService.pause();
      setSocketStatus(SocketStatus.PAUSE);
    }
  };

  const resumeRecording = () => {
    if (!voskService.isRunning() && socketStatus === SocketStatus.PAUSE) {
      voskService.resume();
      setSocketStatus(SocketStatus.LISTENING);
    }
  };

  const stopRecording = () => {
    voskService.stop();

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
      <h4 className="info">WS Connection : {isVoskServiceRunning ? '✅' : '😴'}</h4>
    </div>
  );
}

export default App;
