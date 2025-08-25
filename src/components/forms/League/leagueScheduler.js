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
  Autocomplete,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Popover,
  IconButton,
  Button,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid'; 
import leagueAPI from 'api/services/league';
import eventAPI from 'api/services/event';
import { CiTrash } from 'react-icons/ci';

const LeagueScheduler = ({ event, schedule, onSave }) => {
  const [localSchedule, setLocalSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [deleteMatchIndex, setDeleteMatchIndex] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newMatch, setNewMatch] = useState({
    round: '',
    player1: null,
    player2: null,
    scheduled_date: '',
  });

  // Fetch participants on mount
  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true);
      try {
        const response = await eventAPI.getParticipants(event.id, null, 0); // Fetch all participants
        setParticipants(response.data);
      } catch (error) {
        console.error('Error fetching participants:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchParticipants();
  }, [event.id]);

  useEffect(() => {
    if (Array.isArray(schedule)) {
      setLocalSchedule(schedule);
    } else {
      setLocalSchedule([]);
    }
  }, [schedule]);

  const sortSchedule = (newSchedule) => {
    return [...newSchedule].sort((a, b) => a.round - b.round);
  };

  const handleDateChange = (index, newDate) => {
    const updatedSchedule = [...localSchedule];
    updatedSchedule[index].scheduled_date = newDate;
    setLocalSchedule(updatedSchedule);
  };

  const handlePlayerChange = (index, key, player) => {
    const updatedSchedule = [...localSchedule];
    updatedSchedule[index][key] = player;
    // console.log(player)
    // console.log(updatedSchedule[index][key])
    setLocalSchedule(updatedSchedule);
  };

  const handleDeleteClick = (e, index) => {
    if (localSchedule[index].reported) {
      setDeleteMatchIndex(index);
      setAnchorEl(e.currentTarget);
    }
    else {
      const updatedSchedule = localSchedule.filter((_, i) => i !== index);
      setLocalSchedule(updatedSchedule);
      handleUpdateSchedule(updatedSchedule);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmation === 'DELETE') {
      const updatedSchedule = localSchedule.filter((_, i) => i !== deleteMatchIndex);
      setLocalSchedule(updatedSchedule);
      handleUpdateSchedule(updatedSchedule);
      handleClosePopover();
    }
  };

  const handleClosePopover = () => {
    setDeleteMatchIndex(null);
    setDeleteConfirmation('');
    setAnchorEl(null);
  };

  const handleAddMatch = () => {
    const {  round, player1, player2, scheduled_date } = newMatch;

    if (!round || !player1 || !player2 || !scheduled_date) {
      alert('Please fill in all fields.');
      return;
    }
    const updatedSchedule = sortSchedule([
      ...localSchedule, 
      { ...newMatch, id: uuidv4(), round: parseInt(newMatch.round, 10), reported: false },
    ]);
    setLocalSchedule(updatedSchedule);
    setIsDialogOpen(false);
    setNewMatch({ round: '', player1: null, player2: null, scheduled_date: '' });
    handleUpdateSchedule(updatedSchedule);
  };

  const handleUpdateSchedule = async (updatedSchedule) => {
    try {
      setLoading(true);
      const data = await leagueAPI.updateSchedule(event.league_id, updatedSchedule);
      //setSchedule(data.schedule);
      setLocalSchedule(data.schedule)
      onSave(data.schedule);
    } catch (error) {
      console.error('Failed to update schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSchedule = async () => {
    try {
      setLoading(true);
      const data = await leagueAPI.generateSchedule(event.league_id);
      setLocalSchedule(sortSchedule(data.schedule)); // Update local state
      onSave(sortSchedule(data.schedule)); // Propagate to parent state
      setIsGenerateDialogOpen(false); // Close confirmation dialog
    } catch (error) {
      console.error('Failed to generate schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasReportedMatches = localSchedule.some((match) => match.reported);

  return (
    <Box>
      <Button
        variant="contained"
        color="warning"
        onClick={() => setIsGenerateDialogOpen(true)}
        disabled={hasReportedMatches || loading}
        sx={{ mb: 2 }}
      >
        Generate New Schedule
      </Button>
      <br />
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsDialogOpen(true)}
        sx={{ mb: 2 }}
      >
        Add Match
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Round</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Match</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {localSchedule.map((match, index) => (
              <TableRow key={index}>
                <TableCell>{`Round ${match.round}`}</TableCell>
                <TableCell>
                  <TextField
                    type="date"
                    value={match.scheduled_date || ''}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Autocomplete
                    options={participants.filter(
                      (option) => option.object_id !== match.player2?.id
                    )}
                    getOptionLabel={(option) => option.name || ''}
                    value={match.player1 || null}
                    onChange={(event, value) => handlePlayerChange(index, 'player1', value?.players[0])}
                    renderInput={(params) => (
                      <TextField {...params} label="Player 1" placeholder="Search Player" />
                    )}
                  />
                  <Typography variant="body2" sx={{ mx: 1 }}>
                    vs
                  </Typography>
                  <Autocomplete
                    options={participants.filter(
                      (option) => option.object_id !== match.player1?.id
                    )}
                    getOptionLabel={(option) => option.name || ''}
                    value={match.player2 || null}
                    onChange={(event, value) => handlePlayerChange(index, 'player2', value?.players[0])}
                    renderInput={(params) => (
                      <TextField {...params} label="Player 2" placeholder="Search Player" />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => handleDeleteClick(e, index)}
                    color="error"
                  >
                    <CiTrash size={20} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box p={2}>
          <Typography variant="body1">
            Type <strong>DELETE</strong> to confirm deletion:
          </Typography>
          <TextField
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            fullWidth
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={handleClosePopover}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
              disabled={deleteConfirmation !== 'DELETE'}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Popover>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleUpdateSchedule}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        Save Changes
      </Button>

      {/* Add Match Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Add Match</DialogTitle>
        <DialogContent>
          <TextField
            label="Round"
            type="number"
            fullWidth
            value={newMatch.round}
            onChange={(e) => setNewMatch({ ...newMatch, round: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Autocomplete
            options={participants.filter(
              (option) => option.object_id !== newMatch.player2?.id
            )}
            getOptionLabel={(option) => option.name || ''}
            value={newMatch.player1}
            onChange={(event, value) => setNewMatch({ ...newMatch, player1: value.players[0] })}
            renderInput={(params) => (
              <TextField {...params} label="Player 1" placeholder="Search Player" />
            )}
            sx={{ mb: 2 }}
          />
          <Autocomplete
            options={participants.filter(
              (option) => option.object_id !== newMatch.player1?.id
            )}
            getOptionLabel={(option) => option.name || ''}
            value={newMatch.player2}
            onChange={(event, value) => setNewMatch({ ...newMatch, player2: value.players[0] })}
            renderInput={(params) => (
              <TextField {...params} label="Player 2" placeholder="Search Player" />
            )}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Scheduled Date"
            type="date"
            fullWidth
            value={newMatch.scheduled_date}
            onChange={(e) => setNewMatch({ ...newMatch, scheduled_date: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddMatch} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {/* Generate Schedule Confirmation Dialog */}
      <Dialog
        open={isGenerateDialogOpen}
        onClose={() => setIsGenerateDialogOpen(false)}
      >
        <DialogTitle>Generate New Schedule</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to generate a new schedule? This will overwrite the existing schedule.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsGenerateDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleGenerateSchedule} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeagueScheduler;
