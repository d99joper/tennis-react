import React from 'react';
import {
  TextField,
  MenuItem,
  Typography
} from '@mui/material';

const DivisionFilter = ({ 
  divisions = [], 
  selectedDivisionId = '', 
  onDivisionChange,
  disabled = false 
}) => {
  const handleChange = (event) => {
    const value = event.target.value;
    onDivisionChange(value === '' ? null : value);
  };

  return (
    <TextField
      select
      fullWidth
      size="small"
      variant="outlined"
      value={selectedDivisionId || ''}
      onChange={handleChange}
      disabled={disabled}
      label="Filter by division..."
      sx={{ 
        '& .MuiInputLabel-root': {
          fontSize: '0.875rem'
        }
      }}
    >
      <MenuItem value="">
        <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
          All divisions
        </Typography>
      </MenuItem>
      {divisions.map((division) => (
        <MenuItem key={division.id} value={division.id}>
          <Typography variant="body2">
            {division.name}
          </Typography>
        </MenuItem>
      ))}
    </TextField>
  );
};

export default DivisionFilter;