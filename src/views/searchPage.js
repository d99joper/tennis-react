import { Box, Button, CircularProgress, Divider, FormControl, FormLabel, List, MenuItem, Select, Slider, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { courtAPI, ladderAPI, playerAPI, clubAPI, eventAPI } from "api/services";
import { AutoCompletePlaces, ProfileImage } from "components/forms";
import { enums, helpers } from "helpers";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SearchPage = () => {
  const [radius, setRadius] = useState(15);
  const [selectedSearch, setSelectedSearch] = useState("players");
  const [playerName, setPlayerName] = useState("");
  const [location, setLocation] = useState("");
  const [ntrp, setNtrp] = useState([2.0, 5.0]);
  const [utr, setUtr] = useState([3.0, 10.0]);
  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [courts, setCourts] = useState([]);
  const [ladders, setLadders] = useState([]);
  const [totalCount, setTotalCount] = useState(-1);

  const handleSearchTypeChange = (event, newValue) => {
    if (newValue) {
      setSelectedSearch(newValue);
    }
  };

  const updateSearch = async () => {
    setIsLoading(true);
    let filters = {};
    if (selectedSearch === "players" && playerName) {
      filters.name = playerName;
    }
    if (location) {
      filters.location = location;
    }
    if (radius) {
      filters.radius = radius;
    }
    if (selectedSearch === "players") {
      filters.ntrp = `${ntrp[0]},${ntrp[1]}`;
      filters.utr = `${utr[0]},${utr[1]}`;
    }

    let results = {};
    let totalCount = 0;
    switch (selectedSearch) {
      case "players":
        results = await playerAPI.getPlayers(filters);
        totalCount = results.data.total_count;
        setPlayers(results.data.players);
        break;
      case "clubs":
        results = await clubAPI.getClubs(filters);
        totalCount = results.data.total_count;
        setClubs(results.data);
        break;
      case "events":
        results = await eventAPI.getEvents(filters);
        totalCount = results.total_count;
        setEvents(results.events);
        break;
      case "courts":
        results = await courtAPI.getCourts(filters);
        setCourts(results.courts);
        break;
      case "ladders":
        results = await ladderAPI.getLadders(filters);
        setLadders(results.ladders);
        break;
      default:
        break;
    }
    setTotalCount(totalCount || 0);
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
          <ToggleButton value="ladders">Ladders</ToggleButton>
        </ToggleButtonGroup>
      </FormControl>

      {selectedSearch === "players" && (
        <>
          <TextField
            label="Player Name"
            variant="outlined"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            fullWidth
            sx={{ marginBottom: "1rem" }}
          />
          <Typography>NTRP Level</Typography>
          <Slider
            min={2.0}
            max={6.5}
            step={0.5}
            value={ntrp}
            onChange={(e, newValue) => setNtrp(newValue)}
            valueLabelDisplay="auto"
          />
          <Typography>UTR Level</Typography>
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

      <Button variant="contained" onClick={updateSearch} sx={{ marginTop: "1rem" }}>Search</Button>
      <Divider sx={{ marginY: "1rem" }} />
      {isLoading ? (
        <CircularProgress size={80} />
      ) : (
        <List>
          {selectedSearch === "players" && players.map(player => (
            <Link to={"/players/" + player.id} key={player.id}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, pb: 2 }}>
                <ProfileImage player={player} /> {player.name}
              </Box>
            </Link>
          ))}
          {selectedSearch === "clubs" && clubs.map(club => (
            <Link to={'/clubs/' + club.id} key={club.id}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, pb: 2 }}>
                {club.name}
              </Box>
            </Link>
          ))}
          {selectedSearch === "events" && events.map(event => (
            <Link to={'/events/' + event.id} key={event.id}>
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
