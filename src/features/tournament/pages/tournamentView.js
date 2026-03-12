import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Tabs, Tab, useMediaQuery, Grid, Button } from '@mui/material';
import TournamentBracket from 'features/tournament/components/bracket';
import tournamentsAPI from 'api/services/tournament';
import { eventAPI } from 'api/services';
import { useTheme } from '@emotion/react';
import Matches from 'features/match/components/Matches';
import EventAdminTools from 'features/event/components/adminTools';
import AddParticipants from 'features/league/components/addParticipants';
import { eventHelper } from 'helpers';
import BracketGenerator from 'features/tournament/components/bracketGenerator';
import MyModal from 'shared/components/layout/MyModal';

const TournamentViewPage = ({ event: initialEvent,
  tournament_id,
  participants = [],
  showMatches = true,
  showEventDetails = true,
  division=null,
  showAdmin = true, 
  callback,
  bracketCache: externalBracketCache = null}
) => {

  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [event, setEvent] = useState(initialEvent || null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  //const [tournament, setTournament] = useState(initialEvent || null);
  const [bracket, setBracket] = useState(
    initialEvent?.tournament_bracket || initialEvent?.tournament?.bracket || null
  );
  const [showBracketGenerator, setShowBracketGenerator] = useState(false);
  // Use parent-provided cache if available (survives remounts); fall back to local cache for standalone use
  const localCache = useRef({});
  const bracketCache = externalBracketCache || localCache;

  // Tab name mappings
  const tabNameToIndex = { 'bracket': 0, 'matches': 1, 'admin': 2 };
  const indexToTabName = { 0: 'bracket', 1: 'matches', 2: 'admin' };
  
  // Derive current tab from URL parameter
  const tabParam = searchParams.get('tab') || 'bracket';
  const currentTab = tabNameToIndex[tabParam] ?? 0;

  useEffect(() => {
    if (event?.event_type === 'multievent') {
      setEvent(event);
      const currentDivision = division || event.divisions?.[0];
      const tournamentId = currentDivision?.content_object?.id;
      if (tournamentId) {
        if (bracketCache.current[tournamentId] !== undefined) {
          setBracket(bracketCache.current[tournamentId]);
        } else {
          tournamentsAPI.getTournament(tournamentId)
            .then(t => {
              const b = t?.bracket || null;
              bracketCache.current[tournamentId] = b;
              setBracket(b);
            })
            .catch(err => console.error('Error loading bracket', err));
        }
      } else {
        setBracket(null);
      }
      return;
    }
    if (event) return; // already have event from props
    const fetchEvent = async () => {
      try {
        const t = await tournamentsAPI.getTournament(id);
        //setTournament(t);
        const e = await eventAPI.getEvent(t.event_id);
        setEvent(e);
        setBracket(e.tournament_bracket || e.tournament?.bracket);
      } catch (err) {
        console.error('Error loading tournament', err);
      }
    };
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, event, tournament_id, division]);

  // Lazy-load bracket when division changes
  useEffect(() => {
    if (event?.event_type === 'multievent' && division) {
      const tournamentId = division.content_object?.id;
      if (!tournamentId) return;
      if (bracketCache.current[tournamentId] !== undefined) {
        setBracket(bracketCache.current[tournamentId]);
        return;
      }
      tournamentsAPI.getTournament(tournamentId)
        .then(t => {
          const b = t?.bracket || null;
          bracketCache.current[tournamentId] = b;
          setBracket(b);
        })
        .catch(err => console.error('Error loading bracket', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [division?.id, event?.event_type]);

  const handleMatchSubmit = (updatedBracket, updatedDivision) => {
    setBracket(updatedBracket);
    // Update cache with new bracket
    const tournamentId = updatedDivision?.content_object?.id || tournament_id || id;
    if (tournamentId) bracketCache.current[tournamentId] = updatedBracket;
    
    let updatedEvent = null;
    
    if (updatedDivision) {
      // For multi-events, update the specific division
      const updatedDivisions = event.divisions.map(div => {
        if (div.id === updatedDivision.id) {
          return {
            ...div,
            content_object: {
              ...div.content_object,
              bracket: updatedBracket
            }
          };
        }
        return div;
      });
      updatedEvent = { ...event, divisions: updatedDivisions };
    } else {
      // For regular tournaments, update the main tournament bracket
      updatedEvent = { 
        ...event, 
        tournament_bracket: updatedBracket, 
        tournament: { 
          ...event.tournament, 
          bracket: updatedBracket 
        } 
      };
    }
    
    // Update local event state
    setEvent(updatedEvent);
    
    // Propagate changes to parent (EventView)
    callback && callback(updatedEvent);
  };

  const refreshEvent = (updatedEvent) => {
    setEvent(updatedEvent);

    // Bracket is lazy-loaded — re-fetch when admin actions change the tournament state
    if (updatedEvent?.event_type === 'multievent' && division) {
      const tournamentId = division.content_object?.id;
      if (tournamentId) {
        tournamentsAPI.getTournament(tournamentId)
          .then(t => setBracket(t?.bracket || null))
          .catch(err => console.error('Error refreshing bracket', err));
      }
    }

    // Propagate changes to parent (EventView)
    callback && callback(updatedEvent);
  }
  const handleTabChange = (event, newValue) => {
    const tabName = indexToTabName[newValue];
    if (tabName) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('tab', tabName);
      setSearchParams(newParams, { replace: true });
    }
  };

  const handleAddDeleteParticipant = async () => {
    try {
      const updatedEvent = await eventHelper.refreshEvent(id);
      setEvent(updatedEvent);
      const tournamentId = division?.content_object?.id || tournament_id || updatedEvent.tournament_id;
      if (tournamentId) {
        const t = await tournamentsAPI.getTournament(tournamentId);
        const b = t?.bracket || null;
        bracketCache.current[tournamentId] = b;
        setBracket(b);
      }
      if (callback) callback(updatedEvent);
    } catch (err) {
      console.error('Error refreshing event', err);
    }
  };

  if (!event) return <CircularProgress />;

  return (
    <Box sx={{ mt: 0, px: isMobile ? 2 : 4 }}>
      {/** Tabs for Bracket, Matches, and Admin */}
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant={isMobile ? 'scrollable' : 'fullWidth'}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        <Tab label="Bracket" />
        {showMatches && <Tab label="Matches" />}
        {showAdmin && <Tab label="Admin" />}
      </Tabs>

      {/** BRACKET TAB  */}
      {currentTab === 0 && (
        <Box sx={{ p: 1 }}>
          {bracket && bracket.length > 0  &&  (
            bracket.map((round, roundIndex) => (
              <Box key={`round-${roundIndex}`} sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>{round.name || `Round ${roundIndex + 1}`}</Typography>
                <TournamentBracket 
                  key={`${tournament_id || id}-${division?.id || 'main'}-round-${roundIndex}`}
                  initialBracket={[round]}
                  isSelfReported={event.allow_self_report_scores}
                  event={event} 
                  tournament_id={tournament_id || id}
                  division_id={division?.id || event.divisions?.[0]?.id || null}
                  availableParticipants={participants}
                  onMatchSubmit={handleMatchSubmit} 
                />
              </Box>
            )))}
            {/* add option to add a new bracket (for admins) */}
            {event.is_admin && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => setShowBracketGenerator(true)}
                  sx={{ minWidth: 250 }}
                >
                  + Generate New Bracket
                </Button>
              </Box>
            )}
        </Box>
      )}
      {/** MATCHES TAB  */}
      {currentTab === 1 && showMatches && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Matches
          </Typography>
          <Matches
            originType={'event'}
            originId={event.id}
            divisions={event.divisions}
            //initialMatches={event.matches}
            pageSize={10}
            showComments={true}
            showH2H={true}
          />
        </Box>
      )}
      {/** ADMIN TAB  */}
      {currentTab === 2 && showAdmin && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Admin Tools
          </Typography>
          <Grid container direction={'column'}>
            <EventAdminTools event={event} division={division} participants={event.participants || []} setEvent={refreshEvent}  />
            <AddParticipants event={event} callback={handleAddDeleteParticipant} />
          </Grid>
        </Box>
      )}

      {/* Bracket Generator Modal */}
      <MyModal 
        showHide={showBracketGenerator} 
        onClose={() => setShowBracketGenerator(false)}
        title="Generate Tournament Bracket"
      >
        <BracketGenerator
          availableParticipants={participants}
          tournamentId={tournament_id || id}
          onBracketGenerated={(newBracket) => {
            console.log('New bracket generated:', newBracket);
            handleMatchSubmit(newBracket, division);
            setShowBracketGenerator(false);
          }}
        />
      </MyModal>

    </Box>
  );

};

export default TournamentViewPage;
