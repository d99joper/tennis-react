// Editable2.js
import React, { useState, useEffect } from "react";

// Component accept text, placeholder values and also pass what type of Input - input, textarea so that we can use it for styling accordingly
const Editable2 = ({
  text,
  type,
  placeholder,
  children,
  childRef,
  ...props
}) => {
  // Manage the state whether to show the label or the input box. By default, label will be shown.
// Exercise: It can be made dynamic by accepting initial state as props outside the component 
const [isEditing, setEditing] = useState(false);

/* 
  using use effect, when isEditing state is changing, check whether it is set to true, if true, then focus on the reference element
*/ 
useEffect(() => {
  if (childRef && childRef.current && isEditing === true) {
    childRef.current.focus();
  }
}, [isEditing, childRef]);

// Event handler while pressing any key while editing
const handleKeyDown = (event, type) => {
  const { key } = event;
    const keys = ["Escape", "Tab"];
    const enterKey = "Enter";
    const allKeys = [...keys, enterKey]; // All keys array

  /* 
    - For textarea, check only Escape and Tab key and set the state to false
    - For everything else, all three keys will set the state to false
  */
    if (
      (type === "textarea" && keys.indexOf(key) > -1) ||
      (type !== "textarea" && allKeys.indexOf(key) > -1)
    ) {
      setEditing(false);
    }
};


  
/*
- It will display a label is `isEditing` is false
- It will display the children (input or textarea) if `isEditing` is true
- when input `onBlur`, we will set the default non edit mode
Note: For simplicity purpose, I removed all the classnames, you can check the repo for CSS styles
*/
  return (
    <section {...props}>
      {isEditing ? (
        <div
          onBlur={() => setEditing(false)}
          onKeyDown={e => handleKeyDown(e, type)}
        >
          {children}
        </div>
      ) : (
        <div
          onClick={() => setEditing(true)}
        >
          <span>
            {text || placeholder || "Editable content"}
          </span>
        </div>
      )}
    </section>
  );
};

export {Editable2};

// example usage

// /* 
//   1. create a reference using use reference and add the ref={inputRef} to input element
//   2. pass this reference to the Editable component, use different name than ref, I used `childRef`. Its basically a normal prop carrying the input element reference.
// */
//   const inputRef = useRef();
//   const [task, setTask] = useState("");
// <Editable
//   text={task}
//   placeholder="Write a task name"
//   childRef={inputRef}
//   type="input"
// >
//   <input
//     ref={inputRef}
//     type="text"
//     name="task"
//     placeholder="Write a task name"
//     value={task}
//     onChange={e => setTask(e.target.value)}
//   />
// </Editable> 