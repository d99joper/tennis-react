import React, { useState } from 'react';
import { Box, Typography, Switch, FormControlLabel, IconButton, Tooltip, Dialog, DialogTitle, DialogActions, DialogContent, TextField, Button } from '@mui/material';
import SetInput from './SetInput';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import TennisTrophyIcon from 'components/icons/trophy';

const ScoreReportingStep = ({ matchLogic }) => {

  const getScoreRecap = () => {
    const p1_str = matchLogic.winner
      ? matchLogic.getPlayers(matchLogic.selectedWinners)
      : matchLogic.getPlayers(matchLogic.selectedOpponents)

    const p2_str = matchLogic.winner
      ? matchLogic.getPlayers(matchLogic.selectedOpponents)
      : matchLogic.getPlayers(matchLogic.selectedWinners)

    let score = matchLogic.getScore()
    
    return (<><strong>{p1_str}</strong> vs {p2_str} {score}</>) 
  }

  return (
    <Box>

      {/* <Box sx={{display:'flex', flexDirection:'row', alignItems:'center', pb: 2, gap:1}} > */}
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>Scoring Examples:</Typography>
      {/* <InfoPopup size={25}> */}
      <Box sx={{ ml: 2, mb: 3, mt: 0 }}>
        <Typography variant="body2">Pro Set: 8-5</Typography>
        <Typography variant="body2">Regular 3-Setter: 6-2, 4-6, 7-6(4)</Typography>
        <Typography variant="body2">3-Setter with 3rd set tiebreak: 6-2, 4-6, 1-0(2)</Typography>
      </Box>
      {/* </InfoPopup> */}
      {/* </Box> */}

      <Box display="flex" alignItems="top" gap={1} flexWrap="wrap" sx={{ mb: 2 }}>
        {matchLogic.sets.map((set, index) => {
          const games = set.value.match(/\d+/g)?.map(Number);
          const isRemovable = index === matchLogic.sets.length - 1 && matchLogic.sets.length > 1;
          let isTiebreakCandidate = false
          if (games?.length === 2)
            isTiebreakCandidate = Math.abs(games[0] - games[1]) === 1;

          return (
            <Box key={index} display="flex" alignItems="top" position="relative">
              <SetInput
                value={set.value}
                label={`Set ${index + 1}`}
                setIndex={index}
                onChange={(newVal) => matchLogic.handleSetChange(index, newVal)}
                sx={{ width: '7ch', mr: 0.3 }}
                matchLogic={matchLogic}
                isRemovable={isRemovable}
                enableTiebreakModal={true}
              />
            </Box>
          );
        })}

        {matchLogic.sets.length < 5 &&
          <Tooltip title="Add set">
            <IconButton onClick={matchLogic.addSet} color="primary">
              <AiOutlinePlusCircle size={20} />
            </IconButton>
          </Tooltip>
        }
      </Box>

      <FormControlLabel
        control={<Switch checked={matchLogic.retired} onChange={() => matchLogic.setRetired(!matchLogic.retired)} />}
        label="Opponent retired"
      />

      {matchLogic.setErrorText && <Typography color="error">{matchLogic.setErrorText}</Typography>}

      <Typography variant="body1" sx={{ pb: 2 }}>
        {getScoreRecap()}

      </Typography>
    </Box>
  );
};

export default ScoreReportingStep;
