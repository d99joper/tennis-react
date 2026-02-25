import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Checkbox,
  FormControlLabel,
  Chip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { eventAPI } from 'api/services';
import divisionAPI from 'api/services/divisions';
import EventRestrictions from '../League/restrictions';
import InfoPopup from '../infoPopup';
import { ProfileImage } from '../ProfileImage';
import TeamDisplayName from '../Team/TeamDisplayName';

const DivisionAdminTools = ({ event, division, setEvent }) => {
  const [selectedSection, setSelectedSection] = useState('divisionSettings');
  const [loading, setLoading] = useState(false);

  // Division settings state
  const [divisionName, setDivisionName] = useState(division?.name || '');
  const [divisionDescription, setDivisionDescription] = useState(division?.description || '');
  const [divisionStartDate, setDivisionStartDate] = useState(division?.start_date || '');
  const [divisionEndDate, setDivisionEndDate] = useState(division?.end_date || '');

  // Override settings state (from division.override_settings)
  const overrideSettings = division?.override_settings || {};
  const [divisionRegistrationDate, setDivisionRegistrationDate] = useState(overrideSettings.registration_open_date || '');
  const [divisionIsOpenRegistration, setDivisionIsOpenRegistration] = useState(
    overrideSettings.is_open_registration !== undefined ? overrideSettings.is_open_registration : event.is_open_registration
  );
  const [divisionMaxParticipants, setDivisionMaxParticipants] = useState(overrideSettings.max_participants || '');
  const [divisionAllowSelfReportScores, setDivisionAllowSelfReportScores] = useState(
    overrideSettings.allow_self_report_scores !== undefined ? overrideSettings.allow_self_report_scores : event.allow_self_report_scores || false
  );
  const [divisionRestrictions, setDivisionRestrictions] = useState(overrideSettings.restrictions || {});

  // Participant management state
  const [divisionParticipants, setDivisionParticipants] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // Update state when division prop changes
  useEffect(() => {
    if (division) {
      setDivisionName(division.name || '');
      setDivisionDescription(division.description || '');
      setDivisionStartDate(division.start_date || '');
      setDivisionEndDate(division.end_date || '');
      const os = division.override_settings || {};
      setDivisionRegistrationDate(os.registration_open_date || '');
      setDivisionIsOpenRegistration(
        os.is_open_registration !== undefined ? os.is_open_registration : event.is_open_registration
      );
      setDivisionMaxParticipants(os.max_participants || '');
      setDivisionAllowSelfReportScores(
        os.allow_self_report_scores !== undefined ? os.allow_self_report_scores : event.allow_self_report_scores || false
      );
      setDivisionRestrictions(os.restrictions || {});
    }
  }, [division, event.is_open_registration, event.allow_self_report_scores]);

  // Fetch participants when the participants section is selected
  useEffect(() => {
    if (selectedSection === 'divisionParticipants' && division) {
      fetchParticipants();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSection, division?.id]);

  const fetchParticipants = async () => {
    try {
      setLoadingParticipants(true);
      // Fetch division participants
      const divParticipants = await divisionAPI.getDivisionParticipants(division.id);
      setDivisionParticipants(divParticipants || []);

      // Fetch all event participants (high limit to get all for admin management)
      const res = await eventAPI.getParticipants(event.id, { include_divisions: true }, 1, 1000);
      setAllParticipants(res.data || []);
    } catch (error) {
      console.error('Failed to fetch participants:', error);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const handleUpdateDivisionSettings = async (newRestrictions = divisionRestrictions) => {
    if (!division) return;
    try {
      setLoading(true);
      const data = {
        name: divisionName,
        description: divisionDescription,
        start_date: divisionStartDate || null,
        end_date: divisionEndDate || null,
        override_settings: {
          ...overrideSettings,
          registration_open_date: divisionRegistrationDate || null,
          is_open_registration: divisionIsOpenRegistration,
          max_participants: divisionMaxParticipants ? parseInt(divisionMaxParticipants) : null,
          allow_self_report_scores: divisionAllowSelfReportScores,
          restrictions: newRestrictions,
        },
      };
      await divisionAPI.updateDivision(division.id, data);
      showSnackbar('Division settings saved successfully', 'success');

      // Refresh event to get updated division data
      try {
        const updatedEvent = await eventAPI.getEvent(event.id);
        setEvent(updatedEvent);
      } catch (fetchError) {
        console.error('Error fetching updated event:', fetchError);
      }
    } catch (error) {
      console.error('Failed to update division:', error);
      showSnackbar('Failed to update division settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddParticipant = (participant) => {
    setConfirmDialog({
      open: true,
      title: 'Add Participant',
      message: `Are you sure you want to add "${participant.name}" to the "${division.name}" division?`,
      onConfirm: async () => {
        try {
          setLoading(true);
          await divisionAPI.addDivisionPlayers(division.id, [participant.id]);
          showSnackbar(`${participant.name} added to ${division.name}`, 'success');
          await fetchParticipants();
          // Refresh event to update division data
          try {
            const updatedEvent = await eventAPI.getEvent(event.id);
            setEvent(updatedEvent);
          } catch (fetchError) {
            console.error('Error fetching updated event:', fetchError);
          }
        } catch (error) {
          console.error('Failed to add participant:', error);
          showSnackbar('Failed to add participant', 'error');
        } finally {
          setLoading(false);
          setConfirmDialog({ open: false, title: '', message: '', onConfirm: null });
        }
      },
    });
  };

  const handleRemoveParticipant = (participant) => {
    setConfirmDialog({
      open: true,
      title: 'Remove Participant',
      message: `Are you sure you want to remove "${participant.name}" from the "${division.name}" division?`,
      onConfirm: async () => {
        try {
          setLoading(true);
          await divisionAPI.removeDivisionPlayers(division.id, [participant.id]);
          showSnackbar(`${participant.name} removed from ${division.name}`, 'success');
          await fetchParticipants();
          // Refresh event to update division data
          try {
            const updatedEvent = await eventAPI.getEvent(event.id);
            setEvent(updatedEvent);
          } catch (fetchError) {
            console.error('Error fetching updated event:', fetchError);
          }
        } catch (error) {
          console.error('Failed to remove participant:', error);
          showSnackbar('Failed to remove participant', 'error');
        } finally {
          setLoading(false);
          setConfirmDialog({ open: false, title: '', message: '', onConfirm: null });
        }
      },
    });
  };

  const handleCloseDialog = () => {
    setConfirmDialog({ open: false, title: '', message: '', onConfirm: null });
  };

  // Get participants not yet in this division
  const availableParticipants = allParticipants.filter(
    (p) => !divisionParticipants.some((dp) => dp.id === p.id)
  );

  if (!division) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Select a division to manage its settings.
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex">
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={handleCloseDialog}>
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={confirmDialog.onConfirm}
            color={confirmDialog.title === 'Remove Participant' ? 'error' : 'primary'}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Left-hand Menu */}
      <Paper elevation={3} sx={{ minWidth: 200, mr: 3 }}>
        <List component="nav">
          <ListItem sx={{ py: 0.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
              Division: {division.name}
            </Typography>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton selected={selectedSection === 'divisionSettings'} onClick={() => setSelectedSection('divisionSettings')}>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton selected={selectedSection === 'divisionRestrictions'} onClick={() => setSelectedSection('divisionRestrictions')}>
              <ListItemText primary="Restrictions" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton selected={selectedSection === 'divisionParticipants'} onClick={() => setSelectedSection('divisionParticipants')}>
              <ListItemText primary="Participants" />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>

      {/* Content Area */}
      <Box flex={1}>
        <Typography variant="h5" gutterBottom>
          {division.name} — Division Admin
        </Typography>

        {/* Division Settings */}
        {selectedSection === 'divisionSettings' && (
          <Box>
            <TextField
              label="Division Name"
              value={divisionName}
              onChange={(e) => setDivisionName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              multiline
              rows={4}
              value={divisionDescription}
              onChange={(e) => setDivisionDescription(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Max Participants"
              type="number"
              value={divisionMaxParticipants}
              onChange={(e) => setDivisionMaxParticipants(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Start Date"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={divisionStartDate}
              onChange={(e) => setDivisionStartDate(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label={
                <Typography>
                  End Date &nbsp;
                  <InfoPopup>
                    No matches can be reported after the end date for this division.
                  </InfoPopup>
                </Typography>
              }
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={divisionEndDate}
              onChange={(e) => setDivisionEndDate(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={divisionIsOpenRegistration}
                  onChange={(e) => setDivisionIsOpenRegistration(e.target.checked)}
                />
              }
              label="Open Registration"
            />
            <InfoPopup size={20}>
              By selecting <b>Open Registration</b>, you allow players to sign themselves up for this division without needing admin approval, given that they meet the restrictions.
            </InfoPopup>
            {divisionIsOpenRegistration && (
              <TextField
                label="Registration Open Date"
                type="date"
                slotProps={{ inputLabel: { shrink: true } }}
                value={divisionRegistrationDate}
                onChange={(e) => setDivisionRegistrationDate(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={divisionAllowSelfReportScores}
                  onChange={(e) => setDivisionAllowSelfReportScores(e.target.checked)}
                />
              }
              label="Allow Self-Report Scores"
              sx={{ mb: 2 }}
            />
            <InfoPopup size={20}>
              By enabling <b>Allow Self-Report Scores</b>, participants in this division can report their own match scores without admin approval.
            </InfoPopup>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleUpdateDivisionSettings()}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : 'Save Division Settings'}
              </Button>
            </Box>
          </Box>
        )}

        {/* Division Restrictions */}
        {selectedSection === 'divisionRestrictions' && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Set restrictions specific to this division. These override the event-level restrictions for this division.
            </Typography>
            <EventRestrictions
              restrictions={divisionRestrictions}
              updateRestrictions={(newRestrictions) => {
                setDivisionRestrictions(newRestrictions);
                handleUpdateDivisionSettings(newRestrictions);
              }}
            />
          </Box>
        )}

        {/* Division Participants */}
        {selectedSection === 'divisionParticipants' && (
          <Box>
            {loadingParticipants ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {/* Current division participants */}
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Current Participants ({divisionParticipants.length})
                </Typography>
                {divisionParticipants.length > 0 ? (
                  <Paper sx={{ p: 2, mb: 3 }}>
                    {divisionParticipants.map((participant) => (
                      <Box
                        key={participant.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 1,
                          borderRadius: 1,
                          '&:hover': { backgroundColor: 'action.hover' },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {participant.players && participant.players.length > 1 ? (
                            <TeamDisplayName team={participant} size={16} showInitials={true} />
                          ) : (
                            <ProfileImage
                              player={participant?.players?.[0] || participant}
                              size={32}
                              showName={true}
                            />
                          )}
                        </Box>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleRemoveParticipant(participant)}
                          disabled={loading}
                          sx={{ textTransform: 'none' }}
                        >
                          Remove
                        </Button>
                      </Box>
                    ))}
                  </Paper>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    No participants in this division yet.
                  </Typography>
                )}

                {/* Available participants to add */}
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Available Participants ({availableParticipants.length})
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  These are event participants not yet assigned to this division.
                </Typography>
                {availableParticipants.length > 0 ? (
                  <Paper sx={{ p: 2 }}>
                    {availableParticipants.map((participant) => (
                      <Box
                        key={participant.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 1,
                          borderRadius: 1,
                          '&:hover': { backgroundColor: 'action.hover' },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {participant.players && participant.players.length > 1 ? (
                            <TeamDisplayName team={participant} size={16} showInitials={true} />
                          ) : (
                            <ProfileImage
                              player={participant?.players?.[0] || participant}
                              size={32}
                              showName={true}
                            />
                          )}
                          {/* Show other division assignments */}
                          {participant.divisions && participant.divisions.length > 0 && (
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {participant.divisions.map((div) => (
                                <Chip
                                  key={div.id}
                                  label={div.name}
                                  size="small"
                                  sx={{ fontSize: '0.7rem', height: 20 }}
                                />
                              ))}
                            </Box>
                          )}
                        </Box>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => handleAddParticipant(participant)}
                          disabled={loading}
                          sx={{ textTransform: 'none' }}
                        >
                          Add
                        </Button>
                      </Box>
                    ))}
                  </Paper>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    All event participants are already assigned to this division.
                  </Typography>
                )}
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DivisionAdminTools;
