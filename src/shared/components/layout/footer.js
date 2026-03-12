import React from "react";
import { Box, useTheme } from '@mui/material';
import './layout.css'

function Footer() {
  const theme = useTheme();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2),
        textAlign: 'center'
      }}
    >
      <small>&copy; My Tennis Space {new Date().getFullYear()}</small>
    </Box>
  );
}

export default Footer;