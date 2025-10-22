import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Tabs, Tab, useMediaQuery, Grid2, Button } from '@mui/material';
import TournamentBracket from 'components/forms/Tournament/bracket';
import tournamentsAPI from 'api/services/tournament';
import { eventAPI } from 'api/services';
import { useTheme } from '@emotion/react';
import { Matches } from 'components/forms';
import EventAdminTools from 'components/forms/Event/adminTools';
import AddParticipants from 'components/forms/League/addParticipants';
import { eventHelper } from 'helpers';
import BracketGenerator from 'components/forms/Tournament/bracketGenerator';
import MyModal from 'components/layout/MyModal';

const TournamentViewPage = ({ event: initialEvent,
  tournament_id,
  participants = [],
  showMatches = true,
  showEventDetails = true,
  division=null,
  showAdmin = true, 
  callback}
) => {

  const { id } = useParams();
  const [event, setEvent] = useState(initialEvent || null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentTab, setCurrentTab] = useState(0);
  //const [tournament, setTournament] = useState(initialEvent || null);
  const [bracket, setBracket] = useState(
    initialEvent?.tournament_bracket || initialEvent?.tournament?.bracket || null
  );
  const [showBracketGenerator, setShowBracketGenerator] = useState(false);

  useEffect(() => {
    if (event?.event_type === 'multievent') {
      setEvent(event);
      //console.log("Multi-event detected, using first division's bracket");
      const currentDivision = division || event.divisions[0];
      setBracket(currentDivision.content_object?.bracket || null);
      //console.log("Bracket data:", currentDivision.content_object?.bracket);
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
  }, [id, event, tournament_id, division]); 

  // Add this new useEffect to handle division changes
  useEffect(() => {
    if (event?.event_type === 'multievent' && division) {
      //console.log("Division changed, updating bracket for division:", division.id);
      setBracket(division.content_object?.bracket || null);
    }
  }, [division, event?.event_type]);

  const handleMatchSubmit = (updatedBracket, updatedDivision) => {
    console.log('New bracket submitted:', updatedBracket);
    setBracket(updatedBracket);
    
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
    console.log('TournamentView received updated event:', updatedEvent);
    setEvent(updatedEvent);
    
    // If it's a multi-event and we have divisions, update the bracket for the current division
    if (updatedEvent?.event_type === 'multievent' && division) {
      const updatedDivision = updatedEvent.divisions?.find(d => d.id === division.id);
      if (updatedDivision) {
        setBracket(updatedDivision.content_object?.bracket || null);
      }
    }
    
    // Propagate changes to parent (EventView)
    callback && callback(updatedEvent);
  }
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleAddDeleteParticipant = async () => {
    try {
      const updatedEvent = await eventHelper.refreshEvent(id);
      setEvent(updatedEvent);
      setBracket(updatedEvent.tournament_bracket || updatedEvent.tournament?.bracket);
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
          <Grid2 container direction={'column'}>
            <EventAdminTools event={event} participants={event.participants || []} setEvent={refreshEvent}  />
            <AddParticipants event={event} callback={handleAddDeleteParticipant} />
          </Grid2>
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
