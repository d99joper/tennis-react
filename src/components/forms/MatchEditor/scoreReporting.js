import React from 'react';
import { Box, Typography, Switch, FormControlLabel, IconButton } from '@mui/material';
import SetInput from './SetInput';

const ScoreReportingStep = ({
  winner,
  setWinner,
  retired,
  setRetired,
  selectedWinners,
  selectedOpponents,
  sets,
  handleSetChange,
  addSet,
  getPlayers,
  getScore,
  setErrorText,
}) => {
  return (
    <Box>
      <Typography variant="h6">Report Score</Typography>
      <FormControlLabel control={<Switch checked={winner} onChange={() => setWinner(!winner)} />} label={`${getPlayers(winner ? selectedWinners : selectedOpponents)} Won`} />
      <FormControlLabel control={<Switch checked={retired} onChange={() => setRetired(!retired)} />} label="Retired" />
      <Typography variant="body1">
        {retired ? (
          winner ? `${getPlayers(selectedWinners)} won by default.` : `${getPlayers(selectedOpponents)} won by default.`
        ) : (
          winner ? `${getPlayers(selectedWinners)} defeated ${getPlayers(selectedOpponents)}: ${getScore()}` : `${getPlayers(selectedOpponents)} defeated ${getPlayers(selectedWinners)}: ${getScore()}`
        )}
      </Typography>
      {!retired && sets.map((set, index) => (
        <SetInput key={index} value={set.value} label={`Set ${set.set}`} onChange={(newVal) => handleSetChange(index, newVal)} />
      ))}
      {sets.length < 5 && <IconButton onClick={addSet}>+ Add Set</IconButton>}
      {setErrorText && <Typography color="error">{setErrorText}</Typography>}
    </Box>
  );
};

export default ScoreReportingStep;
