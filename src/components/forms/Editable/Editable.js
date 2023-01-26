// Editable.js
import { Flex } from "@aws-amplify/ui-react";
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
    <Flex  {...props}>
      {isEditing ? (
        <Flex  {...props}>
          {children}
        </Flex>
      ) : (
          <span>
            {text || placeholder}
          </span>
      )}
    </Flex>
  );
};

export {Editable};

