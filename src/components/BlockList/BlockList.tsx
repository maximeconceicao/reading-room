import * as React from 'react';
import { Container, Stack } from '@mui/system';
import { styled } from '@mui/material/styles';
import Block from '../Block';
import { DragDropContext, Droppable, Draggable, NotDraggingStyle, DraggingStyle } from 'react-beautiful-dnd';
import { BlockType } from '../../constants/block';
import { BlockContext } from '../../context/BlockContext';
import { CircularProgress } from '@mui/material';

const StyledStack = styled(Stack)(({}) => ({
  border: 'red 1px solid',
  width: '100%',
  transition: 'all .3s, transform .3s',
}));

const grid = 8;

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
): React.CSSProperties => ({
  // some basic styles to make the items look a bit nicer
  // userSelect: 'none',
  // padding: grid * 2,
  // margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  // background: isDraggingOver ? 'lightblue' : 'lightgrey',
  // padding: grid,
  width: '100%',
});

const BlockList = () => {
  const { blocks, setBlocks } = React.useContext(BlockContext);

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    setBlocks({ type: 'reorder', startIndex: result.source.index, endIndex: result.destination.index });
  };

  console.log('ITEMs', blocks);

  return (
    <Container>
      {blocks ? (
        <StyledStack direction="column" alignItems="center" justifyContent="space-between">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                  {blocks.map((block: any, index: number) => (
                    <Draggable key={block.id} draggableId={block.id} index={index}>
                      {(provided, snapshot) => (
                        <Block
                          innerRef={provided.innerRef}
                          draggableProps={provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                          isDragging={snapshot.isDragging}
                          type={BlockType.NOTE}
                          content={block.content}
                          index={index}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </StyledStack>
      ) : (
        <CircularProgress />
      )}
    </Container>
  );
};

export default BlockList;
