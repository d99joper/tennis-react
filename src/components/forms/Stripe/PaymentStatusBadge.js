import React from 'react';
import { Chip } from '@mui/material';

const PaymentStatusBadge = ({ status }) => {
  const statusConfig = {
    succeeded: { label: 'Paid', color: 'success' },
    pending: { label: 'Pending', color: 'warning' },
    processing: { label: 'Processing', color: 'info' },
    failed: { label: 'Failed', color: 'error' },
    refunded: { label: 'Refunded', color: 'default' },
    canceled: { label: 'Canceled', color: 'default' },
  };

  const config = statusConfig[status] || { label: status, color: 'default' };

  return <Chip label={config.label} color={config.color} size="small" />;
};

export default PaymentStatusBadge;
