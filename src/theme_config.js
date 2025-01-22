import { createTheme } from "@mui/material/styles";
import { green, blue } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: { main: "#4caf50" },
    secondary: { main: "#edfdf0" },
  },
});
let PrimaryMainTheme = createTheme({
  palette: {
    primary: {
      main: green[500],
      light: green[200],
      dark: green[700],
      //contrastText: purple
    }, // Primary color
    success: { main: '#edfdf0' },//
    divider: green[300],
    secondary: { main: '#edfdf0' }, // Secondary color
    login: { main: green[700], hover: green[300], text: '#FFF' },
    info: { main: blue[400] },
    submit: { main: green[500], hover: green[300] },
    ochre: {
      main: '#E3D026',
      light: '#E9DB5D',
      dark: '#A29415',
      contrastText: '#242105',
    },
    background: {
      default: '#edfdf0',
      secondary: blue[50], // Secondary background color
      success: blue[100],
      paper: green[100],
    },
  },
  components: {
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

export  {theme, PrimaryMainTheme};