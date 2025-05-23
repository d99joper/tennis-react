import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Button, Tabs, Tab, Switch, Snackbar, Pagination, TextField, IconButton, capitalize, Autocomplete, Chip, DialogContent, Select, MenuItem, LinearProgress } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import clubAPI from 'api/services/club';
import ResponsiveDataLayout from 'components/layout/Data/responsiveDataLayout';
import { AddPlayerToClub, Editable, ProfileImage } from 'components/forms';
import requestAPI from 'api/services/request';
import { AiFillEdit } from 'react-icons/ai';
import MyModal from 'components/layout/MyModal';
import CreateLeague from 'components/forms/League/create';
import { MdArchive, MdCheckCircleOutline, MdClose, MdDelete } from 'react-icons/md';
import { AuthContext } from 'contexts/AuthContext';
import { GiExitDoor } from 'react-icons/gi';
import notificationAPI from 'api/services/notifications';
import JoinRequest from 'components/forms/Notifications/joinRequests';
import { Helmet } from 'react-helmet-async';
import { eventAPI } from 'api/services';
import { helpers } from 'helpers';
import DOMPurify from "dompurify";

const ClubViewPage = () => {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [activeEvents, setActiveEvents] = useState([]);
  const [archivedEvents, setArchivedEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [archivedEventsPage, setArchivedEventsPage] = useState(1);
  const [archivedEventsTotalPages, setArchivedEventsTotalPages] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0 for Events, 1 for Members
  const [showArchivedEvents, setShowArchivedEvents] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [editFields, setEditFields] = useState({ name: false, description: false });
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [memberToRemove, setMemberToRemove] = useState(null); // Track member for removal
  const [eventToRemove, setEventToRemove] = useState(null); // Track event for removal
  const [eventToArchive, setEventToArchive] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [eventType, setEventType] = useState("");
  const { user } = useContext(AuthContext)

  useEffect(() => {

    async function fetchClubDetails() {
      const response = await clubAPI.getClub(clubId);
      const { club, active_events, members_count, total_events_count, active_events_count } =
        response.data;
      setClub({
        ...club,
        members_count,
        total_events_count,
        active_events_count,
      });

      setIsLoaded(true);
      setIsMember(club.is_member);
      setIsAdmin(club.is_admin);
      setActiveEvents(active_events);
      setFormData({ name: club.name, description: club.description });
    }
    fetchClubDetails();

  }, [clubId]);

  const handleRemoveMember = async () => {
    if (memberToRemove) {
      try {
        await clubAPI.removePlayer(club.id, memberToRemove.id); // API call to remove member
        setMembers((prev) => prev.filter((m) => m.id !== memberToRemove.id)); // Remove from UI
        setSnackbar({ open: true, message: `${memberToRemove.name} has been removed.` });
        setMemberToRemove(null)
      } catch (error) {
        setSnackbar({ open: true, message: "Failed to remove member." });
      }
    }
    setShowModal(false);
  };

  const handleEditToggle = (field) => {
    setEditFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleSave = async (field) => {
    try {
      const updatedData = { [field]: formData[field] };
      await clubAPI.updateClub(club.id, updatedData);
      setClub((prev) => ({ ...prev, ...updatedData }));
      handleEditToggle(field);
      setSnackbar({ open: true, message: `${field} updated successfully` });
    } catch (error) {
      setSnackbar({ open: true, message: `Failed to update ${field}` });
    }
  };

  const fetchMembers = async () => {
    setIsFetching(true);
    try {
    const response = await clubAPI.getMembers(club.id,);
    setMembers(response.data.members);
    const selectedAdmins = response.data.members.filter(member => club.admins.includes(member.id));
    //console.log(selectedAdmins);
    setAdmins(selectedAdmins);
    }
    catch(e) {
      console.log(e)
    }
    finally {
      setIsFetching(false)
    }
  };

  const fetchArchivedEvents = async (page) => {
    const response = await clubAPI.getArchivedEvents(club.id, page);
    console.log(response)
    setArchivedEvents(response.archived_events);
    setArchivedEventsTotalPages(response.total_pages);
  };

  const fetchRequests = async () => {
    const response = await requestAPI.getPendingRequests(club.id);
    setRequests(response.data.notifications)
  }

  const handleApproveDenyRequest = async (id, approve) => {
    try {
      const response = await requestAPI.processRequest(id, approve);

      setRequests((prevRequests) =>
        prevRequests.map((r) =>
          r.id === id ? { ...r, status: approve ? "approved" : "denied" } : r
        )
      );
      // add to member list if approved
      if (approve) {
        const sender = requests.find((r) => r.id === id)?.sender;
        if (sender)
          setMembers((prevMembers) => [...prevMembers, sender]);
      }

      setSnackbar({ open: true, message: response.data.message });
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to process the request" });
    }
  }

  const handleDeleteRequest = async (id) => {
    const response = await notificationAPI.deleteNotification(id);
    setRequests((prev) => {
      // Remove the request from the list
      return prev.filter((r) => r.id !== id);
    });
    setSnackbar({ open: true, message: "Request deleted" });
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue !== 0 && members.length === 0) {
      fetchMembers();
    }
    if (newValue === 2 && requests.length === 0) {
      fetchRequests();
    }
  };

  const handleAdminChange = async (event, newAdmins) => {
    // Ensure the owner stays in the list
    const filteredAdmins = newAdmins.some(admin => admin.id === club.created_by)
      ? newAdmins
      : [...newAdmins, members.find(member => member.id === club.created_by)];

    setAdmins(filteredAdmins);

    try {
      // Send only IDs to the backend
      await clubAPI.updateClub(club.id, { admins: filteredAdmins.map(admin => admin.id) });
      setSnackbar({ open: true, message: "Admins updated successfully" });
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to update admins" });
    }
  };

  const handleDeleteEvent = async () => {
    if (eventToRemove) {
      try {
        const response = await eventAPI.deleteEvent(eventToRemove.id);
        console.log(response)
        setEventToRemove(null)
        if (response.status !== 204) {
          setSnackbar({ open: true, message: "Failed to remove event." });
        }
        else {
          setActiveEvents((prev) => prev.filter((e) => e.id !== eventToRemove.id)); // Remove from UI
          setArchivedEvents((prev) => prev.filter((e) => e.id !== eventToRemove.id)); // Remove from UI
          setSnackbar({ open: true, message: `${eventToRemove.name} has been removed.` });
        }
      } catch (error) {
        setSnackbar({ open: true, message: "Failed to remove event." });
      }
    }
    setShowModal(false);
  }

  const handleArchiveEvent = async () => {
    if (eventToArchive) {
      try {
        const response = await eventAPI.archiveEvent(eventToArchive.id);
        console.log(response, response.status !== 204, response.status)
        setEventToArchive(null)
        if (response?.status !== 204) {
          setSnackbar({ open: true, message: "Failed to archive event." });
        }
        else {
          setActiveEvents((prev) => prev.filter((e) => e.id !== eventToArchive.id)); // Remove from UI
          let newArchivedEvents = archivedEvents
          newArchivedEvents.push(eventToArchive)
          // checking here
          setArchivedEvents(newArchivedEvents); // Add to UI
          setSnackbar({ open: true, message: `${eventToArchive.name} has been archived.` });
        }
      } catch (error) {
        setSnackbar({ open: true, message: "Failed to archive event." });
      }
    }
    setShowModal(false);
  }

  const renderEventForm = () => {
    switch (eventType) {
      case "league":
        return <CreateLeague club={club} admins={admins}
          onSuccess={(newEvent) => {
            setActiveEvents((prev) =>
              [...prev, newEvent].sort((a, b) => {
                const dateDiff = new Date(a.start_date) - new Date(b.start_date);
                if (dateDiff !== 0) return dateDiff; // Sort by start_date first
                return a.name.localeCompare(b.name); // If same start_date, sort by name
              })
            );
            setShowCreate(false)
            setEventType("")
          }}
        />;
      case "tournament":
        return <Typography>Not yet implemented</Typography>;
      case "social":
        return <Typography>Not yet implemented</Typography>;
      default:
        return null;
    }
  };

  if (!isLoaded) return <LinearProgress />;

  return (
    <Box p={2}>
      {club && (
        <Box as='form'>
          <Helmet>
            <title>{club.name} | MyTennis Space</title>
          </Helmet>
          <Editable
            isEditing={editFields.name}
            text={
              <Box display="flex" alignItems="center" width="100%">
                <Typography variant="h4">{club.name}</Typography>
                {isAdmin && (
                  <IconButton size="small" sx={{ ml: 1 }} onClick={() => handleEditToggle('name')}>
                    <AiFillEdit size={16} />
                  </IconButton>
                )}
              </Box>
            }>
            <>
              <Box display="flex" alignItems="center" gap={1}>
                <TextField name="name" value={formData.name} onChange={handleChange} size="small" />
                <Button variant="contained" onClick={() => handleSave('name')}>Save</Button>
                <Button variant="outlined" onClick={() => handleEditToggle('name')}>Cancel</Button>
              </Box>
            </>
          </Editable>
          <Editable
            isEditing={editFields.description}
            width={'100%'}
            text={
              <Box display="flex" alignItems="center">
                <Typography variant="body1"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(helpers.parseTextToHTML(club.description)) }}
                />
                {isAdmin && (
                  <IconButton size="small" sx={{ ml: 1 }} onClick={() => handleEditToggle('description')}>
                    <AiFillEdit size={16} />
                  </IconButton>
                )}
              </Box>
            }
          >
            <Box display="flex" flexDirection={'column'} width="100%" gap={1} mt={2}>
              <TextField
                name="description"
                value={formData.description}
                onChange={handleChange}
                size="small"
                fullWidth

                multiline
              />
              <Box display={'flex'} alignItems={'left'} gap={3}>
                <Button variant="contained" onClick={() => handleSave('description')}>Save</Button>
                <Button variant="outlined" onClick={() => handleEditToggle('description')}>Cancel</Button>
              </Box>
            </Box>
          </Editable>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Location: {club.address || club.city?.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Active Events: {club.active_events_count} | Total Events: {club.total_events_count} | Members: {club.members_count}
          </Typography>

          <JoinRequest objectType={'club'} id={club.id} isMember={isMember} />

          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mt: 3 }}>
            <Tab label="Events" />
            <Tab label="Members" />
            {isAdmin && <Tab label="Admin" />}
          </Tabs>
          {activeTab === 0 && (
            <>
              <MyModal
                showHide={showCreate}
                onClose={() => { setShowCreate(false) }}
                title={`Create ${capitalize(eventType) || 'Event'}`}
              >
                <DialogContent>
                  {!eventType ? (
                    <Box>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        What type of event do you want to create?
                      </Typography>
                      <Select
                        fullWidth
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Select an event type
                        </MenuItem>
                        <MenuItem value="league">League</MenuItem>
                        <MenuItem value="tournament">Tournament</MenuItem>
                        <MenuItem value="social">Social</MenuItem>
                      </Select>
                    </Box>
                  ) : (
                    renderEventForm()
                  )}
                </DialogContent>
              </MyModal>
              {isAdmin && (
                <Button variant='contained' color='primary' onClick={() => { setShowCreate(true) }} sx={{ m: 2 }}>
                  Create new event
                </Button>
              )}
              <Box display={'flex'} alignItems="center" gap={1} mt={2}>
                <Switch
                  checked={showArchivedEvents}
                  onChange={() => {
                    if (!showArchivedEvents && archivedEvents.length === 0) fetchArchivedEvents();
                    setShowArchivedEvents(!showArchivedEvents);
                  }}
                  sx={{ mt: 2 }}
                  inputProps={{ 'aria-label': 'Show Archived Events' }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {showArchivedEvents ? 'Archived Events' : 'Active Events'}
                </Typography>
              </Box>
              <ResponsiveDataLayout
                headers={[
                  { label: 'Name', key: 'name' },
                  { label: 'Type', key: 'match_type' },
                  { label: 'Matches', key: 'count_matches' },
                  { label: 'Participants', key: 'count_players' },
                  { label: 'Start date', key: 'start_date' },
                  { label: '', key: '' },
                ]}
                columnWidths={['35%', '15%', '13%', '12%', '15%', '5%']}
                rows={showArchivedEvents ? archivedEvents : activeEvents}
                rowKey={(row) => row.id}
                getRowData={(row) => [
                  <Link to={'/events/' + row.slug}>
                    <Typography>{row.name}</Typography>
                  </Link>,
                  capitalize(row.match_type),
                  row.count_matches || 0,
                  row.count_players || 0,
                  row.start_date,
                  <Box display={'flex'} flexDirection={'row'}>
                    {row.is_participant && <ProfileImage player={user} size={25} />}
                    {(row.count_players || 0) === 0 && (row.count_matches || 0) === 0 && isAdmin
                      ?
                      <MdDelete
                        size={20}
                        color="red"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setEventToRemove(row);
                          setShowModal(true);
                        }}
                      />
                      : (!showArchivedEvents &&
                        <MdArchive
                          size={20}
                          color="grey"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setEventToArchive(row);
                            setShowModal(true);
                          }}
                        />
                      )
                    }
                  </Box>
                ]}
                titleForScreen={(row) => (
                  <Link to={'/events/' + row.slug}>
                    <Typography>{row.name}</Typography>
                  </Link>
                )} // Always pass a function
                basicContentForScreen={(row) => (
                  <Box display={'flex'} flexDirection={'column'} alignItems={'right'}>
                    <Box display={'flex'} flexDirection={'row'} alignItems={'right'}>
                      {row.is_participant &&
                        <Typography sx={{ pr: 1 }}>
                          <ProfileImage player={user} size={20} />
                        </Typography>
                      }
                      <Typography>
                        {capitalize(row.match_type)}
                      </Typography>
                    </Box>
                    <Typography>{row.start_date + ' to ' + row.end_date}</Typography>
                  </Box>
                )} // Always pass a function
                expandableContentForScreen={(row) => (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                    <Typography>
                      {row.description}
                    </Typography>
                    <Box display={'flex'} alignItems={'center'} gap={1}>
                      <Typography>{row.count_players} participants</Typography>
                      <Typography>{row.count_matches} matches played</Typography>
                    </Box>
                  </Box>
                )}
                sortableColumns={['event_type', 'start_date', 'name', 'count_matches', 'count_players']}
              />
              {showArchivedEvents &&
                <Pagination
                  count={archivedEventsTotalPages}
                  page={archivedEventsPage}
                  onChange={(e, value) => {
                    setArchivedEventsPage(value);
                    fetchArchivedEvents(value);
                  }}
                />
              }
            </>

          )}
          {activeTab === 1 && (
            <>
              {isFetching && <LinearProgress />}
              {members.map((p) => (
                <Box sx={{ display: "flex", mt: 1, alignItems: "center", gap: 1 }} key={'member_' + p.id}>
                  <Link to={'/players/' + p.slug} >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ProfileImage player={p} size={30} />
                      <Typography>{p.name}</Typography>
                    </Box>
                  </Link>
                  {club.admins.includes(p.id) && (
                    <Typography component="span" sx={{ ml: 0, fontSize: 12, color: "primary.main", fontWeight: "bold" }}>
                      (Admin)
                    </Typography>
                  )}
                  {user?.id === p.id && (
                    <Typography
                      component="span"
                      sx={{ ml: 0, fontSize: 12, color: "secondary.main" }}
                      onClick={() => {
                        console.log('clicked to leave')
                        if (isAdmin && admins.length < 2) {
                          setSnackbar({ open: true, message: `You can't leave without assigning at least one admin to the club` });
                          return;
                        }
                        setMemberToRemove(p);
                        setShowModal(true);
                      }}
                      style={{ cursor: "pointer" }}>
                      <GiExitDoor size={20} />Leave club
                    </Typography>
                  )}
                  {isAdmin && !club.admins.includes(p.id) && ( // Show delete icon only for non-admins
                    <MdDelete
                      size={20}
                      color="red"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setMemberToRemove(p);
                        setShowModal(true);
                      }}
                    />
                  )}
                </Box>
              ))}
            </>
          )}
          <MyModal showHide={showModal}
            onClose={() => {
              setShowModal(false)
              setMemberToRemove(null)
              setEventToRemove(null)
            }}
            title="Confirm Removal"
          >
            <Typography>
              {memberToRemove &&
                <>
                  {memberToRemove?.id === user?.id
                    ? 'Are you sure you want to leave the club?'
                    : `Are you sure you want to remove ${memberToRemove?.name} from the club?`
                  }
                </>
              }
              {eventToRemove && `Are you sure you want to remove ${eventToRemove?.name}?`}
              {eventToArchive && `Are you sure you want to archive ${eventToArchive?.name}?`}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button variant="outlined" onClick={() => setShowModal(false)}>Cancel</Button>
              {memberToRemove &&
                <Button variant="contained" color="error" onClick={handleRemoveMember} sx={{ ml: 2 }}>
                  Remove Member
                </Button>
              }
              {eventToRemove &&
                <Button variant="contained" color="error" onClick={handleDeleteEvent} sx={{ ml: 2 }}>
                  Remove Event
                </Button>
              }
              {eventToArchive &&
                <Button variant="contained" color="warning" onClick={handleArchiveEvent} sx={{ ml: 2 }}>
                  Archive Event
                </Button>
              }
            </Box>
          </MyModal>
          {activeTab === 2 && (
            <>
              <Box mt={3}>
                <Typography variant="h6">Manage Admins</Typography>
                <Autocomplete
                  multiple
                  disableClearable
                  options={members}
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
                          onDelete={option.id === club.created_by ? undefined : tagProps.onDelete} // Disable delete for owner
                          color={option.id === club.created_by ? "primary" : "default"} // Highlight owner
                        />
                      );
                    })
                  }
                />
                <Typography variant="h6" sx={{ mt: 2 }}>Pending Join Requests</Typography>
                {requests?.length > 0 ? (
                  <Box display={'flex'} flexDirection={'column'} sx={{ mt: 2 }}>
                    {requests?.filter((x) => x.status === 'pending').map((r) => (
                      <Box display={'flex'} alignItems={'center'} gap={2} key={'request_' + r.id} >
                        <Typography>
                          {r.title} from <Link to={'players/' + r.sender.slug}>{r.sender?.name}</Link>
                        </Typography>
                        <Box
                          display={'flex'}
                          alignItems={'center'}
                          sx={{ color: "primary.main" }}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleApproveDenyRequest(r.id, true)}>
                          <MdCheckCircleOutline size={20} /> Approve
                        </Box>

                        <Box display={'flex'}
                          alignItems={'center'}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleApproveDenyRequest(r.id, false)}
                          sx={{ color: "secondary.main" }}>
                          <MdClose size={20} /> Deny
                        </Box>

                        <Box display={'flex'}
                          alignItems={'center'}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDeleteRequest(r.id)}
                          sx={{ color: "gray" }}>
                          <MdDelete size={20} /> Delete
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography>There are no current requests to join the club</Typography>
                )}
                <Typography variant="h6" sx={{ mt: 2 }}>Add Players (without join request)</Typography>
                <AddPlayerToClub club={club} />
              </Box>
            </>
          )}
        </Box>
      )
      }
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Box >
  );
};

export default ClubViewPage;
