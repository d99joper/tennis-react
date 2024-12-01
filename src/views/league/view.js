import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const LeagueViewPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentTab, setCurrentTab] = useState(0);

  // Mock data
  const league = {
    name: 'Summer League',
    description: 'A fun summer league for tennis enthusiasts.',
  };

  const standings = [
    { name: 'Player 1', wins: 5 },
    { name: 'Player 2', wins: 4 },
    { name: 'Player 3', wins: 3 },
  ];

  const schedule = [
    { round: 1, match: 'Player 1 vs Player 2', date: '2024-07-01' },
    { round: 2, match: 'Player 1 vs Player 3', date: '2024-07-08' },
    { round: 3, match: 'Player 2 vs Player 3', date: '2024-07-15' },
  ];

  const matches = [
    { match: 'Player 1 vs Player 2', score: '6-3, 6-4', date: '2024-07-01' },
    { match: 'Player 1 vs Player 3', score: '6-2, 7-5', date: '2024-07-08' },
  ];

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ mt: 4, px: isMobile ? 2 : 4 }}>
      <Typography variant="h4" gutterBottom>
        {league.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {league.description}
      </Typography>

      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant={isMobile ? 'scrollable' : 'fullWidth'}
      >
        <Tab label="Standings" />
        <Tab label="Schedule" />
        <Tab label="Matches" />
      </Tabs>

      {currentTab === 0 && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            Standings
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Player</TableCell>
                  <TableCell>Wins</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {standings.map((player, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>{player.wins}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {currentTab === 1 && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            Schedule
          </Typography>
          <List>
            {schedule.map((item, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Round ${item.round}: ${item.match}`}
                  secondary={`Date: ${item.date}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {currentTab === 2 && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            Matches
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Match</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {matches.map((match, index) => (
                  <TableRow key={index}>
                    <TableCell>{match.match}</TableCell>
                    <TableCell>{match.score}</TableCell>
                    <TableCell>{match.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default LeagueViewPage;
