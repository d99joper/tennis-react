import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClubData((prev) => ({ ...prev, [name]: value }));
  };
  const handlePlaceChanged = (e) => {
    setClubData((prev) => ({ ...prev, location: e.location, lat: e.lat, lng: e.lng }));
    // setClubData((prev) => ({ ...prev, [lat]: e.lat }));
    // setClubData((prev) => ({ ...prev, [lng]: e.lng }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const newClub = await clubAPI.createClub(clubData);
      onClubCreated(newClub);
    } catch (error) {
      console.error('Failed to create club:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5">Create Club</Typography>
      <TextField
        label="Name"
        name="name"
        value={clubData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        name="description"
        value={clubData.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <AutoCompletePlaces
        onPlaceChanged={handlePlaceChanged}
        showGetUserLocation={true}
      />
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
      >
        Create Club
      </Button>
    </Box>
  );
};

export default CreateClub;
