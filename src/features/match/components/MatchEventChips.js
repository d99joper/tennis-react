import React from 'react';
import { Box, Chip } from '@mui/material';
import { MdEmojiEvents } from 'react-icons/md';
import { Link } from 'react-router-dom';

const MatchEventChips = ({ event, division, divisions = null, showIcon = false, size = 'small', mt = 0.5, showDivision = true }) => {
  if (!event) return null;
  
  const effectiveDivision = showDivision ? division : null;
  const divisionsSource = divisions || event.divisions;

  let to = `/events/${event.slug}`;
  if (effectiveDivision) {
    if (divisionsSource) {
      const idx = divisionsSource.findIndex(d => d.id === effectiveDivision.id);
      if (idx >= 0) to += `?division=${idx}`;
      else to += `?divisionId=${effectiveDivision.id}`;
    } else {
      to += `?divisionId=${effectiveDivision.id}`;
    }
  }

  const label = effectiveDivision ? `${event.name} · ${effectiveDivision.name}` : event.name;

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