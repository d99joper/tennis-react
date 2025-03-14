import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, TextField, Typography, Autocomplete, Chip } from '@mui/material';
import playerAPI from 'api/services/player';
import debounce from 'lodash.debounce';
import { helpers } from 'helpers';
import { eventAPI } from 'api/services';

const AddParticipants = ({ event, callback }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const transformRestrictions = (restrictions) => {
    const filters = {};
    Object.entries(restrictions).forEach(([key, value]) => {
      console.log(key, value)
      let val;
      if(key === 'age' || key === 'club')
        val = JSON.stringify(value)
      else 
        val = value.value
      filters[key] = val;
    });
    return filters;
  };

  // Fetch players based on search and restrictions
  const fetchPlayers = async (searchTerm) => {
    if (searchTerm.length < 3) return;
    try {
      setLoading(true);
      const filters = { name: searchTerm, ...transformRestrictions(event.restrictions) };
      const response = await playerAPI.getPlayers(filters);
      setPlayers(response.data.players || []);
    } catch (error) {
      console.error('Failed to fetch players:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce the API call
  const debouncedFetchPlayers = useCallback(debounce(fetchPlayers, 250), []);

  useEffect(() => {
    debouncedFetchPlayers(search);
    return debouncedFetchPlayers.cancel;
  }, [search, debouncedFetchPlayers]);

  const handleAddParticipant = async () => {
    if (selectedPlayers.length === 0) {
      alert('Please select at least one player.');
      return;
    }

    try {
      for (const player of selectedPlayers) {
        let result = await eventAPI.addParticipant(event.id, {id: player.id, type:'player'});
        if(result.error) {
          setError(result.error);
          setLoading(false);
          return
        }
      }
      setMessage('Participant(s) added successfully.');
      setSelectedPlayers([]);
      setSearch('')
      setError('')
      if(callback) callback()
    } catch (error) {
      console.error('Failed to add participants:', error);
      setError('Error adding participants.');
      setMessage('');
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5">Add Participants</Typography>
      <Autocomplete
        multiple={event.type === 'doubles'}
        //multiple
        options={players}
        getOptionLabel={(option) => option.name}
        onChange={(event, value) => {
          setSelectedPlayers(Array.isArray(value) ? value : value ? [value] : []);
        }}
        inputValue={search}
        onInputChange={(event, value) => setSearch(value)}
        renderInput={(params) => <TextField {...params} label="Search Players" />}
        fullWidth
        margin="normal"
        loading={loading}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {`${option.name} ${helpers.hasValue(option.location) ? '(' + option.location + ')' : ''}`}
          </li>
        )}
      />
      <Box mt={2}  >
        {Array.isArray(selectedPlayers) && selectedPlayers.map((player) => (
          <Chip
            key={player.id}
            label={player.name}
            onDelete={() => setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id))}
          />
        ))}
      </Box>
      <Box>
        <span className="error">{error}</span>
        {message}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddParticipant}
        //disabled={loading || (league.type === 'doubles' && selectedPlayers.length !== 2)}
      >
        {event.type === 'doubles' ? 'Add Pair' : 'Add Participant'}
      </Button>
    </Box>
  );
};

export default AddParticipants;
