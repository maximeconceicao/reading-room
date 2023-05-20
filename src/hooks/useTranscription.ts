// import * as React from 'react';
// import { BlockType } from '../constants/block';
// import {
//   ABNORMAL_CLOSE_CODE,
//   CommandKeyword,
//   INPUT_SAMPLE_RATE,
//   OUTPUT_SAMPLE_RATE,
//   SERVER_URL,
//   SocketStatus,
//   WORKLET_NAME,
//   WORKLET_PATH,
// } from '../constants/transcription';
// import { BlockContext } from '../context/BlockContext';

// import { getLastThreeWords } from '../utils/common.utils';

// export interface TranscriptionServiceConfig {
//   server: string;
//   onReadyForSpeech: Function;
//   onEndOfSpeech: Function;
//   onResults: Function;
//   onPartialResults: Function;
//   onEndOfSession?: Function;
//   onEvent: Function;
//   onError: Function;
// }
// interface UseAvailableSlotsArgs {
//   date: Date | null;
//   warehouseId: number | null | undefined;
// }

// function useTranscription(args: UseAvailableSlotsArgs) {
//   const { setBlocks } = React.useContext(BlockContext);
//   const [partialText, setPartialText] = React.useState('');
//   const [resultText, setResultText] = React.useState('');
//   const [socketStatus, setSocketStatus] = React.useState<string>(SocketStatus.START);
//   const [isReadOnly, setIsReadOnly] = React.useState<boolean>();
//   const [isWsOpen, setIsWsOpen] = React.useState<boolean>();
//   const [isTranscriptionServiceRunning, setIsTranscriptionServiceRunning] = React.useState<boolean>(false);
//   const [isBlockBeingWritten, setIsBlockBeingWritten] = React.useState<boolean>(false);

//   //const [webSocket, setWebSocket] = React.useState<WebSocket | null>(null);
//   let webSocket: WebSocket | null = null;

//   const transcriptionServiceConfig: TranscriptionServiceConfig = {
//     server: SERVER_URL,

//     onReadyForSpeech: () => {
//       setIsTranscriptionServiceRunning(true);
//       console.log('VOSK SERVICE READY !');
//     },

//     onEndOfSpeech: () => {
//       setIsTranscriptionServiceRunning(false);
//     },

//     onResults: (result: string) => {
//       console.log('ON RESULTS : ', result);
//       setPartialText('');
//       //addResult(result);
//       handleResult(result);
//     },
//     onPartialResults: (partial: any) => {
//       console.log('ON PARTIAL : ', partial);
//       setPartialText(partial);
//     },
//     onError: (code: number, data: string) => {
//       console.log('ERROR :', code, data);
//       stopRecording();
//     },
//     onEvent: (code: number, data: string) => {
//       console.log('EVENT :', code, data);
//     },
//   };

//   const handleResult = (result: string) => {
//     console.log('WTFFF', isBlockBeingWritten);
//     if (isBlockBeingWritten) {
//       console.log('IF');
//       if (Object.values(CommandKeyword).includes(result)) {
//         console.log("LET'S GO ! ", result);
//         setIsBlockBeingWritten(true);
//       }
//     } else {
//       console.log('ELSE ???');
//       setBlocks({ type: 'add', blockType: BlockType.NOTE, content: result });
//       setResultText('');
//       setIsBlockBeingWritten(false);
//     }
//   };

//   const start = async () => {
//     if (webSocket && webSocket.readyState === WebSocket.OPEN) {
//       console.log('Connection already established');
//       return;
//     }

//     createWebSocket();

//     const mediaStream = await authorizeMicrophoneUse();

//     initWorker(mediaStream);

//     isPaused = false;
//   };

//   const createWebSocket = async () => {
//     webSocket = new WebSocket(this.config.server);
//     webSocket.binaryType = 'arraybuffer';

//     webSocket.onopen = (event) => {
//       setIsWsOpen(true);
//       console.log('New connection established');
//     };

//     webSocket.onerror = (event) => {
//       console.error(event);
//     };

//     webSocket.onmessage = (message: any) => {
//       const parsed = JSON.parse(message.data);
//       console.log('ON MESSAGE', parsed);
//       if (parsed.partiinitWorkeral) {
//         this.config.onPartialResults(getLastThreeWords(parsed.partial));
//       }
//       if (parsed.result) {
//         this.config.onResults(parsed.text);
//       }
//     };

//     this.webSocket.onclose = (e) => {
//       this.isWsOpen = false;
//       console.log('Connection closed with code', e.code);
//       if (e.code === ABNORMAL_CLOSE_CODE) {
//         // Connection was closed abnormally (e.g. network error)
//         this.config.onError('WebSocket error', 'Connection closed abnormally');
//       } else {
//         this.config.onEndOfSpeech();
//       }
//     };
//   };

//   const authorizeMicrophoneUse = () => {
//     return navigator.mediaDevices.getUserMedia({
//       audio: {
//         echoCancellation: true,
//         noiseSuppression: true,
//         channelCount: 1,
//         sampleRate: INPUT_SAMPLE_RATE,
//       },
//       video: false,
//     });
//   };

//   const initWorker = async (stream: MediaStream) => {
//     const audioTrack = stream.getAudioTracks()[0];
//     const sampleRate = audioTrack.getSettings().sampleRate || INPUT_SAMPLE_RATE;

//     this.audioContext = new AudioContext({ sampleRate: sampleRate });

//     await this.audioContext.audioWorklet.addModule(WORKLET_PATH);

//     const processorOptions = {
//       inputSampleRate: sampleRate,
//       outputSampleRate: OUTPUT_SAMPLE_RATE,
//     };

//     this.worklet = new AudioWorkletNode(this.audioContext, WORKLET_NAME, {
//       channelCount: 1,
//       numberOfInputs: 1,
//       numberOfOutputs: 1,
//       processorOptions,
//     });

//     this.audioSource = this.audioContext.createMediaStreamSource(stream);

//     this.audioSource.connect(this.worklet);
//     this.worklet.connect(this.audioContext.destination);

//     this.worklet.port.onmessage = (event) => {
//       if (this.webSocket && !isPaused) {
//         this.webSocket.send(event.data);
//         //console.log('WORKLET PORT', this.worklet.port);
//       } else {
//         //console.log('PORT ON MESSAGE : ', event.data);
//       }
//     };
//     this.worklet.port.start();

//     this.config.onReadyForSpeech();
//   };

//   const isInitialized = () => {
//     return this.isWsOpen;
//   };

//   const isRunning = () => {
//     return !isPaused;
//   };

//   const pause = () => {
//     isPaused = true;
//   };

//   const resume = () => {
//     isPaused = false;
//   };

//   const stop = () => {
//     console.log('STOP', this.isRunning());
//     if (this.isRunning()) {
//       this.pause();
//     }
//     if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
//       console.log('CLOSE');
//       this.webSocket.close();
//       //this.webSocket = null;
//     }
//   };

//   const endOfFile = () => {
//     pause();
//     this.webSocket?.send('{"eof" : 1}');
//     this.isEndOfFile = true;
//   };

//   return { start, pause, resume, stop };
// }

// export default useTranscription;
