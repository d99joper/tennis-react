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
import { useNavigate, useParams } from 'react-router-dom';
import MyModal from 'components/layout/MyModal';
import { Matches, ProfileImage } from 'components/forms';
import LeagueScheduler from '../../components/forms/League/leagueScheduler';
import { eventAPI, leagueAPI } from 'api/services';
import AddParticipants from 'components/forms/League/addParticipants';
import ScheduleView from './schedule_view';
import { GiPencil } from 'react-icons/gi';
import { MdClose } from 'react-icons/md';
import StandingsView from './standings_view';
import EventAdminTools from 'components/forms/Event/adminTools';
import { eventHelper } from 'helpers';

const LeagueViewPage = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentTab, setCurrentTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [event, setEvent] = useState(props.event || null);
  const division = props.division; // Use props directly to avoid state issues
  console.log("LeagueView division prop:", props.division);
  // Use division data if available, otherwise fall back to event data
  const [standings, setStandings] = useState(
    props.division?.content_object?.standings || props.event?.league_standings || []
  );
  const [schedule, setSchedule] = useState(
    props.division?.content_object?.schedule || props.event?.league_schedule || []
  );
  const [editSchedule, setEditSchedule] = useState(false);
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
          
          // Only update standings/schedule if we don't have division-specific data
          if (!props.division) {
            setStandings(event.league_standings || []);
            setSchedule(event.league_schedule || []);
          }
          
          setIsAdmin(event.is_admin);
          setIsParticipant(event.is_participant);
        } else {
          console.error(event.statusMessage);
        }
      } catch (error) {
        console.error('Failed to fetch league:', error);
      }
    };
    
    // Only fetch if we don't have an event prop
    if (!event) {
      fetchLeague();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Only depend on id - props.event and props.division cause infinite loops

  // Add useEffect to handle division changes
  useEffect(() => {
    if (props.division && props.division.content_object) {
      console.log("Division changed in LeagueView, updating standings/schedule:", props.division);
      setStandings(props.division.content_object.standings || []);
      setSchedule(props.division.content_object.schedule || []);
    } else if (props.event && !props.division) {
      // Fall back to event-level data only if no division
      setStandings(props.event.league_standings || []);
      setSchedule(props.event.league_schedule || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.division?.id, props.event?.id]); // Use IDs instead of full objects to prevent infinite loops


  const handleAddDeleteParticipant = async () => {
    const e = await eventHelper.refreshEvent(id);
    setEvent(e);
    setStandings(e.league_standings || []);
    setSchedule(e.league_schedule || []);
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedParticipant(null);
  };

  const handleScoreReported = async () => {
    // not implemented
    const leagueId = division ? division.content_object?.id : event.league_id;
    const data = await leagueAPI.getStandings(leagueId);
    console.log(data);
    if (data?.standings) {
      console.log('update standings')
      setStandings(data.standings)
    }
  }

  if (!event) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Box>

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
          <StandingsView
            standings={standings}
            winner={event.winner}
            event_id={event.id}
            isAdmin={isAdmin}
            isParticipant={isParticipant}
            callback={handleAddDeleteParticipant}
          />
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
              division={division}
              schedule={schedule}
              onSave={(newSchedule, keepOpen = true) => {
                setSchedule(newSchedule)
                //setEditSchedule(keepOpen)
                setEvent((prev) => ({ ...prev, league_schedule: newSchedule }));
              }}
            />
            : <ScheduleView event={event} division={division} schedule={schedule} onScoreReported={handleScoreReported} />
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
            //initialMatches={event.matches}
            divisions={event.divisions}
            //showFilterByDivision={event.divisions && event.divisions.length > 0} 
            pageSize={10}
            showComments={true}
            showH2H={true}

          />


          {/* Add Match Wizard */}
          {/* Match Editor Modal */}
          {/* <MyModal showHide={matchModalOpen} onClose={handleMatchModalClose} title="Report Match">
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
          </MyModal> */}
        </Box>
      )}

      {/* Admin Tools Tab */}
      {currentTab === 3 && isAdmin && (
        <Grid2 container direction={'column'}>
          <EventAdminTools event={event} setEvent={setEvent} />
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
                    onClick={() => navigate(`/players/${selectedParticipant.players[0].slug}`)}
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
                          onClick={() => navigate(`/players/${player.slug}`)}
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
