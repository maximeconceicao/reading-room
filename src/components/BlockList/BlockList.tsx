import * as React from 'react';
import { Container, Stack } from '@mui/system';
import { styled } from '@mui/material/styles';
import Block from '../Block';
import { Droppable, Draggable, NotDraggingStyle, DraggingStyle } from 'react-beautiful-dnd';
import { BlockContext } from '../../context/BlockContext';
import { CircularProgress } from '@mui/material';
import { DroppableZone } from '../../constants/dragDrop';

const StyledStack = styled(Stack)(({}) => ({
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
  margin: `0 0 ${grid * 3}px 0`,
  // change background colour if dragging
  //background: isDragging ? 'lightgreen' : 'grey',
  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  // background: isDraggingOver ? 'lightblue' : 'lightgrey',
  // padding: grid,
  paddingTop: grid,
  width: '100%',
});

const BlockList = () => {
  const { blocks } = React.useContext(BlockContext);

  return (
    <Container sx={{ paddingBottom: '300px' }}>
      {blocks ? (
        <StyledStack direction="column" alignItems="center" justifyContent="space-between">
          <Droppable droppableId={DroppableZone.BLOCK_LIST}>
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
                        type={block.type}
                        content={block.content}
                        index={index}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </StyledStack>
      ) : (
        <CircularProgress />
      )}
    </Container>
  );
};

export default BlockList;
