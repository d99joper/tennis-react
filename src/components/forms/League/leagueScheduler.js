import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  MenuItem,
} from '@mui/material';
import leagueAPI from 'api/services/league';

const LeagueScheduler = ({ event, setSchedule, onSave }) => {
  const [localSchedule, setLocalSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(event)
  // Reinitialize schedule when league updates
  useEffect(() => {
    if (Array.isArray(event.league_schedule)) {
      setLocalSchedule(event.league_schedule);
    } else {
      setLocalSchedule([]);
    }
  }, [event.league_schedule]);

  const handleGenerateSchedule = async () => {
    try {
      setLoading(true);
      const data = await leagueAPI.generateSchedule(event.league_id);
      if (data?.schedule) {
        setSchedule(data.schedule);
        setLocalSchedule([...data.schedule]); // Force the state update
      } else {
        console.error('Schedule data is missing in response.');
      }
    } catch (error) {
      console.error('Failed to generate schedule:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateSchedule = async () => {
    try {
      setLoading(true);
      const data = await leagueAPI.updateSchedule(event.league_id, localSchedule);
      console.log(data)
      if (data?.schedule) {
        setSchedule(data.schedule);
        setLocalSchedule([...data.schedule]); // Force the state update
        onSave();
      } else {
        console.error('Schedule data is missing in response.');
      }
    } catch (error) {
      console.error('Failed to update schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (index, newDate) => {
    const updatedSchedule = [...localSchedule];
    updatedSchedule[index].scheduled_date = new Date(newDate).toISOString().split('T')[0];
    setLocalSchedule(updatedSchedule);
  };

  const handlePlayerChange = (index, key, playerId) => {
    const updatedSchedule = [...localSchedule];
    updatedSchedule[index][key] = {
      ...updatedSchedule[index][key],
      id: playerId,
    };
    setLocalSchedule(updatedSchedule);
  };

  // Check for reported matches to disable the button
  const hasReportedMatches = localSchedule.some((match) => match.reported === true);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Schedule Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateSchedule}
        disabled={loading || hasReportedMatches}
        sx={{ mb: 2 }}
      >
        Generate Schedule
      </Button>
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
            {localSchedule.map((match, index) => (
              <TableRow key={index}>
                <TableCell>Round {match.round}</TableCell>
                <TableCell>
                  <TextField
                    type="date"
                    value={match.scheduled_date ? new Date(match.scheduled_date).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      id="Player1"
                      select
                      label="Player 1"
                      value={match.player1?.id || ''}
                      onChange={(e) => handlePlayerChange(index, 'player1', e.target.value)}
                      fullWidth
                    >
                      {event.participants?.results
                        ?.filter((option) => option.content_object?.id !== match.player2?.id)
                        .map((option) => (
                          <MenuItem key={option.content_object.id} value={option.content_object.id}>
                            {option.content_object.name}
                          </MenuItem>
                        ))}
                    </TextField>
                    <Typography variant="body1" sx={{ mx: 1 }}>
                      vs
                    </Typography>
                    <TextField
                      id="Player2"
                      select
                      label="Player 2"
                      value={match.player2?.id || ''}
                      onChange={(e) => handlePlayerChange(index, 'player2', e.target.value)}
                      fullWidth
                    >
                      {event.participants?.restults
                        ?.filter((option) => option.content_object.id !== match.player1?.id)
                        .map((option) => (
                          <MenuItem key={option.content_object.id} value={option.content_object.id}>
                            {option.content_object.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                </TableCell>
                <TableCell>{match.result ? match.result : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleUpdateSchedule}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        Save Changes
      </Button>
    </Box>
  );
};

export default LeagueScheduler;
