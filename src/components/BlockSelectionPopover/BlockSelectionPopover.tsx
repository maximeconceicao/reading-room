import * as React from 'react';
import { Box, color, Container, Stack, styled } from '@mui/system';

import { BsQuote, BsTypeH1, BsTypeH2, BsType } from 'react-icons/bs';
import { Button, Popover, PopoverOrigin, Typography } from '@mui/material';
import { BlockType } from '../../constants/transcription';
import { IconContext } from 'react-icons';
import { BlockContext } from '../../context/BlockContext';

interface BlockSelectionPopoverProps {
  id: string | undefined;
  open: boolean;
  anchorEl: Element | ((element: Element) => Element) | null | undefined;
  onClose: () => void;
  anchorOrigin: PopoverOrigin | undefined;
  blockIndex: number;
}

const BlockSelectionPopover = (props: BlockSelectionPopoverProps) => {
  /**
   * ADD Block POPOVER MENU
   */
  const { id, open, anchorEl, onClose, anchorOrigin, blockIndex } = props;

  const { setBlocks } = React.useContext(BlockContext);

  const blockTypes = [
    {
      type: BlockType.TITLE,
      Icon: BsTypeH1,
    },
    {
      type: BlockType.SUBTITLE,
      Icon: BsTypeH2,
    },
    {
      type: BlockType.NOTE,
      Icon: BsType,
    },
    {
      type: BlockType.QUOTE,
      Icon: BsQuote,
    },
  ];

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      PaperProps={{
        style: { width: '250px' },
      }}
    >
      <Stack spacing={1} p={1} sx={{ backgroundColor: '#EEEEEE' }}>
        {blockTypes.map(({ type, Icon }, index) => (
          <Box
            p={1}
            sx={{
              display: 'flex',

              '&:hover': {
                backgroundColor: '#DFDFDF',
              },
            }}
            onClick={() => {
              setBlocks({ type: 'add', index: blockIndex, blockType: type });
              onClose();
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '3px',
                boxShadow: 'rgba(15, 15, 15, 0.1) 0px 0px 0px 1px',
                backgroundColor: '#EEEEEE',
                color: '#000000',
              }}
            >
              <IconContext.Provider value={{ size: '22' }}>
                <Icon />
              </IconContext.Provider>
            </Box>
            <Box paddingLeft={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography textTransform={'capitalize'} color="black">
                {type}
              </Typography>
            </Box>
            <Box></Box>
          </Box>
        ))}
      </Stack>
    </Popover>
  );
};

export default BlockSelectionPopover;
