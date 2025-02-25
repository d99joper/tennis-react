import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Slider, Typography, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import { playerAPI } from "api/services";
import { AutoCompletePlaces } from "components/forms";
import useGoogleMapsApi from "helpers/useGoogleMapsApi";

const PlayersLandingPage = () => {
  const mapApi = useGoogleMapsApi();
  const [name, setName] = useState("");
  const [ntrp, setNtrp] = useState([2.0, 5.0]);
  const [utr, setUtr] = useState([2.0, 10.0]);
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(15);
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  
  useEffect(() => {
    if (mapApi && !map) {
      const newMap = new mapApi.Map(document.getElementById("map"), {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 5,
      });
      setMap(newMap);
    }
  }, [mapApi]);

  const updateSearch = async () => {
    setIsLoading(true);
    let filters = {};
    if (name) filters.name = name;
    filters.ntrp = `${ntrp[0]},${ntrp[1]}`;
    filters.utr = `${utr[0]},${utr[1]}`;
    if (location) filters.geo = `${location.lat},${location.lng},${radius}`;
    
    const results = await playerAPI.getPlayers(filters);
    setPlayers(results.data.players);
    setIsLoading(false);
    
    if (map) updateMapMarkers(results.data.players);
  };

  const updateMapMarkers = (players) => {
    if (!mapApi || !map) return;
    markers.forEach(marker => marker.setMap(null));
    
    const groupedLocations = {};
    players.forEach(player => {
      const key = `${player.lat},${player.lng}`;
      if (!groupedLocations[key]) groupedLocations[key] = [];
      groupedLocations[key].push(player);
    });
    
    const newMarkers = Object.keys(groupedLocations).map(key => {
      const [lat, lng] = key.split(",").map(Number);
      const playersAtLocation = groupedLocations[key];
      
      const marker = new mapApi.Marker({
        position: { lat, lng },
        map,
        label: playersAtLocation.length > 1 ? `${playersAtLocation.length}` : "",
      });
      
      marker.addListener("click", () => {
        alert(playersAtLocation.map(p => p.name).join("\n"));
      });
      
      return marker;
    });
    
    setMarkers(newMarkers);
  };

  return (
    <Box display="flex" height="100vh">
      <Box width="30%" p={2}>
        <Typography variant="h6">Find Players</Typography>
        <TextField label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />
        <Typography>NTRP Range</Typography>
        <Slider value={ntrp} min={2.0} max={6.5} step={0.5} onChange={(e, val) => setNtrp(val)} valueLabelDisplay="auto" />
        <Typography>UTR Range</Typography>
        <Slider value={utr} min={1.0} max={17.0} step={0.1} onChange={(e, val) => setUtr(val)} valueLabelDisplay="auto" />
        <AutoCompletePlaces onPlaceChanged={setLocation} showGetUserLocation={true} />
        <Typography>Radius: {radius} miles</Typography>
        <Slider min={5} max={100} step={5} value={radius} onChange={(e, val) => setRadius(val)} valueLabelDisplay="auto" />
        <Button variant="contained" fullWidth onClick={updateSearch} sx={{ mt: 2 }}>Search</Button>
        <List>
          {isLoading ? <CircularProgress /> : players.map(player => (
            <ListItem key={player.id}>
              <ListItemText primary={player.name} secondary={player.location} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box width="70%" id="map" sx={{ height: "100vh" }}></Box>
    </Box>
  );
};

export default PlayersLandingPage;
