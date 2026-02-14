import { createTheme } from "@mui/material/styles";
import { green, blue } from '@mui/material/colors';

// Base options merged from the previous two themes. We create a base theme
// first so we can call `palette.augmentColor` when building custom colors.
const baseOptions = {
  spacing: 8,
  palette: {
    primary: { main: green[900], info: blue[600] },
    secondary: { main: '#dc004e' },
    background: {
      default: '#f4f4f4',
      paper: '#fff',
      modal: '#e7f3eb',
      header: '#e7f3eb'
    },
    text: {
      primary: '#333',
      secondary: '#555',
    },
  },
  typography: {
    fontSize: 14,
    h1: { fontSize: '2rem', fontWeight: 700 },
    h5: {
      fontSize: '1.5rem',
      '@media (max-width:600px)': { fontSize: '1.2rem' },
    },
    body1: {
      fontSize: '1rem',
      '@media (max-width:600px)': { fontSize: '0.875rem' },
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: { paper: { backgroundColor: '#e7f3eb' } },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: '16px',
          '@media (max-width:600px)': { padding: '8px' },
        },
      },
    },
    MuiTabs: { styleOverrides: { root: { minHeight: '36px' } } },
    MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          '&.Mui-focused': { backgroundColor: '#f9f9f9' },
        },
      },
    },
  },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 },
  },
};

const baseTheme = createTheme(baseOptions);

// Final consolidated theme to export
let PrimaryTheme = createTheme(baseTheme, {
  palette: {
    // Override primary/secondary from the other theme variant
    primary: { main: '#4caf50', light: '#80e27e', dark: '#087f23', contrastText: '#fff' },
    secondary: { main: '#edfdf0' },
    warning: { main: '#FFA000', dark: '#C44A4A', contrastText: '#212121' },
    action: { hover: 'rgba(76, 175, 80, 0.1)' },
    // Create a custom 'tennis' color using augmentColor from the base theme
    tennis: baseTheme.palette.augmentColor({
      color: { main: '#a34' },
      background: { main: '#7AD' },
      name: 'tennis',
    }),
  },
});

export { PrimaryTheme };