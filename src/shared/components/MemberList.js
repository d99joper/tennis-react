// src/components/MemberList.js
import React, { useState, useMemo } from 'react';
import {
  Box, List, ListItem, ListItemText, Chip, Button, IconButton,
  Stack, Typography, TextField, InputAdornment, Popover,
  Slider, Select, MenuItem, FormControl, InputLabel, Tooltip,
} from '@mui/material';

import { ProfileImage } from 'shared/components/ProfileImage';
import { MdDelete, MdFilterList, MdSearch, MdClose } from 'react-icons/md';
import { GiExitDoor } from 'react-icons/gi';

const NTRP_RANGE = [1, 7];
const UTR_RANGE  = [1, 16];

const SORT_OPTIONS = [
  { value: 'name',    label: 'Name (A–Z)' },
  { value: 'ntrp',   label: 'NTRP (high → low)' },
  { value: 'utr',    label: 'UTR (high → low)' },
  { value: 'matches', label: 'Matches (most first)' },
  { value: 'joined', label: 'Joined (newest first)' },
];

const formatRelative = (dateStr) => {
  if (!dateStr) return null;
  const diffDays = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (diffDays < 1)   return 'today';
  if (diffDays < 30)  return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffMonths / 12)}yr ago`;
};

const formatFull = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

const MemberList = ({
  members,
  currentUserId,
  admins = [],
  showAdminBadge = true,
  showLeaveButton = true,
  showRemoveButton = false,
  onLeave,
  onRemove,
  customActions,
  customSecondary,
  customBadges,
  emptyMessage = 'No members found',
  getKey = (m) => m.id,
  hoverEffect = true,
  showBorders = true,
  spacing = 1.5,
  avatarSize = 40,
}) => {

  const [searchText,   setSearchText]   = useState('');
  const [ntrpRange,    setNtrpRange]    = useState(NTRP_RANGE);
  const [utrRange,     setUtrRange]     = useState(UTR_RANGE);
  const [sortBy,       setSortBy]       = useState('name');
  const [filterAnchor, setFilterAnchor] = useState(null);

  const ntrpActive = ntrpRange[0] !== NTRP_RANGE[0] || ntrpRange[1] !== NTRP_RANGE[1];
  const utrActive  = utrRange[0]  !== UTR_RANGE[0]  || utrRange[1]  !== UTR_RANGE[1];
  const isFilterActive = ntrpActive || utrActive;

  const resetFilters = () => {
    setNtrpRange(NTRP_RANGE);
    setUtrRange(UTR_RANGE);
  };

  const filteredAndSorted = useMemo(() => {
    if (!members) return [];

    const result = members.filter((m) => {
      if (searchText && !m.name?.toLowerCase().includes(searchText.toLowerCase())) return false;
      if (ntrpActive && m.NTRP) {
        const v = parseFloat(m.NTRP);
        if (!isNaN(v) && (v < ntrpRange[0] || v > ntrpRange[1])) return false;
      }
      const utrVal = m.cached_utr?.singles;
      if (utrActive && utrVal) {
        if (utrVal < utrRange[0] || utrVal > utrRange[1]) return false;
      }
      return true;
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'ntrp':    return (parseFloat(b.NTRP) || 0) - (parseFloat(a.NTRP) || 0);
        case 'utr':     return (b.cached_utr?.singles || 0) - (a.cached_utr?.singles || 0);
        case 'matches': return (b.match_count || 0) - (a.match_count || 0);
        case 'joined':  return new Date(b.date_joined || 0) - new Date(a.date_joined || 0);
        default:        return (a.name || '').localeCompare(b.name || '');
      }
    });
  }, [members, searchText, ntrpRange, utrRange, ntrpActive, utrActive, sortBy]);

  if (!members || members.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* ── Toolbar ── */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1.5, flexWrap: 'wrap' }}>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
          {filteredAndSorted.length} / {members.length} members
        </Typography>

        <TextField
          size="small"
          placeholder="Search by name…"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ flex: 1, minWidth: 150 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start"><MdSearch size={18} /></InputAdornment>
              ),
              endAdornment: searchText ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchText('')}>
                    <MdClose size={16} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }
          }}
        />

        <FormControl size="small" sx={{ minWidth: 170 }}>
          <InputLabel>Sort</InputLabel>
          <Select value={sortBy} label="Sort" onChange={(e) => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          size="small"
          variant={isFilterActive ? 'contained' : 'outlined'}
          startIcon={<MdFilterList />}
          onClick={(e) => setFilterAnchor(e.currentTarget)}
        >
          Filter{isFilterActive ? ' ●' : ''}
        </Button>
      </Box>

      {/* ── Filter Popover ── */}
      <Popover
        open={Boolean(filterAnchor)}
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { p: 2.5, width: 300 } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2">Filter members</Typography>
          <IconButton size="small" onClick={() => setFilterAnchor(null)}>
            <MdClose size={16} />
          </IconButton>
        </Box>

        <Typography variant="body2" gutterBottom>
          NTRP&nbsp;
          <Typography component="span" variant="body2" color="text.secondary">
            {ntrpRange[0].toFixed(1)} – {ntrpRange[1].toFixed(1)}
          </Typography>
        </Typography>
        <Slider
          value={ntrpRange}
          min={NTRP_RANGE[0]}
          max={NTRP_RANGE[1]}
          step={0.5}
          onChange={(_, val) => setNtrpRange(val)}
          valueLabelDisplay="auto"
          sx={{ mb: 3 }}
        />

        <Typography variant="body2" gutterBottom>
          UTR (singles)&nbsp;
          <Typography component="span" variant="body2" color="text.secondary">
            {utrRange[0].toFixed(1)} – {utrRange[1].toFixed(1)}
          </Typography>
        </Typography>
        <Slider
          value={utrRange}
          min={UTR_RANGE[0]}
          max={UTR_RANGE[1]}
          step={0.5}
          onChange={(_, val) => setUtrRange(val)}
          valueLabelDisplay="auto"
          sx={{ mb: 2.5 }}
        />

        <Button
          size="small"
          fullWidth
          variant="outlined"
          color="secondary"
          disabled={!isFilterActive}
          onClick={resetFilters}
        >
          Reset filters
        </Button>
      </Popover>

      {filteredAndSorted.length === 0 && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No members match these filters.
          </Typography>
        </Box>
      )}

      {/* ── Member rows ── */}
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {filteredAndSorted.map((member) => {
          const isAdmin       = admins.includes(member.id);
          const isCurrentUser = currentUserId === member.id;
          const ntrp          = member.NTRP ? parseFloat(member.NTRP).toFixed(1) : null;
          const utr           = member.cached_utr?.singles > 0
            ? member.cached_utr.singles.toFixed(2) : null;
          const joinedLabel   = formatRelative(member.date_joined);
          const joinedFull    = formatFull(member.date_joined);

          return (
            <ListItem
              key={getKey(member)}
              alignItems="flex-start"
              sx={{
                ...(showBorders && { borderBottom: '1px solid', borderColor: 'divider' }),
                ...(hoverEffect  && { '&:hover': { bgcolor: 'action.hover' } }),
                py: spacing,
              }}
              secondaryAction={
                <Stack direction="row" spacing={1} alignItems="center">
                  {customActions && customActions(member, isCurrentUser, isAdmin)}
                  {showLeaveButton && isCurrentUser && onLeave && (
                    <Button
                      size="small"
                      color="secondary"
                      startIcon={<GiExitDoor size={18} />}
                      onClick={() => onLeave(member)}
                    >
                      Leave
                    </Button>
                  )}
                  {showRemoveButton && !isAdmin && onRemove && (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => onRemove(member)}
                      sx={{ color: 'error.main' }}
                    >
                      <MdDelete size={20} />
                    </IconButton>
                  )}
                </Stack>
              }
            >
              <ListItemText
                disableTypography
                primary={
                  <ProfileImage player={member} size={avatarSize} asLink showName />
                }
                secondary={
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.75, flexWrap: 'wrap', alignItems: 'center' }}>
                    {ntrp && (
                      <Chip label={`NTRP ${ntrp}`} size="small" variant="outlined"
                        sx={{ height: 20, fontSize: 11 }} />
                    )}
                    {utr && (
                      <Chip label={`UTR ${utr}`} size="small" variant="outlined" color="success"
                        sx={{ height: 20, fontSize: 11 }} />
                    )}
                    {member.city?.name && (
                      <Typography variant="caption" color="text.secondary">
                        📍 {member.city.name}
                      </Typography>
                    )}
                    {member.match_count > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        · {member.match_count} matches
                      </Typography>
                    )}
                    {joinedLabel && (
                      <Tooltip title={`Joined ${joinedFull}`} placement="top">
                        <Typography variant="caption" color="text.secondary" sx={{ cursor: 'default' }}>
                          · joined {joinedLabel}
                        </Typography>
                      </Tooltip>
                    )}
                    {customSecondary && customSecondary(member, isCurrentUser, isAdmin)}
                    {customBadges    && customBadges(member, isCurrentUser, isAdmin)}
                    {showAdminBadge && isAdmin && (
                      <Chip label="Admin" size="small" color="primary"
                        sx={{ height: 20, fontSize: 11 }} />
                    )}
                  </Box>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default MemberList;