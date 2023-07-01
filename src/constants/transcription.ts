export const SERVER_URL = 'ws://localhost:2700';

export const WORKLET_PATH = 'worklet/resampling-audio-processor.js';
export const WORKLET_NAME = 'resampling-audio-processor';

export const INPUT_SAMPLE_RATE = 48000;
export const OUTPUT_SAMPLE_RATE = 16000;

export const ABNORMAL_CLOSE_CODE = 1006;

export const SocketStatus = {
  START: 'start',
  LISTENING: 'listening',
  PAUSE: 'pause',
};

export enum CommandKeyword {
  TITLE = 'titre',
  SUBTITLE = 'sous-titre',
  QUOTE = 'citation',
  NOTE = 'note',
}

export enum BlockType {
  TITLE = 'titre',
  SUBTITLE = 'sous-titre',
  QUOTE = 'citation',
  NOTE = 'note',
}
