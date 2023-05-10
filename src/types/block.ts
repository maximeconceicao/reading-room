import { BlockType } from '../constants/block';

export type Block = {
  id: string;
  type: BlockType;
  content: string | null;
};
