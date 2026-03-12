import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, IconButton, Typography, Box } from '@mui/material';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import SetInput from './SetInput';

const ScoreReportingStep_Vertical = ({ matchLogic }) => {
  return (
    <Table sx={{ minWidth: 400, maxWidth: '100%', tableLayout: 'fixed' }}>
      <TableHead>
        <TableRow>
          {/* Player Name Column */}
          <TableCell sx={{ p: 0.3, width: '100px', height: '100%' }}>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ height: 80 }}>
              <Typography variant="body2"><strong>Player</strong></Typography>
            </Box>
          </TableCell>

          {/* Dynamic Set Headers */}
          {matchLogic.sets.map((_, index) => (
            <TableCell key={index} align="center" sx={{ p: 0.3, width: '50px', height: '100%' }}>
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ height: 80 }}>
                <Typography variant="body2"><strong>Set {index + 1}</strong></Typography>
              </Box>
            </TableCell>
          ))}

          {/* Add Set Button */}
          <TableCell sx={{ p: 0.3, height: '100%' }}>
            <IconButton onClick={matchLogic.addSet} color="primary">
              <AiOutlinePlusCircle size={20} />
            </IconButton>
          </TableCell>
        </TableRow>
      </TableHead>

      {/* Table Body */}
      <TableBody>
        {/* Player Names + Set Inputs Row */}
        <TableRow>
          {/* Player Names (Centered in One Cell) */}
          <TableCell sx={{ p: 0.3, width: '100px', height: '100%' }}>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ height: 80 }}>
              <Typography variant="body2" sx={{ display: "flex", alignItems: "center", height: "50%" }}>
                {matchLogic.selectedWinners[0]?.name || "Player 1"}
              </Typography>
              <Typography variant="body2" sx={{ display: "flex", alignItems: "center", height: "50%" }}>
                {matchLogic.selectedOpponents[0]?.name || "Player 2"}
              </Typography>
            </Box>
          </TableCell>

          {/* Dynamic Set Inputs (Aligned with Players) */}
          {matchLogic.sets.map((set, index) => (
            <TableCell key={index} align="center" sx={{ p: 0.3, width: '50px', height: '100%' }}>
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ height: 80 }}>
                <SetInput
                  setIndex={index}
                  player1Score={set.player1}
                  player2Score={set.player2}
                  tiebreakScore={set.tiebreak}
                  onChange={matchLogic.handleSetChange}
                  handleBlur={matchLogic.handleBlur}
                />
              </Box>
            </TableCell>
          ))}

          {/* Empty Cell for Alignment */}
          <TableCell sx={{ height: '100%' }}>&nbsp;</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default ScoreReportingStep_Vertical;
