import React from 'react';
import { Box, Chip } from '@mui/material';
import { MdEmojiEvents } from 'react-icons/md';
import { Link } from 'react-router-dom';

const MatchEventChips = ({ event, division, showIcon = false, size = 'small', mt = 0.5 }) => {
  if (!event) return null;
  
  let to = `/events/${event.slug}`;
  if (division && event.divisions) {
    const idx = event.divisions.findIndex(d => d.id === division.id);
    if (idx >= 0) to += `?division=${idx}`;
  }

  const label = division ? `${event.name} · ${division.name}` : event.name;

  return (
    <Box display="flex" alignItems="center" gap={0.5} sx={{ mt }}>
      {showIcon && <MdEmojiEvents size={14} color="#8b6914" />}
      <Chip
        label={label}
        size={size}
        variant="outlined"
        component={Link}
        to={to}
        clickable
        sx={{ height: size === 'small' ? 20 : 18, fontSize: size === 'small' ? '0.7rem' : '0.65rem' }}
      />
    </Box>
  );
};

export default MatchEventChips;