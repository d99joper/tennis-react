import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Chip,
  Autocomplete,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import leagueAPI from 'api/services/league';
import { eventAPI } from 'api/services';

const LeagueAdminTools = ({ league, participants, setLeague }) => {
  const [selectedSection, setSelectedSection] = useState('settings');
  const [loading, setLoading] = useState(false);

  // State for invitations and notifications
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [message, setMessage] = useState('');

  // State for league updates
  const [restrictions, setRestrictions] = useState(league.restrictions || {});
  const [maxParticipants, setMaxParticipants] = useState(league.max_participants || '');
  const [startDate, setStartDate] = useState(league.start_date || '');
  const [endDate, setEndDate] = useState(league.end_date || '');
  const [description, setDescription] = useState(league.description || '');
  
  const handleSendInvites = async () => {
    if (selectedPlayers.length === 0 || !message) return;
    try {
      setLoading(true);
      await leagueAPI.sendInvites(league.id, {
        recipients: selectedPlayers.map((player) => player.id),
        message,
      });
      alert('Invitations sent successfully!');
      setSelectedPlayers([]);
      setMessage('');
    } catch (error) {
      console.error('Failed to send invites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    try {
      setLoading(true);
      const updatedLeague = await eventAPI.updateEvent(league.id, {
        restrictions,
        max_participants: maxParticipants,
        start_date: startDate,
        end_date: endDate,
        description,
      });
      setLeague(updatedLeague);
      alert('League updated successfully!');
    } catch (error) {
      console.error('Failed to update league:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotifications = async () => {
    try {
      setLoading(true);
      await leagueAPI.sendNotifications(league.id, { message });
      alert('Notification sent to all participants!');
      setMessage('');
    } catch (error) {
      console.error('Failed to send notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex">
      {/* Left-hand Menu */}
      <Paper elevation={3} sx={{ minWidth: 200, mr: 3 }}>
        <List component="nav">
          <ListItem disablePadding>
            <ListItemButton selected={selectedSection === 'settings'} onClick={() => setSelectedSection('settings')}>
              <ListItemText primary="League Settings" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton selected={selectedSection === 'invite'} onClick={() => setSelectedSection('invite')}>
              <ListItemText primary="Invite Players" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton selected={selectedSection === 'notifications'} onClick={() => setSelectedSection('notifications')}>
              <ListItemText primary="Send Notifications" />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>

      {/* Content Area */}
      <Box flex={1}>
        <Typography variant="h4" gutterBottom>
          League Admin Tools
        </Typography>

        {/* Invite Players Section */}
        {selectedSection === 'invite' && (
          <Box>
            <Typography variant="h6">Invite Players</Typography>
            <Autocomplete
              multiple
              options={participants || []}
              getOptionLabel={(option) => option.name}
              onChange={(event, value) => setSelectedPlayers(value)}
              value={selectedPlayers}
              renderInput={(params) => <TextField {...params} label="Select Players" placeholder="Add Players" />}
            />
            <TextField
              label="Message"
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendInvites}
              disabled={loading || !message || selectedPlayers.length === 0}
              sx={{ mt: 2 }}
            >
              Send Invitations
            </Button>
          </Box>
        )}

        {/* League Settings Section */}
        {selectedSection === 'settings' && (
          <Box>
            <Typography variant="h6">Update League Settings</Typography>
            <TextField
              label="Max Participants"
              type="number"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateSettings}
              disabled={loading}
            >
              Update League
            </Button>
          </Box>
        )}

        {/* Send Notifications Section */}
        {selectedSection === 'notifications' && (
          <Box>
            <Typography variant="h6">Send Notifications</Typography>
            <TextField
              label="Message to Players"
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendNotifications}
              disabled={loading || !message}
              sx={{ mt: 2 }}
            >
              Send Notifications
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LeagueAdminTools;
