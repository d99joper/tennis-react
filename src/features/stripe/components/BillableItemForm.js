import React from 'react';
import { Box, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { flexColumn } from 'styles/componentStyles';
import RefundPolicySelect from './RefundPolicySelect';

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
        value={value?.amount ?? ''}
        onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
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

      <RefundPolicySelect
        value={value?.refund_policy || 'no_refunds'}
        onChange={(val) => handleChange('refund_policy', val)}
      />
    </Box>
  );
};

export default BillableItemForm;
