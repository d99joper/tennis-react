import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  useMediaQuery,
  Grid,
  Snackbar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import MyModal from 'shared/components/layout/MyModal';
import Matches from 'features/match/components/Matches';
import { ProfileImage } from 'shared/components/ProfileImage';
import LeagueScheduler from '../components/leagueScheduler';
import { eventAPI, leagueAPI } from 'api/services';
import AddParticipants from 'features/league/components/addParticipants';
import ScheduleView from './schedule_view';
import { GiPencil } from 'react-icons/gi';
import { MdClose } from 'react-icons/md';
import StandingsView from './standings_view';
import EventAdminTools from 'features/event/components/adminTools';
import { eventHelper } from 'helpers';

const LeagueViewPage = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [event, setEvent] = useState(props.event || null);
  const division = props.division; // Use props directly to avoid state issues
  // Use parent-provided cache if available (survives remounts); fall back to local cache for standalone use
  const localCache = useRef({});
  const leagueCache = props.leagueCache || localCache;
  // Track previous refreshTrigger value to detect when a participant has just joined
  const prevRefreshTrigger = useRef(props.refreshTrigger ?? 0);
  // Standings and schedule are lazy-loaded when the division/event is known
  const [standings, setStandings] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const winner = props.division?.content_object?.winner || props.event?.winner || null;
  const [editSchedule, setEditSchedule] = useState(false);
  const [isParticipant, setIsParticipant] = useState(props.event?.is_participant || false)
  const [isAdmin, setIsAdmin] = useState(props.event?.is_admin || false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const navigate = useNavigate();

  const { id } = useParams();

  // Tab name mappings
  const tabNameToIndex = useMemo(() => ({
    'standings': 0,
    'schedule': 1,
    'matches': 2,
    'admin': 3,
  }), []);

  const indexToTabName = useMemo(() => ({
    0: 'standings',
    1: 'schedule',
    2: 'matches',
    3: 'admin',
  }), []);

  // Derive current tab from URL parameter
  const tabParam = searchParams.get('tab') || 'standings';
  const currentTab = tabNameToIndex[tabParam] ?? 0;

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

  // Lazy-load standings and schedule when division or event changes
  useEffect(() => {
    const leagueId = props.division?.content_object?.id ?? props.event?.league_id;
    if (!leagueId) return;

    // If refreshTrigger changed, a participant just joined — invalidate the cache so we get fresh standings
    const triggerChanged = props.refreshTrigger !== undefined && props.refreshTrigger !== prevRefreshTrigger.current;
    if (triggerChanged) {
      prevRefreshTrigger.current = props.refreshTrigger;
      delete leagueCache.current[leagueId];
    }

    // Use cache if already loaded
    if (leagueCache.current[leagueId]) {
      const cached = leagueCache.current[leagueId];
      setStandings(cached.standings);
      setSchedule(cached.schedule);
      return;
    }

    const fetchLeagueData = async () => {
      try {
        const [standingsRes, scheduleRes] = await Promise.all([
          leagueAPI.getStandings(leagueId),
          leagueAPI.getSchedule(leagueId),
        ]);
        const standings = standingsRes?.standings || [];
        const schedule = scheduleRes?.schedule || [];
        leagueCache.current[leagueId] = { standings, schedule };
        setStandings(standings);
        setSchedule(schedule);
      } catch (err) {
        console.error('Failed to fetch league data:', err);
      }
    };
    fetchLeagueData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.division?.id, props.event?.id, props.refreshTrigger]);


  const handleAddDeleteParticipant = async () => {
    const e = await eventHelper.refreshEvent(id);
    setEvent(e);
    const leagueId = division?.content_object?.id ?? e.league_id;
    if (leagueId) {
      try {
        const [standingsRes, scheduleRes] = await Promise.all([
          leagueAPI.getStandings(leagueId),
          leagueAPI.getSchedule(leagueId),
        ]);
        const standings = standingsRes?.standings || [];
        const schedule = scheduleRes?.schedule || [];
        leagueCache.current[leagueId] = { standings, schedule };
        setStandings(standings);
        setSchedule(schedule);
      } catch (err) {
        console.error('Failed to refresh league data:', err);
      }
    }
  }

  const handleTabChange = (event, newValue) => {
    const tabName = indexToTabName[newValue];
    if (tabName) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('tab', tabName);
      setSearchParams(newParams, { replace: true });
    }
  };
  
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedParticipant(null);
  };

  const handleScoreReported = async (new_schedule) => {
    const leagueId = division ? division.content_object?.id : event.league_id;
    const data = await leagueAPI.getStandings(leagueId);
    if (data?.standings) {
      const standings = data.standings;
      // Invalidate cache for this league then update state
      if (leagueCache.current[leagueId]) {
        leagueCache.current[leagueId] = { standings, schedule: new_schedule };
      }
      setStandings(standings);
      setSchedule(new_schedule);
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
            winner={winner}
            event_id={event.id}
            division_id={division?.id}
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
            : <ScheduleView event={event} division={division} schedule={schedule} onScoreReported={(new_match, new_schedule) => handleScoreReported(new_schedule)} />
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
            <Typography>Submit new match results from the schedule tab.</Typography>
          )}

          <Matches
            originType={'event'}
            originId={event.id}
            divisions={event.divisions}
            divisionId={division?.id}
            matchType={division?.match_type || event?.match_type}
            showFilterByDivision={event?.divisions?.length > 0}
            pageSize={10}
            showComments={true}
            showH2H={true}
          />
        </Box>
      )}

      {/* Admin Tools Tab */}
      {currentTab === 3 && isAdmin && (
        <Grid container direction={'column'}>
          <EventAdminTools event={event} division={division} setEvent={(updatedEvent) => {
            setEvent(updatedEvent);
            if (props.callback) props.callback(updatedEvent);
          }} />
          <AddParticipants event={event} callback={handleAddDeleteParticipant} />
        </Grid>
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
