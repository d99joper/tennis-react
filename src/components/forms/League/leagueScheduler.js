import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  CircularProgress,
  MenuItem,
  Select,
  Button,
} from '@mui/material';
import usePaginatedParticipants from 'helpers/usePaginatedParticipants';

const LeagueScheduler = ({ event, setSchedule }) => {
  const [localSchedule, setLocalSchedule] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { participants, loadMore, loading } = usePaginatedParticipants(event.league_id);
  const [allParticipants, setAllParticipants] = useState([]);

  // Extract existing participants from the schedule
  useEffect(() => {
    if (Array.isArray(event.league_schedule)) {
      setLocalSchedule(event.league_schedule);

      const extractedParticipants = new Map();
      event.league_schedule.forEach((match) => {
        [match.player1, match.player2].forEach((player) => {
          if (player?.id) extractedParticipants.set(player.id, player);
        });
      });
      setAllParticipants(Array.from(extractedParticipants.values()));
    }
  }, [event.league_schedule]);

  // Merge fetched participants with existing ones
  useEffect(() => {
    const mergedParticipants = new Map();
    allParticipants.forEach((p) => mergedParticipants.set(p.id, p));
    participants.forEach((p) => mergedParticipants.set(p.id, p));
    setAllParticipants(Array.from(mergedParticipants.values()));
  }, [participants]);

  const handlePlayerChange = (index, key, playerId) => {
    const selectedPlayer = allParticipants.find((p) => p.id === playerId);
    const updatedSchedule = [...localSchedule];
    updatedSchedule[index][key] = selectedPlayer;
    setLocalSchedule(updatedSchedule);
  };

  const handleDateChange = (index, newDate) => {
    const updatedSchedule = [...localSchedule];
    updatedSchedule[index].scheduled_date = newDate;
    setLocalSchedule(updatedSchedule);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length >= 2) {
      loadMore(value); // Fetch additional participants based on input
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Schedule Management
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Round</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Match</TableCell>
              <TableCell>Result</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {localSchedule.map((match, index) => {
              // Filter player options for each dropdown
              const player1Options = allParticipants.filter(
                (player) => player.id !== match.player2?.id
              );
              const player2Options = allParticipants.filter(
                (player) => player.id !== match.player1?.id
              );

              return (
                <TableRow key={index}>
                  <TableCell>Round {match.round}</TableCell>
                  <TableCell>
                    <TextField
                      type="date"
                      value={match.scheduled_date || ''}
                      onChange={(e) => handleDateChange(index, e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={match.player1?.id || ''}
                      onChange={(e) => handlePlayerChange(index, 'player1', e.target.value)}
                      displayEmpty
                      fullWidth
                    >
                      <MenuItem value="" disabled>
                        Select Player 1
                      </MenuItem>
                      {player1Options.map((player) => (
                        <MenuItem key={player.id} value={player.id}>
                          {player.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <Typography variant="body1" sx={{ mx: 1 }}>
                      vs
                    </Typography>
                    <Select
                      value={match.player2?.id || ''}
                      onChange={(e) => handlePlayerChange(index, 'player2', e.target.value)}
                      displayEmpty
                      fullWidth
                    >
                      <MenuItem value="" disabled>
                        Select Player 2
                      </MenuItem>
                      {player2Options.map((player) => (
                        <MenuItem key={player.id} value={player.id}>
                          {player.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>{match.result || 'N/A'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2 }}>
        <TextField
          label="Search Participants"
          value={searchTerm}
          onChange={handleInputChange}
          fullWidth
          placeholder="Type to search for participants"
          InputProps={{
            endAdornment: loading ? <CircularProgress size={20} /> : null,
          }}
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">Type to dynamically add more participants.</Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setSchedule(localSchedule)}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default LeagueScheduler;
