// Editable.js
import { Box } from "@mui/material";
import React from "react";

// Component accept text, placeholder values and also pass what type of Input - input, textarea so that we can use it for styling accordingly
const Editable = ({
  text,
  type,
  placeholder,
  children,
  childRef,
  isEditing,
  ...props
}) => {

  
  return (
    <Box display="flex" width="100%" {...props}> 
      {isEditing ? (
        <Box width="100%" display="flex">
          {children}
        </Box>
      ) : (
        <Box width="100%"> 
          <span>{text || placeholder}</span>
        </Box>
      )}
    </Box>
  );
};

export {Editable};

