import { BlockType } from '../constants/transcription';

export type Block = {
  id: string;
  type: BlockType;
  content: string | null;
};
