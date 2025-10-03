import React, { useState, useEffect, useRef } from 'react';
import { Autocomplete, TextField, CircularProgress, Button, Box } from '@mui/material';
import { debounce } from 'lodash';
import { playerAPI } from 'api/services';
import { helpers } from 'helpers';
import { ProfileImage } from '../ProfileImage';
import MyModal from 'components/layout/MyModal';

const PlayerSearch = ({
  selectedPlayer,
  setSelectedPlayer,
  excludePlayers = [],
  required = false,
  error = false,
  errorMessage,
  allowCreate = false,
  fromProfileId = null,
  ...props
}) => {
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const debounceRef = useRef(null);

  // Fetch players dynamically
  const fetchPlayers = async (strName = '') => {
    setLoading(true);
    try {
      const filter = helpers.hasValue(strName) ? { 'name': strName } : {};
      // if this comes from a profile id, add that as a origin_player_id for the filter
      console.log('fromProfileId', fromProfileId)
      if (fromProfileId) filter['origin-player-id'] = fromProfileId;
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

  const handleCreatePlayer = async () => {
    try {
      const email = `${newPlayerName.replace(/\s/g, ".")}@mytennis.space`
      const newPlayer = await playerAPI.createPlayer({
        name: newPlayerName,
        username: email,
        email: email
      });
      if (newPlayer && newPlayer.id) {
        //console.log("Updated Players List:", [...players, newPlayer]);
        setPlayers(prev => [...prev, newPlayer])
        setSelectedPlayer(newPlayer);
        setShowModal(false);
      }
      else console.error('invalid player object', newPlayer)
    } catch (error) {
      console.error("Error creating player:", error);
    }
  };

  const filteredPlayers = (players || [])
    .filter(p => p?.id) // Ensure player is defined and has an id
    .filter(p => !excludePlayers.some(excluded => excluded?.id === p.id));

  const optionsList = allowCreate && searchTerm?.length >= 3 && filteredPlayers?.length === 0
    ? [...filteredPlayers, { id: 'new', name: `Create "${searchTerm}"` }]
    : filteredPlayers;

  return (
    <>
      <Autocomplete
        fullWidth
        multiple={true}
        options={optionsList}
        getOptionLabel={(option) => option?.name || ''}
        value={selectedPlayer ? (Array.isArray(selectedPlayer) ? selectedPlayer : [selectedPlayer]) : []}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.id === 'new'
              ? `"${searchTerm}" doesn't exist. Create?`
              : <ProfileImage size={30} showName={true} player={option} />
            }
          </li>
        )}
        disableCloseOnSelect={false}
        onChange={(event, newValue) => {
          if (Array.isArray(newValue) && newValue.find(v => v?.id === 'new')) {
            setNewPlayerName(searchTerm);
            setShowModal(true);
          } else {
            setSelectedPlayer(newValue);
          }
        }}
        onClose={() => setSearchTerm('')}
        onInputChange={(event, newInputValue, reason) => {
          if (reason === 'clear') setSelectedPlayer([])
          setSearchTerm(newInputValue);
          if (newInputValue === '') setSelectedPlayer([]); // ✅ Reset to empty array when cleared
        }}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label={`${props.label || "Search for Player"} ${required ? '*' : ''}`}
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Type to search..."
            error={error}
            helperText={error ? errorMessage : ""}
            sx={{ 
              '& .MuiInputLabel-root': {
                fontSize: '0.875rem'
              }
            }}
          />
        )}
      />
      <MyModal showHide={showModal} onClose={() => setShowModal(false)} title="Create New Player">
        <Box sx={{ p: 2, display: 'flex', gap: 1, flexDirection: 'column' }}>
          <TextField
            label="Player Name"
            fullWidth
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
          />
          <Button variant="contained" onClick={handleCreatePlayer}>Create</Button>
        </Box>
      </MyModal>
    </>
  );
};

export default PlayerSearch;
