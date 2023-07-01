import * as React from 'react';
import { BlockType } from '../../constants/transcription';

import { Block } from '../../types/block';

type State = {
  blocks: Block[];
};

type Action =
  | { type: 'add'; blockType: BlockType; index?: number; content?: string }
  | { type: 'remove'; index: number }
  | { type: 'reorder'; startIndex: number; endIndex: number }
  | { type: 'setContent'; index: number; content: string | null }
  | { type: 'reset' };

const defaultState: State = {
  blocks: [
    {
      id: '1',
      type: BlockType.NOTE,
      content: 'ITEM A',
    },
    {
      id: '2',
      type: BlockType.NOTE,
      content: 'ITEM B',
    },
    {
      id: '3',
      type: BlockType.NOTE,
      content: 'ITEM C',
    },
  ],
};

const localStorageData = localStorage.getItem('Blocks');

const initialState = localStorageData ? { blocks: JSON.parse(localStorageData) } : defaultState;

const reducer: React.Reducer<State, Action> = (state, action) => {
  let updatedBlocks;
  switch (action.type) {
    case 'add':
      updatedBlocks = [...state.blocks];
      const newBlock = {
        id: new Date().valueOf().toString(),
        type: action.blockType,
        content: action.content ?? '',
      };
      if (action.index) updatedBlocks.splice(action.index + 1, 0, newBlock);
      else updatedBlocks.push(newBlock);
      break;
    case 'remove':
      updatedBlocks = [...state.blocks];
      updatedBlocks.splice(action.index, 1);
      break;
    case 'reorder':
      updatedBlocks = [...state.blocks];
      const [removed] = updatedBlocks.splice(action.startIndex, 1);
      updatedBlocks.splice(action.endIndex, 0, removed);
      break;
    case 'setContent':
      updatedBlocks = [...state.blocks];
      updatedBlocks[action.index].content = action.content;
      break;
    case 'reset':
      updatedBlocks = defaultState.blocks;
      break;
    default:
      throw new Error();
  }
  localStorage.setItem('Blocks', JSON.stringify(updatedBlocks));
  return { blocks: updatedBlocks };
};

const BlockContext = React.createContext<{ blocks: Block[]; setBlocks: React.Dispatch<Action> }>({
  blocks: [],
  setBlocks: () => {},
});

const BlockProvider = ({ children }: { children: React.ReactNode }) => {
  const [{ blocks }, setBlocks] = React.useReducer(reducer, initialState);

  return <BlockContext.Provider value={{ blocks, setBlocks }}>{children}</BlockContext.Provider>;
};

export { BlockContext, BlockProvider };
