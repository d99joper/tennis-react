import React, { useState, useEffect, useRef } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { debounce } from 'lodash';
import { courtAPI } from 'api/services';

const CourtSearchAutocomplete = ({
  selectedCourt,
  setSelectedCourt,
  required = false,
  error = false,
  errorMessage,
  label
}) => {
  const [courts, setCourts] = useState([]); // List of courts
  const [searchTerm, setSearchTerm] = useState(''); // Court search input
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  // Fetch courts dynamically
  const fetchCourts = async (filter = '') => {
    setLoading(true);
    try {
      const courtsData = await courtAPI.getCourts(filter);
      setCourts(
        courtsData.courts.map(c => ({
          id: c.id,
          name: c.name,
        }))
      );
    } catch (error) {
      console.error('Failed to fetch courts:', error);
    }
    setLoading(false);
  };

  // Set up debounce to prevent unnecessary API calls
  useEffect(() => {
    if (!debounceRef.current) {
      debounceRef.current = debounce(fetchCourts, 300);
    }
    debounceRef.current(searchTerm);
  }, [searchTerm]);

  // Fetch courts on initial load
  useEffect(() => {
    fetchCourts();
  }, []);

  return (
    <Autocomplete
      //freeSolo
      options={courts}
      getOptionLabel={(option) => option?.name || ''}
      value={selectedCourt || null}
      //value={courts.find(court => court.id === selectedCourt) || null} // Keep selected court as object
      key={(option) => option.id} // Ensure React handles key properly
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.name}
        </li>
      )}
      onInputChange={(event, newInputValue, reason) => {
        if(reason==='clear') setSelectedCourt(null)
        setSearchTerm(newInputValue);
        if (newInputValue === '') setSelectedCourt(null); // Reset when cleared
      }}
      onChange={(event, newValue) => setSelectedCourt(newValue)}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label||'Court'}
          fullWidth
          placeholder="Type to search..."
          error={error}
          helperText={error ? errorMessage : ""}
          onChange={(e) => setSearchTerm(e.target.value)} // Allow free typing
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

export default CourtSearchAutocomplete;
