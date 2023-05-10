import * as React from 'react';

import { BsPlusLg } from 'react-icons/bs';
import { RxDragHandleDots2 } from 'react-icons/rx';
import { DraggableProvidedDraggableProps, DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import BlockSelectionPopover from '../BlockSelectionPopover';
import { BlockType } from '../../constants/block';
import { BlockContext } from '../../context/BlockContext';

interface BlockProps {
  type: BlockType;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
  isDragging: boolean;
  content: string;
  innerRef: (element: HTMLElement | null) => void;
  index: number;
}

const Block = (props: BlockProps) => {
  const { type, isDragging, index } = props;

  const { setBlocks } = React.useContext(BlockContext);

  const [isHovered, setIsHovered] = React.useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  /**
   * ADD Block POPOVER MENU
   */
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleInput = (input: string | null) => {
    setBlocks({ type: 'setContent', index, content: input });
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div ref={props.innerRef} {...props.draggableProps}>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          border: 'green 1px solid',
          width: '100%',
        }}
      >
        <div
          style={{ display: 'flex', maxWidth: '740px', width: '100%' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '40px',
              height: '100%',
              color: 'red',
              opacity: isHovered && !isDragging ? '1' : '0',
              transition: 'all .2s',
            }}
          >
            <div>
              <div aria-describedby={id} style={{ cursor: 'pointer' }} onClick={(e) => handleClick(e)}>
                <BsPlusLg size={18} />{' '}
              </div>
              <BlockSelectionPopover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                blockIndex={index}
              />
            </div>
            <div {...props.dragHandleProps}>
              <RxDragHandleDots2 size={18} />
            </div>
          </div>
          <div
            style={{
              border: 'red 1px solid',
              padding: '10px',
              width: '100%',

              fontSize: type === 'title' ? '1rem' : '2rem',
            }}
            contentEditable={true}
            onBlur={(e) => handleInput(e.currentTarget.textContent)}
            suppressContentEditableWarning={true}
          >
            {props.content}
          </div>
        </div>
        <div style={{ width: '40px', height: '100%' }}></div>
      </div>
    </div>
  );
};

export default Block;
