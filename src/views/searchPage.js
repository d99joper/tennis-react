import { Box, Button, Checkbox, CircularProgress, Divider, FormControl, FormControlLabel, FormLabel, List, MenuItem, Select, Slider, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { courtAPI, ladderAPI, playerAPI, clubAPI, eventAPI } from "api/services";
import { AutoCompletePlaces, ProfileImage } from "components/forms";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SearchPage = () => {
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

  const handleSearchTypeChange = (event, newValue) => {
    if (newValue) {
      setSelectedSearch(newValue);
      setName('');
      setLocation('');
      setApplyLocation(false);
    }
  };

  const updateSearch = async () => {
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
  };

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <FormControl>
        <FormLabel>Search for</FormLabel>
        <ToggleButtonGroup
          color="primary"
          value={selectedSearch}
          exclusive
          onChange={handleSearchTypeChange}
          sx={{ marginBottom: "1rem" }}
        >
          <ToggleButton value="players">Players</ToggleButton>
          <ToggleButton value="clubs">Clubs</ToggleButton>
          <ToggleButton value="events">Events</ToggleButton>
          <ToggleButton value="courts">Courts</ToggleButton>
          {/* <ToggleButton value="ladders">Ladders</ToggleButton> */}
        </ToggleButtonGroup>
      </FormControl>

      <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ marginBottom: "1rem" }}
          />
      {selectedSearch === "players" && (
        <>
          <FormControlLabel
            control={<Checkbox checked={applyNtrp} onChange={() => setApplyNtrp(!applyNtrp)} />}
            label="Apply NTRP Filter"
          />
          {applyNtrp && (
            <>
              <Typography>NTRP Range: {ntrp[0].toFixed(1)} - {ntrp[1].toFixed(1)}</Typography>
              <Slider
                min={2.0}
                max={6.5}
                step={0.5}
                value={ntrp}
                onChange={(e, newValue) => setNtrp(newValue)}
                valueLabelDisplay="auto"
              />
            </>
          )}
          <FormControlLabel
            control={<Checkbox checked={applyUtr} onChange={() => setApplyUtr(!applyUtr)} />}
            label="Apply UTR Filter"
          />
          {applyUtr && (
            <>
              <Typography>UTR Range: {utr[0].toFixed(1)} - {utr[1].toFixed(1)}</Typography>
              <Slider
                min={1.0}
                max={17.0}
                step={0.1}
                value={utr}
                onChange={(e, newValue) => setUtr(newValue)}
                valueLabelDisplay="auto"
              />
            </>
          )}
        </>
      )}
      <FormControlLabel
        control={<Checkbox checked={applyLocation} onChange={() => setApplyLocation(!applyLocation)} />}
        label="Apply Location Filter"
      />
      {applyLocation && (
        <>
          <AutoCompletePlaces
            onPlaceChanged={(place) => setLocation(place)}
            initialCity={location}
            showGetUserLocation={true}
          />

          <Box sx={{ marginTop: "1rem" }}>
            <Typography>Radius: {radius} miles</Typography>
            <Slider
              min={5}
              max={100}
              step={5}
              value={radius}
              onChange={(e, newValue) => setRadius(newValue)}
              valueLabelDisplay="auto"
            />
          </Box>
        </>
      )}

      <Button variant="contained" onClick={updateSearch} sx={{ marginTop: "1rem" }}>Search</Button>
      <Divider sx={{ marginY: "1rem" }} />
      {totalCounts[selectedSearch] > -1 && <Typography>Found: {totalCounts[selectedSearch]}</Typography>}
      {isLoading ? (
        <CircularProgress size={80} />
      ) : (
        <List>
          {selectedSearch === "players" && players.map(player => (
            <Link to={"/players/" + player.slug} key={player.id}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, pb: 2 }}>
                <ProfileImage player={player} /> {player.name}
              </Box>
            </Link>
          ))}
          {selectedSearch === "clubs" && clubs.map(club => (
            <Link to={'/clubs/' + club.slug} key={club.id}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, pb: 2 }}>
                {club.name}
              </Box>
            </Link>
          ))}
          {selectedSearch === "events" && events.map(event => (
            <Link to={'/events/' + event.slug} key={event.id}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, pb: 2 }}>
                {event.name}
              </Box>
            </Link>
          ))}
          {selectedSearch === "courts" && courts.map(court => (
            <Link to={'/courts/' + court.id} key={court.id}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, pb: 2 }}>
                {court.name}
              </Box>
            </Link>
          ))}
          {selectedSearch === "ladders" && ladders.map(ladder => (
            <Typography key={ladder.id}>{ladder.name}</Typography>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SearchPage;
