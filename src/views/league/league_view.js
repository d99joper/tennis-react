import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  useMediaQuery,
  Grid2,
  Snackbar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MyModal from 'components/layout/MyModal';
import { MatchEditor, Matches, ProfileImage } from 'components/forms';
import LeagueScheduler from '../../components/forms/League/leagueScheduler';
import { authAPI, eventAPI, leagueAPI } from 'api/services';
import AddParticipants from 'components/forms/League/addParticipants';
import ScheduleView from './schedule_view';
import { GiPencil } from 'react-icons/gi';
import { MdClose } from 'react-icons/md';
import StandingsView from './standings_view';
import JoinRequest from 'components/forms/Notifications/joinRequests';
import { Helmet } from 'react-helmet-async';
import EventAdminTools from 'components/forms/League/adminTools';
import { helpers } from 'helpers';
import DOMPurify from "dompurify";

const LeagueViewPage = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentTab, setCurrentTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [event, setEvent] = useState(props.event || null);
  const [standings, setStandings] = useState(props.event?.league_standings || []);
  const [schedule, setSchedule] = useState(props.event?.league_schedule || []);
  const [matches, setMatches] = useState(props.event?.matches || []);
  const [editSchedule, setEditSchedule] = useState(false);
  const currentUser = authAPI.getCurrentUser()
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [isParticipant, setIsParticipant] = useState(props.event?.is_participant || false)
  const [isAdmin, setIsAdmin] = useState(props.event?.is_admin || false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        const event = await eventAPI.getEvent(id);
        console.log('event', event)
        if (event && !event.statusCode) {
          setEvent(event);
          setStandings(event.league_standings || []);
          setSchedule(event.league_schedule || []);
          setMatches(event.matches || []);
          setIsAdmin(event.is_admin);
          setIsParticipant(event.is_participant);
        } else {
          console.error(event.statusMessage);
        }
      } catch (error) {
        console.error('Failed to fetch league:', error);
      }
    };
    if (!event)
      fetchLeague();

  }, [id]);


  const handleMatchEditorSubmit = (newMatch) => {
    console.log(newMatch);
  }

  const handleAddDeleteParticipant = async () => {
    try {
      const event = await eventAPI.getEvent(id);
      console.log('event', event)
      if (event && !event.statusCode) {
        setEvent(event);
        setStandings(event.league_standings || []);
        setSchedule(event.league_schedule || []);
        setMatches(event.matches || []);
        setIsAdmin(event.is_admin);
        setIsParticipant(event.is_participant);
      } else {
        console.error(event.statusMessage);
      }
    } catch (error) {
      console.error('Failed to fetch league:', error);
    }
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleMatchModalClose = () => {
    setMatchModalOpen(false);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedParticipant(null);
  };

  const handleScoreReported = async () => {
    // not implemented
    const data = await leagueAPI.getStandings(event.league_id)
    console.log(data)
    if(data?.standings) {
      console.log('update standings')
      setStandings(data.standings)
    }
  }

  const hasStarted = () => {
    const today = new Date().getTime(); // Get current time in milliseconds
    const startDate = new Date(`${event.start_date}T00:00:00Z`).getTime(); // for UTC time
    return startDate < today;
  }

  if (!event) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Box sx={{ mt: 4, px: isMobile ? 2 : 4 }}>
      <Helmet>
        <title>{event.name} | MyTennis Space</title>
      </Helmet>
      <Typography variant="h4" gutterBottom>
        {event.name}
      </Typography>
      <Typography variant="bod1" gutterBottom>
        Hosted by <Link to={'/clubs/' + event.club?.id} >{event.club?.name}</Link>
      </Typography>
      {!hasStarted() &&
        <Typography variant="body1" color="text.secondary" gutterBottom>
          <i>League starts {event.start_date}</i>
        </Typography>
      }
      <Typography variant="body1" color="text.secondary" gutterBottom
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(helpers.parseTextToHTML(event.description)) }}>
      </Typography>

      <JoinRequest
        objectType={'event'}
        id={event.id}
        isMember={isParticipant}
        memberText={'You are participating'}
        isOpenRegistration={event.is_open_registration}
        startDate={event.start_date}
        registrationDate={event.registration_open_date}
        callback={async () => {
          const response = await eventAPI.getEvent(id);
          if (response && !response.statusCode) {
            setStandings(response.league_standings || []);
            setIsParticipant(response.is_participant);
          } else {
            console.error(event.statusMessage);
          }
        }}
      />

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
        {isAdmin && <Tab label="Admin Tools" />} {/* Admin-only tab */}
      </Tabs>

      {/** STANDINGS TAB */}
      {currentTab === 0 && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            Standings
          </Typography>
          <StandingsView standings={standings} event_id={event.id} isAdmin={isAdmin} callback={handleAddDeleteParticipant} />
        </Box>
      )}
      {/** SCHEDULE TAB */}
      {currentTab === 1 && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            Schedule &nbsp;&nbsp;
            {isAdmin &&
              editSchedule
              ? <MdClose className='pointer' onClick={() => setEditSchedule(false)} />
              : <GiPencil className='pointer' onClick={() => setEditSchedule(true)} />
            }
          </Typography>

          {editSchedule
            ? <LeagueScheduler
              event={event}
              schedule={schedule}
              onSave={(newSchedule, keepOpen = true) => {
                setSchedule(newSchedule)
                //setEditSchedule(keepOpen)
                setEvent((prev) => ({ ...prev, league_schedule: newSchedule }));
              }}
            />
            : <ScheduleView event={event} schedule={schedule} onScoreReported={handleScoreReported} />
          }

        </Box>
      )}

      {/** MATCHES TAB */}
      {currentTab === 2 && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            Matches
          </Typography>

          {/* Add Match Button */}
          {(event?.is_participant || isAdmin) && (
            // <Button
            //   variant="contained"
            //   color="primary"
            //   onClick={() => setMatchModalOpen(true)} // Show wizard editor
            //   sx={{ mb: 2 }}
            // >
            //   Add Match
            // </Button>
            <Typography>Submit new match results from the schedule tab.</Typography>
          )}

          <Matches
            originType={'event'}
            originId={event.id}
            initialMatches={event.matches}
            pageSize={10}
            showComments={true}
            showH2H={true}
          />


          {/* Add Match Wizard */}
          {/* Match Editor Modal */}
          <MyModal showHide={matchModalOpen} onClose={handleMatchModalClose} title="Report Match">
            <MatchEditor
              participant={currentUser}
              event={event}
              matchType={event.match_type}
              onSubmit={(matchData) => {
                console.log("Match reported:", matchData);
                handleMatchEditorSubmit(matchData);
                handleMatchModalClose();
              }}
            />
          </MyModal>
        </Box>
      )}

      {/* Admin Tools Tab */}
      {currentTab === 3 && isAdmin && (
        <Grid2 container direction={'column'}>
          <EventAdminTools event={event} participants={event.participants || []} setEvent={setEvent} />
          <AddParticipants event={event} callback={handleAddDeleteParticipant} />
        </Grid2>
      )}

      <MyModal
        showHide={modalOpen}
        onClose={handleModalClose}
        title="Details"
      >
        {selectedParticipant && (
          <Box display="flex" alignItems="center" gap={2}>
            {event.league_type === 'singles_old' ?
              <>
                <ProfileImage player={selectedParticipant.players[0]} size={60} />
                <Box>
                  <Typography variant="h6">{selectedParticipant.name}</Typography>
                  <Typography
                    as="p"
                    variant="body1"
                    color="primary"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/players/${selectedParticipant.players[0].id}`)}
                  >
                    View Full Profile
                  </Typography>
                </Box>
              </>
              : event.league_type === 'doubles' || event.league_type === 'singles' ?
                <>
                  {selectedParticipant.players.map((player, i) =>
                    <React.Fragment key={player.id}>
                      <ProfileImage player={player} size={60} />
                      <Box>
                        <Typography variant="h6">{player.name}</Typography>
                        <Typography
                          as="p"
                          variant="body1"
                          color="primary"
                          sx={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/players/${player.id}`)}
                        >
                          View Full Profile
                        </Typography>
                      </Box>
                    </React.Fragment>
                  )}
                </>
                : event.league_type === 'team' ?
                  <>
                    <Typography variant="h6">{selectedParticipant.name}</Typography>
                  </>
                  : ''
            }
          </Box>
        )}
        {selectedParticipant && (
          <Box mt={2}>
            <Typography variant="body2" gutterBottom>{selectedParticipant.matchResults}</Typography>

          </Box>
        )}
      </MyModal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default LeagueViewPage;
