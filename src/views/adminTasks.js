import { useState, useEffect, useMemo } from "react";
import { Button, Card, FormControl, InputLabel, MenuItem, Select, Tab, Tabs, Box, TextField } from "@mui/material";
import { useSearchParams, Link } from "react-router-dom";
import { authAPI, ladderAPI, matchAPI, playerAPI } from "api/services";
import AddPlayerToClub from "features/club/components/addPlayerToClub";
import CreateClub from "features/club/components/create_club";
import ErrorHandler from "shared/components/Error/error";
import MatchEditor from "features/match/components/MatchEditor";
import { SelectWithFetch } from "shared/components/Autocomplete/SelectFetch";
import ClubSearchAutocomplete from "features/club/components/club_search";
import { enums, helpers, matchHelper } from "helpers";
import XLSX from 'xlsx';
import PlayerSearch from "features/player/components/playerSearch";
import { Helmet } from "react-helmet-async";

const AdminTasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [player, setPlayer] = useState({});
  const [ladders, setLadders] = useState([]);
  const [players, setPlayers] = useState([]);
  const [ladderId, setLadderId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [error, setError] = useState(null);

  // Tab name mappings
  const tabNameToIndex = useMemo(() => ({
    'matches': 0,
    'players': 1,
    'player-to-ladder': 2,
    'other': 3,
    'theme': 4,
  }), []);

  const indexToTabName = useMemo(() => ({
    0: 'matches',
    1: 'players',
    2: 'player-to-ladder',
    3: 'other',
    4: 'theme',
  }), []);

  // Derive tab from URL parameter
  const tabParam = searchParams.get('tab') || 'matches';
  const tabIndex = tabNameToIndex[tabParam] ?? 0;

  useEffect(() => {
    async function getData() {
      const ladders = await ladderAPI.getLadders();
      return { ladders: ladders.ladders, players: [] };
    }
    getData().then((data) => {
      setLadders(data.ladders);
      setPlayers(data.players);
    });
  }, []);

  async function importMatches(e) {
    const file = e.target.files[0];
    console.log(file)
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data);
    const matchArray = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { raw: false });
    matchAPI.createMatchesFromArray(matchArray);
  }

  function addPlayer() {
    if (player?.name?.length > 3) {
      playerAPI.createPlayer(player).then((response) => {
        if (response.error) {
          setError(response.error);
        }
      });
    }
  }

  function addPlayerToLadder() {
    ladderAPI.addPlayerToLadder(playerId, ladderId);
  }

  function updateLadder() {
    ladderAPI.updateLadder({ id: '35a52e5b-d915-4b84-a4e0-22f2906305a6', match_type: enums.MATCH_TYPE.DOUBLES });
  }

  function handlePlayerChange(value, type) {
    setPlayer((prevPlayer) => ({ ...prevPlayer, [type]: value }));
  }

  const handleGetUser = () => {
    authAPI.getUser();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Helmet>
        <title>Admin tasks | My Tennis Space</title>
      </Helmet>
      <ErrorHandler error={error} />

      {/* Tabs Navigation */}
      <Tabs 
        value={tabIndex} 
        onChange={(e, newValue) => {
          const tabName = indexToTabName[newValue];
          if (tabName) {
            setSearchParams({ tab: tabName }, { replace: true });
          }
        }} 
        variant="scrollable"
      >
        <Tab label="Matches" />
        <Tab label="Players" />
        <Tab label="Player to Ladder" />
        <Tab label="Other" />
        <Tab label="Theme" />
      </Tabs>

      {/* Matches Tab */}
      {tabIndex === 0 && (
        <Box sx={{ mt: 2 }}>
          <Card sx={{ p: 2, mb: 2 }}>
            <input onChange={importMatches} type="file" />
            Import Matches
          </Card>
          <Card sx={{ p: 2 }}>
            <Button onClick={handleGetUser}>Get User</Button>
          </Card>
        </Box>
      )}

      {/* Players Tab */}
      {tabIndex === 1 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400, mt: 2 }}>
          Create a new player:
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            onChange={(e) => handlePlayerChange(e.target.value, "name")}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            onChange={(e) => handlePlayerChange(e.target.value, "email")}
          />
          <Button variant="contained" onClick={addPlayer}>
            Add Player
          </Button>
        </Box>
      )}

      {/* Player to Ladder Tab */}
      {tabIndex === 2 && (
        <Box sx={{ mt: 2 }}>
          <FormControl sx={{ minWidth: 120, width: 300, mb: 2 }}>
            <InputLabel id="select-ladders-label">Ladders</InputLabel>
            <Select
              labelId="select-ladders-label"
              value={ladderId}
              onChange={(e) => setLadderId(e.target.value)}
            >
              {ladders?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120, width: 300, mb: 2 }}>
            <PlayerSearch />
          </FormControl>

          <Button onClick={addPlayerToLadder} sx={{ mr: 2 }}>Add Player to Ladder</Button>
          <Button onClick={updateLadder} color="primary">Update Ladder</Button>
        </Box>
      )}

      {/* Other Tab */}
      {tabIndex === 3 && (
        <Box sx={{ mt: 2 }}>
          <CreateClub />
          <AddPlayerToClub />
          <ClubSearchAutocomplete />
        </Box>
      )}

      {/* Theme Tab */}
      {tabIndex === 4 && (
        <Box sx={{ mt: 2 }}>
          <Card sx={{ p: 2 }}>
            <Button 
              variant="contained" 
              component={Link} 
              to="/theme-selector"
              sx={{ mb: 2 }}
            >
              Open Theme Selector
            </Button>
            <Box sx={{ mt: 2 }}>
              The theme selector allows you to preview and choose from 5 different color schemes for the application.
            </Box>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default AdminTasks;
