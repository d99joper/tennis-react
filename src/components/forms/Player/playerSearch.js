import React, { useMemo, useState, useEffect } from 'react';
import { Autocomplete, TextField, Button, Box } from '@mui/material';
import { debounce } from 'lodash';
import { playerAPI } from 'api/services';
import { ProfileImage } from '../ProfileImage';
import MyModal from 'components/layout/MyModal';

// PlayerSearch component for searching and selecting players
// uses MUI Autocomplete with debounced API calls

const PlayerSearch = ({
  selectedPlayer,
  setSelectedPlayer,
  excludePlayers = [],
  preFilter = null,
  required = false,
  error = false,
  errorMessage,
  allowCreate = false,
  fromProfileId = null,
  onResults = null,
  manualSearch = false, // if true, only search when search button pressed
  searchLabel = 'Search',
  maxSelection = null, // null = unlimited, 1 = single player, 2+ = limited multiple
  ...props
}) => {
  const [players, setPlayers] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');

  // real fetch function (memoized so we can call it directly)
  const fetchPlayers = React.useCallback(async (typedValue, profileId) => {
    const name = (typedValue || '').trim();
    if (!name) {
      setPlayers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const filter = { name, ...preFilter };
      console.log('PlayerSearch filter:', filter);
      if (profileId) filter['origin-player-id'] = profileId;
      const response = await playerAPI.getPlayers(filter);
      setPlayers(response?.data?.players || []);
    } catch (error) {
      console.error('Failed to fetch players:', error);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, [preFilter]);

  // debounced wrapper for automatic searching
  const debouncedFetchPlayers = useMemo(() => debounce(fetchPlayers, 350), [fetchPlayers]);

  useEffect(() => {
    // cancel any in-flight debounced call on unmount
    return () => {
      debouncedFetchPlayers.cancel();
    };
  }, [debouncedFetchPlayers]);

  // Notify parent when players list changes (optional)
  useEffect(() => {
    if (typeof onResults === 'function') onResults(players);
  }, [players, onResults]);

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

  // When manualSearch is true, don't show results in dropdown (only send via onResults)
  const optionsList = manualSearch 
    ? []
    : (allowCreate && inputValue?.length >= 3 && filteredPlayers?.length === 0
      ? [...filteredPlayers, { id: 'new', name: `Create "${inputValue}"` }]
      : filteredPlayers);

  return (
    <>
      <Autocomplete
        fullWidth
        multiple={maxSelection !== 1}
        options={optionsList}
        noOptionsText={manualSearch ? '' : 'No options'}
        getOptionLabel={(option) => option?.name || ''}
        value={maxSelection === 1 
          ? (Array.isArray(selectedPlayer) ? selectedPlayer[0] || null : selectedPlayer || null)
          : (selectedPlayer ? (Array.isArray(selectedPlayer) ? selectedPlayer : [selectedPlayer]) : [])
        }
        inputValue={inputValue}
        clearOnBlur={false}
        open={manualSearch ? false : undefined}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.id === 'new'
              ? `"${inputValue}" doesn't exist. Create?`
              : <ProfileImage size={30} showName={true} player={option} />
            }
          </li>
        )}
        disableCloseOnSelect={maxSelection !== 1}
        onChange={(event, newValue) => {
          if (maxSelection === 1) {
            // Single selection mode
            if (newValue?.id === 'new') {
              setNewPlayerName(inputValue);
              setShowModal(true);
            } else {
              setSelectedPlayer(newValue);
              setInputValue('');
            }
          } else {
            // Multiple selection mode
            if (Array.isArray(newValue) && newValue.find(v => v?.id === 'new')) {
              setNewPlayerName(inputValue);
              setShowModal(true);
            } else {
              // Apply max selection limit if specified
              if (maxSelection && Array.isArray(newValue) && newValue.length > maxSelection) {
                return; // Don't allow more than maxSelection
              }
              setSelectedPlayer(newValue);
              setInputValue('');
            }
          }
        }}
        onInputChange={(event, newInputValue, reason) => {
          // IMPORTANT: only treat real typing as search input.
          // MUI will call this with reason='reset' on selection; sync the display text so the
          // selected player's name stays visible in the field.
          if (reason === 'input') {
              setInputValue(newInputValue);
              if (!manualSearch) debouncedFetchPlayers(newInputValue, fromProfileId);
            }

          if (reason === 'reset') {
            setInputValue(newInputValue);
          }

          if (reason === 'clear') {
            setInputValue('');
            setPlayers([]);
            setSelectedPlayer(maxSelection === 1 ? null : []);
            debouncedFetchPlayers.cancel();
          }
        }}
        loading={loading}
        renderInput={(params) => {
          const endAdornment = (
            <>
              {params.InputProps.endAdornment}
              {manualSearch && (
                <Button
                  size="small"
                  onClick={() => {
                    fetchPlayers(inputValue, fromProfileId);
                    setInputValue('');
                  }}
                  disabled={!inputValue || inputValue.trim().length === 0}
                  sx={{ ml: 1 }}
                >
                  {searchLabel}
                </Button>
              )}
            </>
          );

          return (
            <TextField
              {...params}
              label={`${props.label || 'Search for Player'} ${required ? '*' : ''}`}
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Type to search..."
              error={error}
              helperText={error ? errorMessage : ''}
              sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
              InputProps={{ ...params.InputProps, endAdornment }}
              onKeyDown={(e) => {
                if (manualSearch && e.key === 'Enter') {
                  e.preventDefault();
                  fetchPlayers(inputValue, fromProfileId);
                  setInputValue('');
                }
              }}
            />
          );
        }}
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
