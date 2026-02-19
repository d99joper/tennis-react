import React from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { flexColumn } from 'styles/componentStyles';

const BillableItemForm = ({ value, onChange }) => {
  const theme = useTheme();

  const handleChange = (field, val) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <Box sx={{ ...flexColumn, gap: theme.spacing(2), mt: theme.spacing(2) }}>
      <TextField
        fullWidth
        label="Entry Fee"
        type="number"
        value={value?.amount ? value.amount / 100 : ''}
        onChange={(e) => handleChange('amount', parseFloat(e.target.value) * 100)}
        placeholder="25.00"
        slotProps={{
          input: {
            startAdornment: <Box component="span" sx={{ mr: 0.5 }}>$</Box>
          }
        }}
      />
      
      <TextField
        fullWidth
        label="Description"
        multiline
        rows={2}
        value={value?.description || ''}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="Tournament entry fee"
      />
      
      <TextField
        select
        fullWidth
        label="Refund Policy"
        value={value?.refund_policy || 'no_refunds'}
        onChange={(e) => handleChange('refund_policy', e.target.value)}
      >
        <MenuItem value="no_refunds">No Refunds</MenuItem>
        <MenuItem value="full_refund_before_start">Full Refund Before Start</MenuItem>
        <MenuItem value="partial_refund">Partial Refund (50%)</MenuItem>
      </TextField>
    </Box>
  );
};

export default BillableItemForm;
