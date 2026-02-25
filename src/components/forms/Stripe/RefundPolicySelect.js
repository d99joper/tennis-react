import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import { enums } from 'helpers';

const RefundPolicySelect = ({ value, onChange, disabled, size = 'small', fullWidth = true }) => (
  <TextField
    select
    fullWidth={fullWidth}
    label="Refund Policy"
    value={value || 'no_refunds'}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    size={size}
  >
    {enums.REFUND_POLICIES.map((policy) => (
      <MenuItem key={policy.value} value={policy.value}>
        {policy.label}
      </MenuItem>
    ))}
  </TextField>
);

export default RefundPolicySelect;
