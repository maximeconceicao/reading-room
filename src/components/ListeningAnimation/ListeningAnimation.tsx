import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { ThemeModeContext } from '../../context/ThemeModeContext/ThemeModeContext';

// ----------------------------------------------------------------------

const Loader = styled('div')(({ theme }) => ({
  display: 'flex',
  webkitBoxPack: 'center',
  msFlexPack: 'center',
  justifyContent: 'center',
  webkitBoxAlign: 'center',
  msFlexAlign: 'center',
  alignItems: 'center',
  height: '10px',
}));

const Dot = styled('div')(({ theme }) => ({
  display: 'inline-block',
  width: '10px',
  height: '10px',
  margin: '0px 3px',
  borderRadius: '50%',
  webkitAnimation: 'dot-pulse2 1.5s ease-in-out infinite',
  animation: 'dot-pulse 1.5s ease-in-out infinite',
  backgroundColor: theme.palette.grey[100],
  '@keyframes dot-pulse': {
    '0%': {
      webkitTransform: 'scale(0.5)',
      transform: 'scale(0.5)',
      opacity: '0.5',
    },
    '50%': {
      webkitTransform: 'scale(1)',
      transform: 'scale(1)',
      opacity: '1',
    },
    '100%': {
      webkitTransform: 'scale(0.5)',
      transform: 'scale(0.5)',
      opacity: '0.5',
    },
  },
}));

const ListeningAnimation = () => {
  const theme = useTheme();
  const colorMode = React.useContext(ThemeModeContext);

  return (
    <Loader>
      <Dot sx={{ animationDelay: '0s', WebkitAnimationDelay: '0s' }} />
      <Dot sx={{ animationDelay: '0.3s', WebkitAnimationDelay: '0.3s' }} />
      <Dot sx={{ animationDelay: '0.6s', WebkitAnimationDelay: '0.6s' }} />
      <Dot sx={{ animationDelay: '0.9s', WebkitAnimationDelay: '0.9s' }} />
      <Dot sx={{ animationDelay: '1.2s', WebkitAnimationDelay: '1.2s' }} />
    </Loader>
  );
};

export default ListeningAnimation;
