import { createTheme } from "@mui/material/styles";

// Helper function to create a theme with specific colors
const createTennisTheme = (config) => {
  const { 
    primary, 
    secondary, 
    background = { default: '#fafafa', paper: '#fff', modal: '#fff', header: '#f5f5f5' },
    themeName 
  } = config;

  const baseOptions = {
    spacing: 8,
    palette: {
      primary,
      secondary,
      background,
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
        styleOverrides: { paper: { backgroundColor: background.modal } },
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

  return createTheme(baseTheme, {
    palette: {
      primary,
      secondary,
      warning: { main: '#FFA000', dark: '#C44A4A', contrastText: '#212121' },
      action: { hover: `rgba(${parseInt(primary.main.slice(1, 3), 16)}, ${parseInt(primary.main.slice(3, 5), 16)}, ${parseInt(primary.main.slice(5, 7), 16)}, 0.1)` },
      tennis: baseTheme.palette.augmentColor({
        color: { main: '#a34' },
        background: { main: '#7AD' },
        name: 'tennis',
      }),
    },
    name: themeName,
  });
};

// Theme Configurations
export const themes = {
  // Improved Green theme with better contrast
  classic: createTennisTheme({
    themeName: 'Tennis Classic',
    primary: { main: '#2E7D32', light: '#60ad5e', dark: '#005005', contrastText: '#fff' },
    secondary: { main: '#43A047' },
    background: {
      default: '#f1f8f4',  // Light green tint
      paper: '#ffffff',
      modal: '#ffffff',
      header: '#e8f5e9'    // Soft green
    },
  }),

  // Navy Blue with Tennis Court Green
  navy: createTennisTheme({
    themeName: 'Navy & Court Green',
    primary: { main: '#1565C0', light: '#5e92f3', dark: '#003c8f', contrastText: '#fff' },
    secondary: { main: '#43A047' },
    background: {
      default: '#f0f4f8',  // Light blue-gray
      paper: '#ffffff',
      modal: '#ffffff',
      header: '#e3f2fd'    // Light blue
    },
  }),

  // Charcoal with Vibrant Orange
  charcoal: createTennisTheme({
    themeName: 'Modern Sport',
    primary: { main: '#37474F', light: '#62727b', dark: '#102027', contrastText: '#fff' },
    secondary: { main: '#FF6F00' },
    background: {
      default: '#f5f5f5',  // Neutral warm gray
      paper: '#ffffff',
      modal: '#ffffff',
      header: '#fafafa'    // Slightly lighter
    },
  }),

  // Wimbledon Purple & Green
  wimbledon: createTennisTheme({
    themeName: 'Wimbledon',
    primary: { main: '#5E35B1', light: '#9162e4', dark: '#280680', contrastText: '#fff' },
    secondary: { main: '#66BB6A' },
    background: {
      default: '#f9f8fc',  // Light purple tint
      paper: '#ffffff',
      modal: '#ffffff',
      header: '#f3e5f5'    // Soft purple
    },
  }),

  // Slate & Teal
  minimal: createTennisTheme({
    themeName: 'Clean Minimal',
    primary: { main: '#455A64', light: '#718792', dark: '#1c313a', contrastText: '#fff' },
    secondary: { main: '#00897B' },
    background: {
      default: '#f8f9fa',  // Cool blue-gray
      paper: '#ffffff',
      modal: '#ffffff',
      header: '#eceff1'    // Light steel blue
    },
  }),
};

// Default theme (for backwards compatibility)
export const PrimaryTheme = themes.classic;

// Export theme names for selector
export const themeNames = Object.keys(themes);