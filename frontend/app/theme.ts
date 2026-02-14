import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#5c6b7a' },
    secondary: { main: '#7a6b5c' },
    background: { default: '#f7f6f4', paper: '#ffffff' },
    text: { primary: '#2d3748', secondary: '#5a6575' },
  },
  typography: {
    fontFamily: 'var(--font-inter), "Inter", system-ui, sans-serif',
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#8b9aa8' },
    secondary: { main: '#a89a8b' },
    background: { default: '#1a1c1e', paper: '#25282c' },
    text: { primary: '#e8eaed', secondary: '#9aa0a6' },
  },
  typography: {
    fontFamily: 'var(--font-inter), "Inter", system-ui, sans-serif',
  },
});

export default theme;
