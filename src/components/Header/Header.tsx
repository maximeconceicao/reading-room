import * as React from 'react';
import { Box, Container, Stack } from '@mui/system';
import DarkModeSwitch from '../DarkModeSwitch';
import { BsBookmarkHeartFill } from 'react-icons/bs';
import { Typography } from '@mui/material';

const Header = () => {
  return (
    <Container sx={{ fontSize: '1rem' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" paddingY={2} height="70px">
        <Box sx={{ display: 'flex' }}>
          <BsBookmarkHeartFill size={32} />
          <Typography variant="h1" sx={{ width: '100px', fontSize: '1rem', fontWeight: '700' }}>
            Reading Room
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100px', height: '100%' }}>
          <DarkModeSwitch />
        </Box>
      </Stack>
    </Container>
  );
};

export default Header;
