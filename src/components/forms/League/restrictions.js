import React, { useState } from 'react';
import { Box, Container, TextField, MenuItem, IconButton, Chip } from '@mui/material';
import { CiSquarePlus, CiTrash } from "react-icons/ci";

const EventRestrictions = ({ restrictions, updateRestrictions }) => {
  const [restrictionType, setRestrictionType] = useState('');
  const [restrictionValue, setRestrictionValue] = useState({});

  const addRestriction = () => {
    if (restrictionType && Object.keys(restrictionValue).length > 0) {
      const newRestrictions = {
        ...restrictions,
        [restrictionType]: restrictionValue,
      };
      updateRestrictions(newRestrictions);
      setRestrictionType('');
      setRestrictionValue({});
    }
  };

  const removeRestriction = (key) => {
    const updatedRestrictions = { ...restrictions };
    delete updatedRestrictions[key];
    updateRestrictions(updatedRestrictions);
  };

  const renderRestrictionInput = () => {
    if (restrictionType === 'gender') {
      return (
        <TextField
          select
          fullWidth
          label="Gender"
          value={restrictionValue.value || ''}
          onChange={(e) => setRestrictionValue({ value: e.target.value })}
          margin="normal"
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
        </TextField>
      );
    }

    if (restrictionType === 'age') {
      return (
        <Box display="flex" gap={2}>
          <TextField
            select
            fullWidth
            label="Age Restriction"
            value={restrictionValue.type || ''}
            onChange={(e) => setRestrictionValue({ ...restrictionValue, type: e.target.value })}
            margin="normal"
          >
            <MenuItem value="over">Over</MenuItem>
            <MenuItem value="under">Under</MenuItem>
            <MenuItem value="between">Between</MenuItem>
          </TextField>
          {restrictionValue.type === 'between' ? (
            <>
              <TextField
                label="Min Age"
                type="number"
                fullWidth
                value={restrictionValue.min || ''}
                onChange={(e) => setRestrictionValue({ ...restrictionValue, min: e.target.value })}
                margin="normal"
              />
              <TextField
                label="Max Age"
                type="number"
                fullWidth
                value={restrictionValue.max || ''}
                onChange={(e) => setRestrictionValue({ ...restrictionValue, max: e.target.value })}
                margin="normal"
              />
            </>
          ) : (
            <TextField
              label="Age"
              type="number"
              fullWidth
              value={restrictionValue.value || ''}
              onChange={(e) => setRestrictionValue({ ...restrictionValue, value: e.target.value })}
              margin="normal"
            />
          )}
        </Box>
      );
    }

    if (restrictionType === 'rating') {
      return (
        <TextField
          select
          label="Rating"
          fullWidth
          value={restrictionValue.value || ''}
          onChange={(e) => setRestrictionValue({ value: e.target.value })}
          margin="normal"
        >
          <MenuItem value="2.5">2.5</MenuItem>
          <MenuItem value="3.0">3.0</MenuItem>
          <MenuItem value="3.5">3.5</MenuItem>
          <MenuItem value="4.0">4.0</MenuItem>
          <MenuItem value="4.5">4.5</MenuItem>
          <MenuItem value="5.0">5.0</MenuItem>
          <MenuItem value="5.5">5.5</MenuItem>
        </TextField>
      );
    }

    if (restrictionType === 'club') {
      return (
        <TextField
          label="Club"
          value={restrictionValue.value || ''}
          fullWidth
          onChange={(e) => setRestrictionValue({ value: e.target.value })}
          margin="normal"
        />
      );
    }

    return null;
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" gap={2} alignItems="center">
        <TextField
          select
          fullWidth
          label="Restriction Type"
          value={restrictionType}
          onChange={(e) => setRestrictionType(e.target.value)}
          margin="normal"
        >
          <MenuItem value="gender">Gender</MenuItem>
          <MenuItem value="rating">Rating</MenuItem>
          <MenuItem value="age">Age</MenuItem>
          <MenuItem value="club">Club</MenuItem>
        </TextField>
        {renderRestrictionInput()}
        <IconButton onClick={addRestriction} color="primary">
          <CiSquarePlus />
        </IconButton>
      </Box>
      <Box mt={2}>
        {Object.entries(restrictions).map(([key, value]) => (
          <Chip
            key={key}
            label={`${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`}
            onDelete={() => removeRestriction(key)}
            deleteIcon={<CiTrash />}
            color="primary"
            sx={{ m: 0.5 }}
          />
        ))}
      </Box>
    </Container>
  );
};

export default EventRestrictions;
