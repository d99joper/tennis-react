import React, { useState, useEffect } from 'react';
import { Box, Container, TextField, Checkbox, FormControlLabel, MenuItem, Typography, IconButton, Chip } from '@mui/material';
import Wizard from 'components/forms/Wizard/Wizard';
import { useNavigate } from 'react-router-dom';
import { AutoCompletePlaces } from 'components/forms';
import { CiSquarePlus, CiTrash } from "react-icons/ci";
import leagueAPI from 'api/services/league';
import authAPI from 'api/auth';
import { helpers } from 'helpers';
import EventRestrictions from './restrictions';

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
    club: 'none',
  });

  const [errors, setErrors] = useState({});
  const [restrictionType, setRestrictionType] = useState('');
  const [restrictionValue, setRestrictionValue] = useState({});
  const [userClubs, setUserClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);

  useEffect(() => {
    const fetchUserClubs = async () => {
      try {
        const currentUser = authAPI.getCurrentUser();
        if (currentUser) {
          setUserClubs(currentUser.clubs ?? []);
          }
      }
      catch (error) {
        console.error('Failed to fetch user clubs:', error);
      } finally {
        setLoadingClubs(false);
      }
    };

    fetchUserClubs();
  }, []);

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

  // makes sure that empty strings are seen as null
  const preprocessFormData = (data) => {
    const processedData = { ...data };
    Object.keys(processedData).forEach((key) => {
      if (processedData[key] === '') {
        processedData[key] = null; // Convert empty strings to null
      }
    });
    return processedData;
  };
  
  const handleCreateLeague = async () => {
    try {
      const snakeCaseData = helpers.camelToSnake(preprocessFormData(formState))
      console.log('Creating league with data:', snakeCaseData);
      const response = await leagueAPI.createLeague(snakeCaseData);
      if (response.success) {
        navigate(`/league/${response.data.id}`);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error creating league:', error.message);
      setErrors((prev) => ({
        ...prev,
        apiError: 'Failed to create league. Please try again later.',
      }));
    }
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
            label="Hosting Club"
            select
            fullWidth
            value={formState.club}
            onChange={(e) => updateFormState('club', e.target.value)}
            margin="normal"
            disabled={userClubs.length === 0}
            helperText={
              userClubs.length === 0
                ? "You don't belong to any clubs."
                : 'Select a hosting club or choose "Not hosted by a club".'
            }
          >
            <MenuItem value="none" disabled={userClubs.length === 0}>
              Not hosted by a club
            </MenuItem>
            {userClubs.map((club) => (
              <MenuItem key={club.id} value={club.id}>
                {club.name}
              </MenuItem>
            ))}
          </TextField>
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
        <EventRestrictions
          restrictions={formState.restrictions}
          updateRestrictions={(newRestrictions) => updateFormState('restrictions', newRestrictions)}
        />
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

