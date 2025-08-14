import React, { useState, useEffect, useContext } from 'react';
import { Box, Container, TextField, Checkbox, FormControlLabel, MenuItem, Typography } from '@mui/material';
import Wizard from 'components/forms/Wizard/Wizard';
import { AutoCompletePlaces, InfoPopup } from 'components/forms';
import { helpers } from 'helpers';
import EventRestrictions from './restrictions';
import clubAPI from 'api/services/club';
import { AuthContext } from 'contexts/AuthContext';
import { eventAPI } from 'api/services';

const CreateLeague = ({ club, admins, onSuccess }) => {
  const [formState, setFormState] = useState({
    name: '',
    startDate: '',
    endDate: '',
    location: club?.city?.name ||'',
    lat: club?.city?.lat ||'',
    lng: club?.city?.lng ||'',
    description: '',
    maxParticipants: '',
    match_type: 'singles',
    isOpenRegistration: false,
    registrationOpenDate: new Date().toISOString().split('T')[0],
    restrictions: {},
    club_id: club?.id || '',
    admins: admins || [],
    event_type: 'league', // Set event type explicitly
    content_object: { // Store League-specific data separately
      schedule: null
    }
  });

  const [errors, setErrors] = useState({});
  const [userClubs, setUserClubs] = useState(club ? [club] : []);
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchUserClubs = async () => {
      try {
        if (!club) {
          const results = await clubAPI.getClubs('admin_id=' + user.id)
          if (results)
            setUserClubs(results.data.clubs);
        }
      }

      catch (error) {
        console.error('Failed to fetch user clubs:', error);
      };
    }
    fetchUserClubs();
  }, []);

  const updateFormState = (key, value) => {
    if (key.startsWith('content_object.')) {
      const contentKey = key.split('.')[1];
      setFormState((prev) => ({
        ...prev,
        content_object: {
          ...prev.content_object,
          [contentKey]: value
        }
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        [key]: value
      }));
    }
    setErrors((prev) => ({
      ...prev,
      [key]: '',
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formState.name) newErrors.name = 'League name is required.';
      if (!formState.club_id) newErrors.club = 'A league must belong to a club.';
      if (!formState.startDate) newErrors.startDate = 'Start date is required.';
      //if (!formState.endDate) newErrors.endDate = 'End date is required.';
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
      const response = await eventAPI.createEvent(snakeCaseData);  //leagueAPI.createLeague(snakeCaseData);
      if (response.success) {
        onSuccess(response.event)
        //navigate(`/league/${response.event.id}`);
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
          {club ? <Typography variant='h6'>Hosting club: {club.name}</Typography> :
            <TextField
              label="Hosting Club"
              select
              fullWidth
              required
              value={formState.club}
              onChange={(e) => updateFormState('club', e.target.value)}
              margin="normal"
              error={!!errors.club}
              helperText={errors.club}
              disabled={userClubs.length === 0}
            >
              {userClubs.map((club) => (
                <MenuItem key={club.id} value={club.id}>
                  {club.name}
                </MenuItem>
              ))}
            </TextField>
          }
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
            slotProps={{ inputLabel: { shrink: true } }}
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
            slotProps={{ inputLabel: { shrink: true } }}
            margin="normal"
            error={!!errors.endDate}
            helperText={errors.endDate}
          />
          {club?.city
            ? <Typography>Location: {club.city.name}</Typography>
            :
            <AutoCompletePlaces
              onPlaceChanged={handlePlaceChanged}
              required
              error={Boolean(errors.location)}
              helperText={errors.location}
              initialCity={club?.location || ''}
              showGetUserLocation={true}
            />
          }
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
      handleNext: () => validateStep(1),
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
            value={formState.match_type}
            onChange={(e) => updateFormState('content_object.type', e.target.value)}
            margin="normal"
          >
            <MenuItem value="singles">Singles</MenuItem>
            <MenuItem value="doubles">Doubles</MenuItem>
            <MenuItem value="teams">Teams</MenuItem>
          </TextField>

          <Box display={'flex'} alignItems={'center'}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formState.isOpenRegistration}
                onChange={(e) => updateFormState('isOpenRegistration', e.target.checked)}
              />
            }
            label="Open Registration"
          />
          <InfoPopup size={20}>
            By selecting <b>Open Registration</b>, you allow players to sign themselves up for the league without needing admin approval, given that they meet the restrictions (set in next step).
          </InfoPopup>
          </Box>
          {formState.isOpenRegistration && (
            <TextField
              label="Registration Open Date"
              type="date"
              fullWidth
              value={formState.registrationOpenDate}
              onChange={(e) => updateFormState('registrationOpenDate', e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              margin="normal"
            />
          )}
        </Container>
      ),
    },
    {
      label: 'Restrictions',
      description: 'Define restrictions for league participants.',
      handleNext: () => validateStep(2),
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
        {formState.name || 'Create New League'}
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

