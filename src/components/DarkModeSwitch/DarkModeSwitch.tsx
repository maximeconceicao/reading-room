import * as React from 'react';
import { styled } from '@mui/material/styles';
import { HiSun, HiMoon } from 'react-icons/hi';
import { ThemeModeContext } from '../../context/ThemeModeContext/ThemeModeContext';
import { Theme } from '@mui/system';

// ----------------------------------------------------------------------

const StyledButton = styled('button')(() => ({
  position: 'absolute',
  width: '48px',
  height: '25px',
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
  top: '12%',
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
      sx={{
        backgroundColor: (theme: Theme) => theme.palette.toggle.background,
      }}
      onClick={() => {
        colorMode.toggleColorMode();
      }}
    >
      <HiSun
        style={{
          ...switchIconStyle,
          left: '6px',
          color: '#FDFDFD',
        }}
      />
      <HiMoon style={{ ...switchIconStyle, right: '6px', color: '#191919' }} />
      <StyledRound
        sx={{
          transform: (theme: Theme) => (theme.palette.mode === 'light' ? 'translate(25px)' : 'translate(0px)'),
          backgroundColor: (theme: Theme) => theme.palette.toggle.icon,
        }}
      />
    </StyledButton>
  );
};

export default DarkModeSwitch;
