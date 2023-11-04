import { BlockType } from './../constants/transcription';
import {
  INPUT_SAMPLE_RATE,
  OUTPUT_SAMPLE_RATE,
  SERVER_URL,
  WORKLET_NAME,
  WORKLET_PATH,
  ABNORMAL_CLOSE_CODE,
  CommandKeyword,
} from '../constants/transcription';

// Extend Window with
declare global {
  interface Window {
    userSpeechAnalyser: AnalyserNode;
  }
}

export interface TranscriptionServiceConfig {
  server: string;
  onReadyForSpeech: Function;
  onEndOfSpeech: Function;
  onResults: Function;
  onCommand: Function;
  onPartialResults: Function;
  onEndOfSession?: Function;
  onEvent: Function;
  onError: Function;
}

let isPaused = false;

export class TranscriptionService {
  config: TranscriptionServiceConfig;
  isEndOfFile: boolean;
  isWsOpen: boolean;
  isBlockBeingWritten: boolean;
  lastCommand: BlockType;
  webSocket: WebSocket | null;
  audioContext: AudioContext | null;
  worklet: AudioWorkletNode | null;
  audioSource: MediaStreamAudioSourceNode | null;

  constructor(config: Partial<TranscriptionServiceConfig>) {
    this.config = {
      server: config.server || SERVER_URL,
      onReadyForSpeech: config.onReadyForSpeech || function () {},
      onEndOfSpeech: config.onEndOfSpeech || function () {},
      onResults: config.onResults || function (data: any) {},
      onCommand: config.onCommand || function (data: any) {},
      onPartialResults: config.onPartialResults || function (data: any) {},
      onEndOfSession: config.onEndOfSession || function () {},
      onEvent: config.onEvent || function (e: any, data: any) {},
      onError: config.onError || function (e: any, data: any) {},
    };
    this.isEndOfFile = false;
    this.isWsOpen = false;
    this.webSocket = null;
    this.audioContext = null;
    this.worklet = null;
    this.audioSource = null;
    this.isBlockBeingWritten = false;
    this.lastCommand = BlockType.NOTE;
  }

  async start() {
    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      console.log('Connection already established');
      return;
    }

    this.createWebSocket();

    const mediaStream = await this.authorizeMicrophoneUse();

    this.initWorker(mediaStream);

    isPaused = false;
  }

  createWebSocket() {
    this.webSocket = new WebSocket(this.config.server);
    this.webSocket.binaryType = 'arraybuffer';

    this.webSocket.onopen = (event) => {
      this.isWsOpen = true;
      console.log('New connection established');
    };

    this.webSocket.onerror = function (event) {
      console.error(event);
    };

    this.webSocket.onmessage = (message: any) => {
      const parsed = JSON.parse(message.data);
      console.log('ON MESSAGE', parsed);
      if (parsed.partial) {
        this.config.onPartialResults(_getLastThreeWords(parsed.partial));
      }
      if (parsed.result) {
        if (this.isBlockBeingWritten) {
          this.config.onResults(this.lastCommand, parsed.text);
          this.isBlockBeingWritten = false;
        } else {
          if (Object.values(CommandKeyword).includes(parsed.text)) {
            this.config.onCommand(parsed.text);
            this.lastCommand = parsed.text;
            this.isBlockBeingWritten = true;
          }
        }
      }
    };

    this.webSocket.onclose = (e) => {
      this.isWsOpen = false;
      console.log('Connection closed with code', e.code);
      if (e.code === ABNORMAL_CLOSE_CODE) {
        // Connection was closed abnormally (e.g. network error)
        this.config.onError('WebSocket error', 'Connection closed abnormally');
      } else {
        this.config.onEndOfSpeech();
      }
    };
  }

  authorizeMicrophoneUse() {
    return navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        channelCount: 1,
        sampleRate: INPUT_SAMPLE_RATE,
      },
      video: false,
    });
  }

  async initWorker(stream: MediaStream) {
    const audioTrack = stream.getAudioTracks()[0];
    const sampleRate = audioTrack.getSettings().sampleRate || INPUT_SAMPLE_RATE;

    this.audioContext = new AudioContext({ sampleRate: sampleRate });

    await this.audioContext.audioWorklet.addModule(WORKLET_PATH);

    const processorOptions = {
      inputSampleRate: sampleRate,
      outputSampleRate: OUTPUT_SAMPLE_RATE,
    };

    this.worklet = new AudioWorkletNode(this.audioContext, WORKLET_NAME, {
      channelCount: 1,
      numberOfInputs: 1,
      numberOfOutputs: 1,
      processorOptions,
    });

    this.audioSource = this.audioContext.createMediaStreamSource(stream);

    this.audioSource.connect(this.worklet);
    this.worklet.connect(this.audioContext.destination);

    this.worklet.port.onmessage = (event) => {
      if (this.webSocket && !isPaused) {
        this.webSocket.send(event.data);
        //console.log('WORKLET PORT', this.worklet.port);
      } else {
        //console.log('PORT ON MESSAGE : ', event.data);
      }
    };
    this.worklet.port.start();

    this.config.onReadyForSpeech();
  }

  isInitialized() {
    return this.isWsOpen;
  }

  isRunning() {
    return !isPaused;
  }

  pause() {
    isPaused = true;
  }

  resume() {
    isPaused = false;
  }

  stop() {
    console.log('STOP', this.isRunning());
    if (this.isRunning()) {
      this.pause();
    }
    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      console.log('CLOSE');
      this.webSocket.close();
      //this.webSocket = null;
    }
  }

  endOfFile() {
    this.pause();
    this.webSocket?.send('{"eof" : 1}');
    this.isEndOfFile = true;
  }
}

const _getLastThreeWords = (str: String) => {
  const wordsArray = str.split(' ');
  if (wordsArray.length <= 3) return str;
  const lastThreeWordsArray = wordsArray.slice(-3);
  const lastThreeWords = lastThreeWordsArray.join(' ');
  return lastThreeWords;
};
