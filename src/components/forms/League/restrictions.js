import React, { useContext, useEffect, useState } from 'react';
import { Box, Container, TextField, MenuItem, IconButton, Chip, Autocomplete } from '@mui/material';
import { CiSquarePlus, CiTrash } from "react-icons/ci";
import clubAPI from 'api/services/club';
import { AuthContext } from 'contexts/AuthContext';

const EventRestrictions = ({ restrictions: parentRestrictions, updateRestrictions }) => {
  const [localRestrictions, setLocalRestrictions] = useState(parentRestrictions || {});
  const [restrictionType, setRestrictionType] = useState('');
  const [restrictionValue, setRestrictionValue] = useState({});
  const [availableClubs, setAvailableClubs] = useState([]);
  const { user } = useContext(AuthContext)

  useEffect(() => {
    setLocalRestrictions(parentRestrictions);
    console.log(localRestrictions)
  }, [parentRestrictions]);

  const fetchClubs = async () => {
    try {
      const response = await clubAPI.getClubs(`admin_id=${user.id}`);
      setAvailableClubs(response.data.clubs || []); // Ensure it's always an array
    } catch (error) {
      console.error("Error fetching clubs:", error);
      setAvailableClubs([]); // Fallback to empty array in case of failure
    }
  }

  const addRestriction = () => {
    // Ensure restriction type and values are valid before adding
    if (!restrictionType) {
      console.error("Restriction type is required.");
      return;
    }

    if (restrictionType === 'age') {
      if (!restrictionValue.type) {
        console.error("Age restriction type is required (over, under, between).");
        return;
      }

      if (restrictionValue.type === 'between') {
        if (!restrictionValue.min || !restrictionValue.max) {
          console.error("Min and Max values are required for 'between' age restrictions.");
          return;
        }
        if (parseInt(restrictionValue.min) >= parseInt(restrictionValue.max)) {
          console.error("Min value must be less than Max value for 'between' age restrictions.");
          return;
        }
      } else if (
        (restrictionValue.type === 'over' && !restrictionValue.min) ||
        (restrictionValue.type === 'under' && !restrictionValue.max)
      ) {
        console.error(`Value is required for '${restrictionValue.type}' age restriction.`);
        return;
      }
    }
    console.log(restrictionValue.value)
    const newRestrictionValue =
      restrictionType === 'club' && restrictionValue
        ? { id: restrictionValue.value.id, name: restrictionValue.value.name }
        : restrictionValue;

    // Add the restriction
    const newRestrictions = {
      ...localRestrictions,
      [restrictionType]: newRestrictionValue,
    };
    // Update local state immediately for optimistic UI
    setLocalRestrictions(newRestrictions);

    updateRestrictions(newRestrictions);
    setRestrictionType('');
    setRestrictionValue({});
  };

  const removeRestriction = (key) => {
    const updatedRestrictions = { ...localRestrictions };
    delete updatedRestrictions[key];
    // Update local state immediately for optimistic UI
    setLocalRestrictions(updatedRestrictions);

    updateRestrictions(updatedRestrictions);
  };

  const renderRestrictionLabel = (key, value) => {
    if (key === 'age') {
      let retVal = `${key}: ${value.type}`;
      if (value.type === 'between') return `${retVal} ${value.min}-${value.max}`;
      if (value.type === 'under') return `${retVal} ${value.max}`;
      if (value.type === 'over') return `${retVal} ${value.min}`;
    }
    if (key === 'club') {
      return `${key}: ${value.name}`;
    }
    if (key === 'rating') {
      return `${key}: ${value.value.toFixed(1)}`;
    }
    return `${key}: ${value.value || value || value.type || ''}`;
  };

  const renderAgeFields = () => {
    switch (restrictionValue.type) {
      case 'between':
        return (
          <>
            <TextField
              label="Min Age"
              type="number"
              fullWidth
              value={restrictionValue.min || ''}
              onChange={(e) => setRestrictionValue({ ...restrictionValue, min: e.target.value })}
              margin="normal"
              error={!restrictionValue.min}
              helperText={!restrictionValue.min ? 'Min Age is required' : ''}
            />
            <TextField
              label="Max Age"
              type="number"
              fullWidth
              value={restrictionValue.max || ''}
              onChange={(e) => setRestrictionValue({ ...restrictionValue, max: e.target.value })}
              margin="normal"
              error={!restrictionValue.max}
              helperText={!restrictionValue.max ? 'Max Age is required' : ''}
            />
          </>
        );
      case 'over':
        return (
          <TextField
            label="Min Age"
            type="number"
            fullWidth
            value={restrictionValue.min || ''}
            onChange={(e) => setRestrictionValue({ ...restrictionValue, min: e.target.value })}
            margin="normal"
            error={!restrictionValue.min}
            helperText={!restrictionValue.min ? 'Min Age is required' : ''}
          />
        );
      case 'under':
        return (
          <TextField
            label="Max Age"
            type="number"
            fullWidth
            value={restrictionValue.max || ''}
            onChange={(e) => setRestrictionValue({ ...restrictionValue, max: e.target.value })}
            margin="normal"
            error={!restrictionValue.max}
            helperText={!restrictionValue.max ? 'Max Age is required' : ''}
          />
        );
      default:
        return null;
    }
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
        <>
          <TextField
            label="Age Type"
            select
            fullWidth
            value={restrictionValue.type || ''}
            onChange={(e) => setRestrictionValue({ ...restrictionValue, type: e.target.value })}
            margin="normal"
          >
            <MenuItem value="over">Over</MenuItem>
            <MenuItem value="under">Under</MenuItem>
            <MenuItem value="between">Between</MenuItem>
          </TextField>
          {renderAgeFields()}
        </>
      )
    }

    if (restrictionType === 'rating') {
      return (
        <TextField
          select
          label="NTRP Rating"
          fullWidth
          value={restrictionValue.value || ''}
          onChange={(e) => setRestrictionValue({ value: e.target.value })}
          margin="normal"
        >
          {[2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0].map((rating) => (
            <MenuItem key={rating} value={rating}>
              {rating.toFixed(1)}
            </MenuItem>
          ))}
        </TextField>
      );
    }
    

    if (restrictionType === 'club') {
      return (
        <Autocomplete
          options={availableClubs}
          getOptionLabel={(option) => option.name}
          onChange={(e, value) => setRestrictionValue({ value })}
          renderInput={(params) => <TextField {...params} label="Club" margin="normal" fullWidth />}
          onFocus={fetchClubs}
        />
      );
    }

    return null;
  };

  return (
    <>
      <Box display="flex" gap={2}>
        <TextField
          select
          fullWidth
          label="Restriction Type"
          value={restrictionType}
          onChange={(e) => setRestrictionType(e.target.value)}
          margin="normal"
        >
          {['gender', 'rating', 'age', 'club']
            .filter((type) => !Object.keys(localRestrictions).includes(type))
            .map((type) => (
              <MenuItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </MenuItem>
            ))}
        </TextField>
        {renderRestrictionInput()}
        <IconButton onClick={addRestriction} color="primary">
          <CiSquarePlus />
        </IconButton>
      </Box>
      <Box mt={2}>
        {Object.entries(localRestrictions).map(([key, value]) => (
          <Chip
            key={key}
            label={renderRestrictionLabel(key, value)}
            onDelete={() => removeRestriction(key)}
            deleteIcon={<CiTrash />}
            color="primary"
            sx={{ m: 0.5 }}
          />
        ))}
      </Box>
    </>
  );
};

export default EventRestrictions;
