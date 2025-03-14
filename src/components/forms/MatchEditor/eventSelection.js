import React from 'react';
import { Box, Typography, TextField, MenuItem } from '@mui/material';

const EventSelectionStep = ({ matchLogic }) => {
  return (
    <Box>
      <Typography variant="h6">Select Event</Typography>
      <TextField
        select
        label="Event"
        fullWidth
        value={matchLogic.selectedEvent?.id || 'none'}
        onChange={(e) => {
          const eventId = e.target.value;
          const selected = eventId === 'none' ? null : matchLogic.availableEvents.find(ev => ev.id === eventId);
          matchLogic.setSelectedEvent(selected);
        }}
        sx={{ mb: 2 }}
      >
        <MenuItem value="none">None (Friendly Match)</MenuItem>
        {matchLogic.availableEvents.map((ev) => (
          <MenuItem key={ev.id} value={ev.id}>{ev.name}</MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default EventSelectionStep;
