import * as React from 'react';

import { BsPlusLg } from 'react-icons/bs';
import { RxDragHandleDots2 } from 'react-icons/rx';
import { DraggableProvidedDraggableProps, DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import BlockSelectionPopover from '../BlockSelectionPopover';
import { BlockType } from '../../constants/transcription';
import { BlockContext } from '../../context/BlockContext';
import { Box } from '@mui/material';
import { Theme } from '@mui/system';

interface BlockProps {
  type: BlockType;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
  isDragging: boolean;
  content: string;
  innerRef: (element: HTMLElement | null) => void;
  index: number;
  style: React.CSSProperties;
}

const getStyleByBlockType = (blockType: BlockType) => {
  switch (blockType) {
    case BlockType.TITLE:
      return {
        fontSize: '2rem',
        fontWeight: '600',
      };
    case BlockType.SUBTITLE:
      return {
        fontSize: '1.5rem',
        fontWeight: '600',
      };
    case BlockType.NOTE:
      return {
        fontSize: '1rem',
      };
    case BlockType.QUOTE:
      return {
        fontSize: '1rem',
        fontStyle: 'italic',
      };
  }
};

const Block = (props: BlockProps) => {
  const { type, isDragging, index, style } = props;

  const { setBlocks } = React.useContext(BlockContext);

  const [isHovered, setIsHovered] = React.useState(false);

  const blockRef = React.useRef<HTMLDivElement>(null);

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
  const id = open ? 'simple-popover-' + index : undefined;

  return (
    <div ref={props.innerRef} {...props.draggableProps} style={style}>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
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
          <Box
            ref={blockRef}
            sx={{
              width: '100%',
              padding: '10px',
              borderRadius: '0px',
              backgroundColor: (theme: Theme) => theme.palette.block.background,
              ...getStyleByBlockType(type),
              opacity: isDragging ? '0.5' : '1',
            }}
            contentEditable={true}
            onBlur={(e) => handleInput(e.currentTarget.textContent)}
            suppressContentEditableWarning={true}
            data-placeholder={type.toUpperCase()}
          >
            {props.content}
          </Box>
        </div>
        <div style={{ width: '40px', height: '100%' }}></div>
      </div>
    </div>
  );
};

export default Block;
