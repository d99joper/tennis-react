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
          // let ps = response.data;
          // ps.push({
          //   id: "22", // ✅ Unique ID (Ensure it matches the format of other IDs)
          //   name: "Jonas and Travis",
          //   content_object: null, // ✅ Matches structure of other participants
          //   object_id: "custom-object-id-22", // ✅ Ensure it has an object_id
          //   players: [
          //     { id: "a0ee264b-9486-49dc-908a-ee9b7d0485aa", name: "Jonas Persson" }, 
          //     { id: "14ee88ff-54cb-4910-b551-3211110e2d25", name: "Travis Carter" }
          //   ],
          //   content_type: "playerpair"
          // });
          // console.log(ps)
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
          error={error}
          helperText={error ? errorMessage : ""}
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

export default GetParticipants;
