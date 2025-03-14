import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import clubAPI from 'api/services/club';
import AutoCompletePlaces from '../Autocomplete/AutocompletePlaces';

const CreateClub = ({ onClubCreated }) => {
  const [clubData, setClubData] = useState({
    name: '',
    description: '',
    location: '',
    lat: '',
    lng: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!clubData.name.trim()) newErrors.name = 'Club name is required';
    if (!clubData.location.trim()) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClubData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePlaceChanged = (e) => {
    setClubData((prev) => ({ ...prev, location: e.location, lat: e.lat, lng: e.lng }));

    // Clear error if location is selected
    if (errors.location) {
      setErrors((prev) => ({ ...prev, location: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return; // Prevent submission if validation fails

    try {
      setLoading(true);
      const newClub = await clubAPI.createClub(clubData);
      onClubCreated(newClub);
      setClubData({ name: '', description: '', location: '', lat: '', lng: '' }); // Reset form on success
      setErrors({}); // Clear errors
    } catch (error) {
      console.error('Failed to create club:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5">Create Club</Typography>

      {/* Club Name Input */}
      <TextField
        label="Name"
        name="name"
        value={clubData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.name}
        helperText={errors.name}
      />

      {/* Club Description Input */}
      <TextField
        label="Description"
        name="description"
        multiline
        value={clubData.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      {/* Location Autocomplete */}
      <AutoCompletePlaces
        onPlaceChanged={handlePlaceChanged}
        useFullAddress={true}
        showGetUserLocation={true}
        required
        error={Boolean(errors.location)}
        helperText={errors.location}
      />

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Creating...' : 'Create Club'}
      </Button>
    </Box>
  );
};

export default CreateClub;
