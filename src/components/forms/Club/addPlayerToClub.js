import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, TextField, Typography, Autocomplete } from '@mui/material';
import clubAPI from 'api/services/club';
import playerAPI from 'api/services/player';
import debounce from 'lodash.debounce';
import { helpers } from 'helpers';

const AddPlayerToClub = ({ club }) => {
  const [clubs, setClubs] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedClub, setSelectedClub] = useState(club || null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clubSearch, setClubSearch] = useState('');
  const [playerSearch, setPlayerSearch] = useState('');

  // Fetch clubs with filtering
  const fetchClubs = async (searchTerm) => {
    if (searchTerm.length < 3) return;
    try {
      const response = await clubAPI.getClubs({ name: searchTerm });
      setClubs(response?.data?.clubs || []);
    } catch (error) {
      console.error('Failed to fetch clubs:', error);
    }
  };

  // Fetch players with filtering
  const fetchPlayers = async (searchTerm) => {
    if (searchTerm.length < 3) return;
    try {
      const response = await playerAPI.getPlayers({ name: searchTerm });
      setPlayers(response.data.players || []);
    } catch (error) {
      console.error('Failed to fetch players:', error);
    }
  };

  // Debounced versions of the fetch functions
  const debouncedFetchClubs = useCallback(debounce(fetchClubs, 250), []);
  const debouncedFetchPlayers = useCallback(debounce(fetchPlayers, 250), []);

  // Effect to call debounced fetch for clubs
  useEffect(() => {
    debouncedFetchClubs(clubSearch);
    return debouncedFetchClubs.cancel; // Cleanup debounce on unmount
  }, [clubSearch, debouncedFetchClubs]);

  // Effect to call debounced fetch for players
  useEffect(() => {
    debouncedFetchPlayers(playerSearch);
    return debouncedFetchPlayers.cancel; // Cleanup debounce on unmount
  }, [playerSearch, debouncedFetchPlayers]);

  const handleAddPlayer = async () => {
    if (!selectedClub || !selectedPlayer) {
      alert('Please select both a club and a player.');
      return;
    }
    try {
      setLoading(true);
      await clubAPI.addPlayer(selectedClub.id, selectedPlayer.id);
      alert('Player added to club successfully.');
      setSelectedPlayer(null)
      setPlayerSearch("")
    } catch (error) {
      console.error('Failed to add player to club:', error);
      alert('Failed to add player.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {helpers.hasValue(club) ?
        <Typography>Club: {club.name}</Typography>
        : <Autocomplete
          options={clubs}
          defaultValue={clubs[0] || null}
          getOptionLabel={(option) => option.name}
          onChange={(event, value) => setSelectedClub(value)}
          inputValue={clubSearch}
          onInputChange={(event, value) => setClubSearch(value)}
          renderInput={(params) => <TextField {...params} label="Select Club" />}
          fullWidth
          margin="normal"
        />
      }
      <Autocomplete
        options={players}
        getOptionLabel={(option) => `${option.name} ${helpers.hasValue(option.location) ? '(' + option.location + ')' : ''}`}
        onChange={(event, value) => setSelectedPlayer(value)}
        inputValue={playerSearch}
        value={selectedPlayer}
        onInputChange={(event, value) => setPlayerSearch(value)}
        renderInput={(params) => <TextField {...params} label="Select Player" />}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {`${option.name} ${helpers.hasValue(option.location) ? '(' + option.location + ')' : ''}`}
          </li>
        )}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddPlayer}
        disabled={loading}
      >
        Add Player
      </Button>
    </Box>
  );
};

export default AddPlayerToClub;
