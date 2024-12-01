import React, { useState } from 'react';
import { Box, Container, TextField, Checkbox, FormControlLabel, MenuItem, Typography, IconButton, Chip } from '@mui/material';
import Wizard from 'components/forms/Wizard/Wizard';
import { useNavigate } from 'react-router-dom';
import { AutoCompletePlaces } from 'components/forms';
import { CiSquarePlus, CiTrash } from "react-icons/ci";

const CreateLeague = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    name: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
    maxParticipants: '',
    type: 'singles',
    isOpenRegistration: false,
    registrationOpenDate: new Date().toISOString().split('T')[0],
    restrictions: {},
  });

  const [errors, setErrors] = useState({});
  const [restrictionType, setRestrictionType] = useState('');
  const [restrictionValue, setRestrictionValue] = useState({});

  const updateFormState = (key, value) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [key]: '',
    }));
  };

  const addRestriction = () => {
    if (restrictionType && Object.keys(restrictionValue).length > 0) {
      setFormState((prev) => ({
        ...prev,
        restrictions: {
          ...prev.restrictions,
          [restrictionType]: restrictionValue,
        },
      }));
      setRestrictionType('');
      setRestrictionValue({});
    }
  };

  const removeRestriction = (key) => {
    setFormState((prev) => {
      const updatedRestrictions = { ...prev.restrictions };
      delete updatedRestrictions[key];
      return { ...prev, restrictions: updatedRestrictions };
    });
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formState.name) newErrors.name = 'League name is required.';
      if (!formState.startDate) newErrors.startDate = 'Start date is required.';
      if (!formState.endDate) newErrors.endDate = 'End date is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceChanged = (e) => {
    updateFormState('location', e.location);
    updateFormState('lat', e.lat);
    updateFormState('lng', e.lng);
  };

  const handleCreateLeague = async () => {
    try {
      // Pseudo-code for API call to create a new league
      console.log('Creating league with data:', formState);
  
      // Example API call (replace with actual API service)
      // const response = await api.createLeague(formState);
      // if (response.success) {
      //   navigate(`/league/${response.data.id}`);
      // } else {
      //   throw new Error(response.message);
      // }
  
      // For now, simulate successful creation and redirect
      navigate(`/league/12345`);
    } catch (error) {
      console.error('Error creating league:', error.message);
      setErrors((prev) => ({
        ...prev,
        apiError: 'Failed to create league. Please try again later.',
      }));
    }
  };

  
  const renderRestrictionInput = () => {
    if (restrictionType === 'gender') {
      return (
        <TextField
          select
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
                value={restrictionValue.min || ''}
                onChange={(e) => setRestrictionValue({ ...restrictionValue, min: e.target.value })}
                margin="normal"
              />
              <TextField
                label="Max Age"
                type="number"
                value={restrictionValue.max || ''}
                onChange={(e) => setRestrictionValue({ ...restrictionValue, max: e.target.value })}
                margin="normal"
              />
            </>
          ) : (
            <TextField
              label="Age"
              type="number"
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
          label="Rating"
          value={restrictionValue.value || ''}
          onChange={(e) => setRestrictionValue({ value: e.target.value })}
          margin="normal"
        />
      );
    }

    if (restrictionType === 'club') {
      return (
        <TextField
          label="Club"
          value={restrictionValue.value || ''}
          onChange={(e) => setRestrictionValue({ value: e.target.value })}
          margin="normal"
        />
      );
    }

    return null;
  };

  const steps = [
    {
      label: 'Basic Information',
      description: 'Provide the basic details about your league.',
      handleNext: () => validateStep(0),
      content: (
        <Container maxWidth="sm">
          <TextField
            label="League Name"
            fullWidth
            value={formState.name}
            onChange={(e) => updateFormState('name', e.target.value)}
            required
            margin="normal"
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            value={formState.startDate}
            onChange={(e) => updateFormState('startDate', e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
            margin="normal"
            error={!!errors.startDate}
            helperText={errors.startDate}
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            value={formState.endDate}
            onChange={(e) => updateFormState('endDate', e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
            margin="normal"
            error={!!errors.endDate}
            helperText={errors.endDate}
          />
          <AutoCompletePlaces
            onPlaceChanged={handlePlaceChanged}
            required
            error={Boolean(errors.location)}
            helperText={errors.location}
            initialCity={''}
            showGetUserLocation={true}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formState.description}
            onChange={(e) => updateFormState('description', e.target.value)}
            margin="normal"
          />
        </Container>
      ),
    },
    {
      label: 'League Settings',
      description: 'Specify the league type and participation settings.',
      content: (
        <Container maxWidth="sm">
          <TextField
            label="Max Participants"
            type="number"
            fullWidth
            value={formState.maxParticipants}
            onChange={(e) => updateFormState('maxParticipants', e.target.value)}
            margin="normal"
          />
          <TextField
            select
            label="League Type"
            fullWidth
            value={formState.type}
            onChange={(e) => updateFormState('type', e.target.value)}
            margin="normal"
          >
            <MenuItem value="singles">Singles</MenuItem>
            <MenuItem value="doubles">Doubles</MenuItem>
            <MenuItem value="teams">Teams</MenuItem>
          </TextField>
          <FormControlLabel
            control={
              <Checkbox
                checked={formState.isOpenRegistration}
                onChange={(e) => updateFormState('isOpenRegistration', e.target.checked)}
              />
            }
            label="Open Registration"
            />
            {formState.isOpenRegistration && (
              <TextField
                label="Registration Open Date"
                type="date"
                fullWidth
                value={formState.registrationOpenDate}
                onChange={(e) => updateFormState('registrationOpenDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            )}
          </Container>
        ),
      },
      {
        label: 'Restrictions',
        description: 'Define restrictions for league participants.',
        content: (
          <Container maxWidth="sm">
            <Box display="flex" gap={2} alignItems="center">
              <TextField
                select
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
              {Object.entries(formState.restrictions).map(([key, value]) => (
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
        ),
      },
    ];
  
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create New League
        </Typography>
        <Wizard
          steps={steps}
          handleSubmit={handleCreateLeague}
          submitText="Create League"
        />
      </Box>
    );
  };
  
  export default CreateLeague;
  
