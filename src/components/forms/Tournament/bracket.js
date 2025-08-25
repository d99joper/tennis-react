import React from 'react';
import { Box, Typography } from '@mui/material';

// Renders a simple tournament bracket given a bracket structure
// Expected bracket format:
// {
//   rounds: [
//     { matches: [ { player1: { name: 'A' }, player2: { name: 'B' }, winner: 'player1' }, ... ] },
//     ...
//   ]
// }
const TournamentBracket = ({ bracket }) => {
  if (!bracket || !Array.isArray(bracket.rounds) || bracket.rounds.length === 0) {
    return <Typography>No bracket available</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', overflowX: 'auto' }}>
      {bracket.rounds.map((round, roundIndex) => (
        <Box key={roundIndex} sx={{ mx: 2 }}>
          <Typography variant="h6" gutterBottom>
            Round {roundIndex + 1}
          </Typography>
          {round.matches && round.matches.map((match, matchIndex) => (
            <Box
              key={matchIndex}
              sx={{ border: '1px solid', borderColor: 'divider', p: 1, mb: 2, minWidth: 120 }}
            >
              <Typography>{match.player1?.name || 'TBD'}</Typography>
              <Typography variant="body2" color="text.secondary">
                vs
              </Typography>
              <Typography>{match.player2?.name || 'TBD'}</Typography>
              {match.winner && (
                <Typography variant="caption" color="primary">
                  Winner: {match.winner === 'player1' ? match.player1?.name : match.player2?.name}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default TournamentBracket;
