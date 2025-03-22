import React from 'react';
import MatchEditorWizard from './MatchEditorWizard';
import useMatchEditorLogic from './useMatchEditorLogic';

const MatchEditor = (props) => {
  const matchLogic = useMatchEditorLogic(props);

  return <MatchEditorWizard matchLogic={matchLogic} onSubmit={props?.onSubmit} />;
};

export default MatchEditor;
