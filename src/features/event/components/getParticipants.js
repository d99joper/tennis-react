import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { eventAPI } from 'api/services';

const GetParticipants = ({
  eventId,
  selectedParticipant,
  setSelectedParticipant,
  setParticipantPlayers,
  excludeParticipants = [],
  label = "Select Participants",
  required = false,
  error = false,
  errorMessage = "Required"
}) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (eventId) {
      setLoading(true);
      eventAPI.getParticipants(eventId, null, 0)
        .then(response => {
          setParticipants(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Failed to fetch event participants:', error);
          setLoading(false);
        });
    }
  }, [eventId]);

  const filteredParticipants = participants.filter(p => !excludeParticipants.some(excluded => excluded?.id === p?.id));

  return (
    <Autocomplete
      fullWidth
      options={filteredParticipants}
      getOptionLabel={(option) => option?.name || ''}
      value={selectedParticipant}
      onChange={(event, newValue) => {
        console.log(newValue)
        setSelectedParticipant(newValue);
        setParticipantPlayers(newValue?.players ?? []);
      }}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={required ? `${label} *` : label}
          fullWidth
          size="small"
          variant="outlined"
          error={error}
          helperText={error ? errorMessage : ""}
          slotProps={{
            endAdornment: {
              children: loading ? <CircularProgress size={20} /> : null,
            },
          }}
          sx={{ 
            '& .MuiInputLabel-root': {
              fontSize: '0.875rem'
            }
          }}
        />
      )}
    />
  );
};

export default GetParticipants;
