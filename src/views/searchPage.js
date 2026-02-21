import { Box, Button, Checkbox, CircularProgress, Collapse, FormControlLabel, InputAdornment,
  List, ListItem, ListItemText, Paper, Slider, TextField, ToggleButton, ToggleButtonGroup,
  Typography, useMediaQuery, useTheme } from "@mui/material";
import { courtAPI, ladderAPI, playerAPI, clubAPI, eventAPI } from "api/services";
import { AutoCompletePlaces, ProfileImage } from "components/forms";
import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaUsers, FaBuilding, FaCalendarAlt, FaTableTennis } from "react-icons/fa";

const SearchPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [radius, setRadius] = useState(15);
  const [selectedSearch, setSelectedSearch] = useState("players");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [ntrp, setNtrp] = useState([2.0, 5.0]);
  const [utr, setUtr] = useState([2.0, 10.0]);
  const [applyLocation, setApplyLocation] = useState(false);
  const [applyNtrp, setApplyNtrp] = useState(false);
  const [applyUtr, setApplyUtr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [courts, setCourts] = useState([]);
  const [ladders, setLadders] = useState([]);
  const [totalCounts, setTotalCounts] = useState({ players: -1, clubs: -1, events: -1, courts: -1, ladders: -1 });

  const searchTypeConfig = {
    players: { label: 'Players', icon: <FaUsers size={14} /> },
    clubs: { label: 'Clubs', icon: <FaBuilding size={14} /> },
    events: { label: 'Events', icon: <FaCalendarAlt size={14} /> },
    courts: { label: 'Courts', icon: <FaTableTennis size={14} /> },
  };

  const handleSearchTypeChange = (event, newValue) => {
    if (newValue) {
      setSelectedSearch(newValue);
      setName('');
      setLocation('');
      setApplyLocation(false);
    }
  };

  const updateSearch = useCallback(async () => {
    setIsLoading(true);
    let filters = {};
    if (name) filters.name = name;

    if (selectedSearch === "players") {
      if (applyNtrp) filters.ntrp = `${ntrp[0]},${ntrp[1]}`;
      if (applyUtr) filters.utr = `${utr[0]},${utr[1]}`;
    }
    if (location && applyLocation) {
      filters.geo = `${location.lat},${location.lng},${radius}`;
    }

    let results = {};
    switch (selectedSearch) {
      case "players":
        results = await playerAPI.getPlayers(filters);
        setTotalCounts(prev => ({ ...prev, players: results.data.total_count }));
        setPlayers(results.data.players);
        break;
      case "clubs":
        results = await clubAPI.getClubs(filters);
        setTotalCounts(prev => ({ ...prev, clubs: results.data.total_count }));
        setClubs(results.data.clubs);
        break;
      case "events":
        results = await eventAPI.getEvents(filters);
        setTotalCounts(prev => ({ ...prev, events: results.total_count }));
        setEvents(results.events);
        break;
      case "courts":
        results = await courtAPI.getCourts(filters);
        setTotalCounts(prev => ({ ...prev, courts: results.total_count }));
        setCourts(results.courts);
        break;
      case "ladders":
        results = await ladderAPI.getLadders(filters);
        setLadders(results.ladders);
        break;
      default:
        break;
    }
    setIsLoading(false);
  }, [name, selectedSearch, applyNtrp, applyUtr, ntrp, utr, location, applyLocation, radius]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      updateSearch();
    }
  }, [updateSearch]);

  const currentResults = {
    players,
    clubs,
    events,
    courts,
    ladders,
  };

  const resultCount = totalCounts[selectedSearch];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 800, mx: 'auto', width: '100%' }}>
      {/* Search type toggle */}
      <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Search for
        </Typography>
        <ToggleButtonGroup
          color="primary"
          value={selectedSearch}
          exclusive
          onChange={handleSearchTypeChange}
          fullWidth
          size={isSmallScreen ? "small" : "medium"}
          sx={{
            '& .MuiToggleButton-root': {
              textTransform: 'none',
              gap: 0.75,
              fontWeight: 500,
              fontSize: isSmallScreen ? '0.8rem' : '0.875rem',
            },
          }}
        >
          {Object.entries(searchTypeConfig).map(([key, { label, icon }]) => (
            <ToggleButton key={key} value={key}>
              {icon} {!isSmallScreen && label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Paper>

      {/* Search input + filters */}
      <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        {/* Name search */}
        <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
          <TextField
            label="Search by name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            fullWidth
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch size={14} color={theme.palette.text.secondary} />
                  </InputAdornment>
                ),
              }
            }}
          />
          <Button
            variant="contained"
            onClick={updateSearch}
            disabled={isLoading}
            sx={{ minWidth: isSmallScreen ? 48 : 100 }}
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : (isSmallScreen ? <FaSearch /> : 'Search')}
          </Button>
        </Box>

        {/* Player-specific filters */}
        {selectedSearch === "players" && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <FormControlLabel
              control={<Checkbox size="small" checked={applyNtrp} onChange={() => setApplyNtrp(!applyNtrp)} />}
              label={<Typography variant="body2">NTRP Filter</Typography>}
            />
            <Collapse in={applyNtrp}>
              <Box sx={{ px: 2, pb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Range: {ntrp[0].toFixed(1)} - {ntrp[1].toFixed(1)}
                </Typography>
                <Slider
                  min={2.0} max={6.5} step={0.5} value={ntrp}
                  onChange={(e, newValue) => setNtrp(newValue)}
                  valueLabelDisplay="auto" size="small"
                />
              </Box>
            </Collapse>
            <FormControlLabel
              control={<Checkbox size="small" checked={applyUtr} onChange={() => setApplyUtr(!applyUtr)} />}
              label={<Typography variant="body2">UTR Filter</Typography>}
            />
            <Collapse in={applyUtr}>
              <Box sx={{ px: 2, pb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Range: {utr[0].toFixed(1)} - {utr[1].toFixed(1)}
                </Typography>
                <Slider
                  min={1.0} max={17.0} step={0.1} value={utr}
                  onChange={(e, newValue) => setUtr(newValue)}
                  valueLabelDisplay="auto" size="small"
                />
              </Box>
            </Collapse>
          </Box>
        )}

        {/* Location filter */}
        <FormControlLabel
          control={<Checkbox size="small" checked={applyLocation} onChange={() => setApplyLocation(!applyLocation)} />}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FaMapMarkerAlt size={12} />
              <Typography variant="body2">Location Filter</Typography>
            </Box>
          }
        />
        <Collapse in={applyLocation}>
          <Box sx={{ px: 2, pb: 1 }}>
            <AutoCompletePlaces
              onPlaceChanged={(place) => setLocation(place)}
              initialCity={location}
              showGetUserLocation={true}
            />
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Radius: {radius} miles
              </Typography>
              <Slider
                min={5} max={100} step={5} value={radius}
                onChange={(e, newValue) => setRadius(newValue)}
                valueLabelDisplay="auto" size="small"
              />
            </Box>
          </Box>
        </Collapse>
      </Paper>

      {/* Results */}
      <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Results header */}
        <Box
          sx={{
            p: 1.5,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.header,
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            {resultCount > -1
              ? `${resultCount} ${selectedSearch} found`
              : `Search for ${selectedSearch}`
            }
          </Typography>
        </Box>

        {/* Results list */}
        <Box sx={{ p: 1 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List disablePadding>
              {selectedSearch === "players" && currentResults.players.map(player => (
                <ListItem
                  key={player.id}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    px: 1.5,
                    py: 1,
                    '&:hover': { backgroundColor: theme.palette.action.hover },
                    transition: 'background-color 0.15s',
                  }}
                >
                  <Link to={"/players/" + player.slug} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                    <ProfileImage player={player} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{player.name}</Typography>
                      {player.NTRP && (
                        <Typography variant="caption" color="text.secondary">NTRP: {player.NTRP}</Typography>
                      )}
                    </Box>
                  </Link>
                </ListItem>
              ))}
              {selectedSearch === "clubs" && currentResults.clubs.map(club => (
                <ListItem
                  key={club.id}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    px: 1.5,
                    py: 1,
                    '&:hover': { backgroundColor: theme.palette.action.hover },
                    transition: 'background-color 0.15s',
                  }}
                >
                  <Link to={'/clubs/' + club.slug} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                    <ListItemText
                      primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>{club.name}</Typography>}
                      secondary={club.city?.name && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                          <FaMapMarkerAlt size={10} /> {club.city.name}
                        </Typography>
                      )}
                    />
                  </Link>
                </ListItem>
              ))}
              {selectedSearch === "events" && currentResults.events.map(event => (
                <ListItem
                  key={event.id}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    px: 1.5,
                    py: 1,
                    '&:hover': { backgroundColor: theme.palette.action.hover },
                    transition: 'background-color 0.15s',
                  }}
                >
                  <Link to={'/events/' + event.slug} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                    <ListItemText
                      primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>{event.name}</Typography>}
                      secondary={event.city?.name && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                          <FaMapMarkerAlt size={10} /> {event.city.name}
                        </Typography>
                      )}
                    />
                  </Link>
                </ListItem>
              ))}
              {selectedSearch === "courts" && currentResults.courts.map(court => (
                <ListItem
                  key={court.id}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    px: 1.5,
                    py: 1,
                    '&:hover': { backgroundColor: theme.palette.action.hover },
                    transition: 'background-color 0.15s',
                  }}
                >
                  <Link to={'/courts/' + court.id} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                    <ListItemText
                      primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>{court.name}</Typography>}
                      secondary={court.location && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                          <FaMapMarkerAlt size={10} /> {court.location}
                        </Typography>
                      )}
                    />
                  </Link>
                </ListItem>
              ))}
              {selectedSearch === "ladders" && currentResults.ladders.map(ladder => (
                <ListItem key={ladder.id} sx={{ borderRadius: 1, mb: 0.5, px: 1.5, py: 1 }}>
                  <Typography variant="body2">{ladder.name}</Typography>
                </ListItem>
              ))}
            </List>
          )}
          {!isLoading && resultCount === 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">No results found. Try adjusting your search.</Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default SearchPage;
