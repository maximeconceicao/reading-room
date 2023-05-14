import * as React from 'react';
import Toolbar from '../Toolbar';
import { BlockContext } from '../../context/BlockContext';
import { DragDropContext } from 'react-beautiful-dnd';
import BlockList from '../BlockList';
import { DroppableZone } from '../../constants/dragDrop';

const Main = () => {
  const { setBlocks } = React.useContext(BlockContext);

  const onDragEnd = (result: any) => {
    // dropped outside the list
    console.log('ON DRAG END BLOCK LIST', result);

    if (!result.destination) {
      return;
    }

    if (result.destination.droppableId === DroppableZone.BLOCK_LIST) {
      setBlocks({ type: 'reorder', startIndex: result.source.index, endIndex: result.destination.index });
    }

    if (result.destination.droppableId === DroppableZone.TRASH) {
      setBlocks({ type: 'remove', index: result.source.index });
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <BlockList />
      <Toolbar />
    </DragDropContext>
  );
};

export default Main;
