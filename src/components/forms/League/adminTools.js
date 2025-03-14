import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Autocomplete,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Checkbox,
  FormControlLabel,
  Chip,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
import { clubAPI, eventAPI } from 'api/services';
import EventRestrictions from './restrictions';
import InfoPopup from '../infoPopup';
import PlayerSearch from '../Player/playerSearch';
import requestAPI from 'api/services/request';

const EventAdminTools = ({ event, participants, setEvent }) => {
  const [selectedSection, setSelectedSection] = useState('settings');
  const [loading, setLoading] = useState(false);

  // State for invitations and notifications
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const initialMessage = `Hello!\nI thought you might be interested in this event.`;
  const [message, setMessage] = useState(initialMessage);
  const [notification, setNotification] = useState('')

  // State for event updates
  const [restrictions, setRestrictions] = useState(event.restrictions || {});
  const [maxParticipants, setMaxParticipants] = useState(event.max_participants || '');
  const [startDate, setStartDate] = useState(event.start_date || '');
  const [endDate, setEndDate] = useState(event.end_date || '');
  const [registrationDate, setRegistrationDate] = useState(event.registration_open_date || '');
  const [isOpenRegistration, setIsOpenRegistration] = useState(event.is_open_registration);
  const [description, setDescription] = useState(event.description || '');
  const [admins, setAdmins] = useState(event.admins || []) 
  const [adminOptions, setAdminOptions] = useState([])


  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('info')

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  useEffect( () => {
    // get admin options
    clubAPI.getMembers(event.club.id).then((result) => {
      setAdminOptions(result.data.members)
      console.log(result.data.members)
      console.log(admins)
    });
  },[])

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return
    setSnackbarOpen(false)
  }

  const handleSendInvites = async () => {
    if (selectedPlayers.length === 0 || !message) return;
    try {
      setLoading(true);
      await requestAPI.sendInvites(event.id, 'event', selectedPlayers, message);
      //alert('Invitations sent successfully!');
      setSelectedPlayers([]);
      setMessage(initialMessage);
      showSnackbar('Invites successfully sent.')
    } catch (error) {
      console.error('Failed to send invites:', error);
      showSnackbar('Failed to send invites', 'error')
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (newRestrictions = restrictions) => {
    try {
      setLoading(true);
      console.log(newRestrictions, restrictions)
      const eventData = {
        restrictions: newRestrictions,
        max_participants: maxParticipants,
        start_date: startDate,
        end_date: endDate,
        is_open_registration: isOpenRegistration,
        registration_open_date: registrationDate,
        description,
      };
      console.log('eventData', eventData)
      const updatedEvent = await eventAPI.updateEvent(event.id, eventData);
      setEvent(updatedEvent);
    } catch (error) {
      console.error('Failed to update event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotifications = async () => {
    try {
      setLoading(true);
      await eventAPI.sendNotifications(event.id, notification);
      showSnackbar('Notification sent.');
    } catch (error) {
      console.error('Failed to send notifications:', error);
    } finally {
      setNotification('');
      setLoading(false);
    }
  };

  const handleAdminChange = async (e, newAdmins) => {
    console.log(newAdmins, event.created_by)
    // Ensure the owner stays in the list
    const filteredAdmins = newAdmins.some(admin => admin.id === event.created_by)
      ? newAdmins
      : [...newAdmins, [admins].find(member => member.id === event.created_by)];
    console.log(filteredAdmins)
    setAdmins(filteredAdmins);

    try {
      // Send only IDs to the backend
      await eventAPI.updateEvent(event.id, { admins: filteredAdmins.map(admin => admin.id) });
      showSnackbar("Admins updated successfully");
    } catch (error) {
      showSnackbar("Failed to update admins");
    }
  };

  return (
    <Box display="flex">

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Left-hand Menu */}
      <Paper elevation={3} sx={{ minWidth: 200, mr: 3 }}>
        <List component="nav">
          <ListItem disablePadding>
            <ListItemButton selected={selectedSection === 'settings'} onClick={() => setSelectedSection('settings')}>
              <ListItemText primary="General Settings" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton selected={selectedSection === 'admins'} onClick={() => setSelectedSection('admins')}>
              <ListItemText primary="Admins" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton selected={selectedSection === 'restrictions'} onClick={() => setSelectedSection('restrictions')}>
              <ListItemText primary="Restrictions" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton selected={selectedSection === 'notifications'} onClick={() => setSelectedSection('notifications')}>
              <ListItemText primary="Send Notifications" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton selected={selectedSection === 'invite'} onClick={() => setSelectedSection('invite')}>
              <ListItemText primary="Invite Players" />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>

      {/* Content Area */}
      <Box flex={1}>
        <Typography variant="h4" gutterBottom>
          Admin Tools
        </Typography>

        {selectedSection === 'admins' && (
          <Box mt={3}>
            <Typography variant="h6">Manage Admins</Typography>
            <Autocomplete
              multiple
              disableClearable
              options={adminOptions}
              getOptionLabel={(option) => option.name}
              value={admins}
              onChange={handleAdminChange}
              isOptionEqualToValue={(option, value) => option.id === value.id} // Ensure correct comparison
              renderInput={(params) => (
                <TextField {...params} label="Select Admins" />
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      //{...tagProps} 
                      label={option.name}
                      onDelete={option.id === event.created_by ? undefined : tagProps.onDelete} // Disable delete for owner
                      color={option.id === event.created_by ? "primary" : "default"} // Highlight owner
                    />
                  );
                })
              }
            />
          </Box>
        )}
        {/* Invite Players Section */}
        {selectedSection === 'invite' && (
          <Box>
            <Typography variant="h6">
              Invite Players
              <InfoPopup>A link to the event will automatically be included in the message.</InfoPopup>
            </Typography>
            <PlayerSearch
              setSelectedPlayer={(p) => {
                if (p)
                  setSelectedPlayers((prev) => [...prev, p])
              }}
            />
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedPlayers.map((player) => (
                <Chip
                  key={player.id}
                  label={player.name}
                  onDelete={() => setSelectedPlayers((prev) => prev.filter(sp => sp.id !== player.id))}
                />
              ))}
            </Box>
            <TextField
              label="Message"
              multiline
              rows={4}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)

              }}
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

        {/* Event Settings Section */}
        {selectedSection === 'settings' && (
          <Box>
            <Typography variant="h6">Update Settings</Typography>
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
              slotProps={{ inputLabel: { shrink: true } }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="End Date"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isOpenRegistration}
                  onChange={(e) => setIsOpenRegistration(e.target.checked)}
                />
              }
              label="Open Registration"
            />
            <InfoPopup size={20}>
              By selecting <b>Open Registration</b>, you allow players to sign themselves up for the event without needing admin approval, given that they meet the restrictions.
            </InfoPopup>
            {isOpenRegistration &&
              <TextField
                label="Registration Open"
                type="date"
                slotProps={{ inputLabel: { shrink: true } }}
                value={registrationDate}
                onChange={(e) => setRegistrationDate(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            }
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
              onClick={() => handleUpdateSettings()}
              disabled={loading}
            >
              Save
            </Button>
          </Box>
        )}

        {/* Restrictions Section */}
        {selectedSection === 'restrictions' && (
          <Box>
            <EventRestrictions
              restrictions={restrictions}
              updateRestrictions={(newRestrictions) => {
                setRestrictions(newRestrictions);
                handleUpdateSettings(newRestrictions);
              }}
            />
          </Box>
        )}
        {/* Send Notifications Section */}
        {selectedSection === 'notifications' && (
          <Box>
            <Typography variant="h6">Notify all Participants</Typography>
            <TextField
              label="Message to Participants"
              multiline
              rows={4}
              value={notification}
              onChange={(e) => setNotification(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendNotifications}
              disabled={loading || !notification}
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

export default EventAdminTools;
