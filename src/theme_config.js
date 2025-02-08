import { createTheme } from "@mui/material/styles";
import { green, blue } from '@mui/material/colors';

const theme = createTheme({
  spacing: 8, // Default spacing multiplier
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
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h5: {
      fontSize: '1.5rem',
      '@media (max-width:600px)': {
        fontSize: '1.2rem',
      },
    },
    body1: {
      fontSize: '1rem',
      '@media (max-width:600px)': {
        fontSize: '0.875rem',
      },
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#e7f3eb", // Use your custom background color
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: '16px',
          '@media (max-width:600px)': {
            padding: '8px',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: '36px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});


let PrimaryMainTheme = createTheme({
  spacing: 8, // Default spacing multiplier
  palette: {
    primary: { main: "#4caf50" },
    secondary: { main: "#edfdf0" },
  },
  // palette: {
  //   primary: {
  //     main: green[500],
  //     light: green[200],
  //     dark: green[700],
  //     //contrastText: purple
  //   }, // Primary color
  //   success: { main: '#edfdf0' },//
  //   divider: green[300],
  //   secondary: { main: '#edfdf0' }, // Secondary color
  //   login: { main: green[700], hover: green[300], text: '#FFF' },
  //   info: { main: blue[400] },
  //   submit: { main: green[500], hover: green[300] },
  //   ochre: {
  //     main: '#E3D026',
  //     light: '#E9DB5D',
  //     dark: '#A29415',
  //     contrastText: '#242105',
  //   },
  //   background: {
  //     default: '#edfdf0',
  //     secondary: blue[50], // Secondary background color
  //     success: blue[100],
  //     paper: green[100],
  //   },
  // },
  typography: {
    fontSize: 14,
    h5: {
      fontSize: '1.5rem',
      '@media (max-width:600px)': {
        fontSize: '1.2rem',
      },
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          padding: '16px',
          '@media (max-width:600px)': {
            padding: '8px',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: '36px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff', // Apply background color globally
          '&.Mui-focused': {
            backgroundColor: '#f9f9f9', // Optional: change color when focused
          },
        },
      },
    },
  },
});
PrimaryMainTheme = createTheme(PrimaryMainTheme, {
  palette: {

    tennis: PrimaryMainTheme.palette.augmentColor({
      color: {
        main: '#a34',
      },
      background: { main: '#7AD' },
      name: 'tennis',
    }),
  }
});

export { theme, PrimaryMainTheme };