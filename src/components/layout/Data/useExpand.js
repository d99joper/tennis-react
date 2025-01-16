import { useState } from "react";

const useExpand = () => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return [expanded, toggleExpand];
};

export default useExpand;
