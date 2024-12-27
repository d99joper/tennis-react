import React, { useState } from 'react';
import { Box, TextField, Typography, Button, Grid2 as Grid, Card, CardContent, CardActions, Slider } from '@mui/material';
import clubAPI from 'api/services/club';
import AutoCompletePlaces from '../Autocomplete/AutocompletePlaces';

const ClubSearchAutocomplete = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [useLocationFilter, setUseLocationFilter] = useState(false);
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(15);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (name) queryParams.append('name', name);
      if (useLocationFilter && location) {
        queryParams.append('location', location.location);
        queryParams.append('lat', location.lat);
        queryParams.append('lng', location.lng);
        queryParams.append('radius', radius);
      }

      const response = await clubAPI.getClubs(queryParams.toString());
      if (response.success) {
        setClubs(response.data);
      } else {
        console.error(response.statusMessage);
      }
    } catch (error) {
      console.error('Failed to fetch clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Search for a Club
      </Typography>
      <Grid container spacing={2} direction={'column'}>
        <Grid size={{ xs:12, md:6}}>
          <TextField
            label="Club Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs:12, md:6}}>
          <label>
            <input
              type="checkbox"
              checked={useLocationFilter}
              onChange={(e) => setUseLocationFilter(e.target.checked)}
            />
            Filter by Location
          </label>
        </Grid>
        {useLocationFilter && (
          <Grid container direction={'column'}>
            <Grid size={{ xs:12, md:6}}>
              <AutoCompletePlaces
                label="Location"
                onPlaceChanged={(place) => setLocation(place)}
                showGetUserLocation={true}
              />
            </Grid>
            <Grid size={{ xs:12, md:6}}>
              <Typography gutterBottom>Radius (miles)</Typography>
              <Slider
                value={radius}
                onChange={(e, value) => setRadius(value)}
                aria-labelledby="radius-slider"
                valueLabelDisplay="auto"
                step={5}
                marks
                min={15}
                max={100}
              />
            </Grid>
          </Grid>
        )}
        <Grid size={{ xs:12, md:6}}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={loading}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      <Box mt={4}>
        {clubs.map((club) => (
          <Card key={club.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{club.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {club.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Location: {club.location || 'Unknown'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" href={`/club/${club.id}`}>
                Go to Club
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ClubSearchAutocomplete;
