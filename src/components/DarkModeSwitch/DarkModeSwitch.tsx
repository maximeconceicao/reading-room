import * as React from 'react';
import { styled } from '@mui/material/styles';
import { HiSun, HiMoon } from 'react-icons/hi';
import { ThemeModeContext } from '../../context/ThemeModeContext/ThemeModeContext';

// ----------------------------------------------------------------------

const StyledButton = styled('button')(() => ({
  position: 'absolute',
  width: '48px',
  height: '24px',
  padding: '0px',
  border: '0px',
  borderRadius: '24px',
  borderStyle: 'none',
  transition: 'background .3s',
}));

const switchIconStyle = {
  position: 'absolute',
  top: '20%',
  width: '14px',
  height: '14px',
} as React.CSSProperties;

const StyledRound = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '10.3%',
  left: '5.5%',
  width: '19px',
  height: '19px',
  borderRadius: '50%',
  background: 'white',
  transition: 'all .3s, transform .3s',
}));

const DarkModeSwitch = () => {
  const colorMode = React.useContext(ThemeModeContext);

  return (
    <StyledButton
      onClick={() => {
        colorMode.toggleColorMode();
      }}
    >
      <StyledRound
        sx={{
          transform: (theme) => (theme.palette.mode === 'dark' ? 'translate(22.5px) scale(1.01, 1)' : 'translate(0px)'),
        }}
      />
      <HiSun style={{ ...switchIconStyle, left: '6px' }} />
      <HiMoon style={{ ...switchIconStyle, right: '6px' }} />
    </StyledButton>
  );
};

export default DarkModeSwitch;
