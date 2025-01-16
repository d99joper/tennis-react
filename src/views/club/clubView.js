import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Tabs, Tab, Switch, Snackbar, Pagination } from '@mui/material';
import { useParams } from 'react-router-dom';
import clubAPI from 'api/services/club';
import ResponsiveDataLayout from 'components/layout/Data/responsiveDataLayout';
import reportWebVitals from 'reportWebVitals';
import { ProfileImage } from 'components/forms';

const ClubViewPage = () => {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [activeEvents, setActiveEvents] = useState([]);
  const [archivedEvents, setArchivedEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [membersPage, setMembersPage] = useState(1);
  const [membersTotalPages, setMembersTotalPages] = useState(1);
  const [archivedEventsPage, setArchivedEventsPage] = useState(1);
  const [archivedEventsTotalPages, setArchivedEventsTotalPages] = useState(1);
  const [isMember, setIsMember] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0 for Events, 1 for Members
  const [showArchivedEvents, setShowArchivedEvents] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

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
      setActiveEvents(active_events);
      setMembersTotalPages(Math.ceil(members_count / 10));
    }
    fetchClubDetails();
  }, [clubId]);

  const fetchMembers = async (page) => {
    const response = await clubAPI.getMembers(clubId, page);
    console.log(response)
    setMembers(response.data.members);
    setMembersTotalPages(response.data.total_pages);
  };

  const fetchArchivedEvents = async (page) => {
    const response = await clubAPI.getArchivedEvents(clubId, page);
    setArchivedEvents(response.data.archived_events);
    setArchivedEventsTotalPages(response.data.total_pages);
  };

  const handleJoinRequest = async () => {
    try {
      const response = await clubAPI.requestJoin(clubId);
      setSnackbar({ open: true, message: response.data.message });
      setIsMember(true);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to send join request' });
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 1 && members.length === 0) {
      fetchMembers(1);
    }
  };

  return (
    <Box p={2}>
      {club && (
        <>
          <Typography variant="h4">{club.name}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {club.description}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Location: {club.location}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Active Events: {club.active_events_count} | Total Events: {club.total_events_count} | Members: {club.members_count}
          </Typography>
          {!isMember && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={handleJoinRequest}
            >
              Request to Join
            </Button>
          )}
          <Button variant="contained" color="secondary" sx={{ mt: 3 }} onClick={() => {
            clubAPI.addPlayerToClub(clubId, 'a0ee264b-9486-49dc-908a-ee9b7d0485aa') // Jonas
            clubAPI.addPlayerToClub(clubId, '86c0c602-2c11-4f33-8dbe-9f590fa0bde9') // Travis
            clubAPI.addPlayerToClub(clubId, '395e6aac-1012-4f9c-82cd-aab2033c57a8') // Ann Harvie
          }}
          >Add players Club</Button>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mt: 3 }}>
            <Tab label="Events" />
            <Tab label="Members" />
          </Tabs>
          {activeTab === 0 && (
            <>
              <Switch
                checked={showArchivedEvents}
                onChange={() => setShowArchivedEvents(!showArchivedEvents)}
                sx={{ mt: 2 }}
                inputProps={{ 'aria-label': 'Show Archived Events' }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {showArchivedEvents ? 'Archived Events' : 'Active Events'}
              </Typography>
              {showArchivedEvents ? (
                <>
                  <ResponsiveDataLayout
                    headers={[
                      { label: 'Name', accessor: 'name' },
                      { label: 'Description', accessor: 'description' },
                      //{label:'End Date', accessor:'endDate'}
                    ]}
                    rows={archivedEvents}
                    rowKey={(row) => row.id}
                    getRowData={(row) => [
                      row.name,
                      row.description
                      //row.endDate
                    ]}
                  />
                  <Pagination
                    count={archivedEventsTotalPages}
                    page={archivedEventsPage}
                    onChange={(e, value) => {
                      setArchivedEventsPage(value);
                      fetchArchivedEvents(value);
                    }}
                  />
                </>
              ) : (
                <ResponsiveDataLayout
                  headers={[
                    { label: 'Name', accessor: 'name' },
                    { label: 'Description', accessor: 'description' },
                    //{label:'End Date', accessor:'endDate'}
                  ]}
                  rows={activeEvents}
                  rowKey={(row) => row.id}
                  getRowData={(row) => [
                    row.name,
                    row.description
                    //row.endDate
                  ]}
                />
              )}
            </>
          )}
          {activeTab === 1 && (
            <>
              <ResponsiveDataLayout
                headers={[
                  { label: 'Name', accessor: 'name' },
                  { label: 'Born', accessor: 'birthyear' },
                  //{label:'End Date', accessor:'endDate'}
                ]}
                rows={members}
                rowKey={(row) => row.id}
                getRowData={(row) => [
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ProfileImage player={row} size={30} />
                    <Typography>{row.name}</Typography>
                  </Box>,
                  row.birthyear
                  //row.endDate
                ]}
              />
              <Pagination
                count={membersTotalPages}
                page={membersPage}
                onChange={(e, value) => {
                  setMembersPage(value);
                  fetchMembers(value);
                }}
              />
            </>
          )}
        </>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default ClubViewPage;
