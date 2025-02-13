import React, { useState, useEffect, useRef } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { debounce } from 'lodash';
import { playerAPI } from 'api/services';
import { helpers } from 'helpers';
import { ProfileImage } from '../ProfileImage';

const PlayerSearch = ({
  selectedPlayer,
  setSelectedPlayer,
  excludePlayers = [],
  required = false,
  error = false, 
  errorMessage,
  ...props
}) => {
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  // Fetch players dynamically
  const fetchPlayers = async (strName = '') => {
    setLoading(true);
    try {
      const filter = helpers.hasValue(strName) ? { 'name': strName } : '';
      const response = await playerAPI.getPlayers(filter);
      setPlayers(response.data.players);
    } catch (error) {
      console.error('Failed to fetch players:', error);
    }
    setLoading(false);
  };

  // Set up debounce
  useEffect(() => {
    if (!debounceRef.current) {
      debounceRef.current = debounce(fetchPlayers, 300);
    }
    debounceRef.current(searchTerm);
  }, [searchTerm]);

  const filteredPlayers = players.filter(p => !excludePlayers.some(excluded => excluded.id === p.id));

  return (
    <Autocomplete
      fullWidth
      options={filteredPlayers}
      getOptionLabel={(option) => option?.name || ''}
      value={selectedPlayer || null}
      //key={(option) => option.id}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.type === 'player' && <ProfileImage size={30} player={option} />}
          &nbsp;{option.name}
        </li>
      )}
      onChange={(event, newValue) => setSelectedPlayer(newValue)}
      onInputChange={(event, newInputValue, reason) => {
        if(reason==='clear') setSelectedPlayer(null)
        setSearchTerm(newInputValue);
        if (newInputValue === '') setSelectedPlayer(null); // ✅ Reset when cleared
      }}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={`${props.label || "Search for Player"} ${required ? '*' : ''}`}
          fullWidth
          placeholder="Type to search..." 
          error={error} 
          helperText={error ? errorMessage : ""}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            endAdornment: {
              children: loading ? <CircularProgress size={20} /> : null,
            },
          }}
        />
      )}
    />
  );
};

export default PlayerSearch;
