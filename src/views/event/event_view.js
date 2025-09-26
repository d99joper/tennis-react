import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, MenuItem, TextField, Typography, useMediaQuery } from "@mui/material";
import { eventAPI } from "api/services";
import LeagueViewPage from "views/league/league_view";
import TournamentView from "views/Tournament/tournamentView";
import LadderView from "views/ladder/view";
import { Helmet } from "react-helmet-async";
import { helpers } from "helpers";
import DOMPurify from "dompurify";
import { useTheme } from "@emotion/react";

const EventView = () => {
  const { id } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const division_num = searchParams.get('division');
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);

  // Responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const event = await eventAPI.getEvent(id);
      console.log("EventView rendering with event_type:", event.event_type);
      setEvent(event);
      console.log("Event data:", event);
      const division_index = division_num && event.divisions && division_num < event.divisions.length ? division_num : 0;
      const division = event.divisions && division_index < event.divisions.length ? event.divisions[division_index] : null;
      setSelectedDivision(division || null);
      if (division) {
        // if the division is a league, set the standings and schedule on the event
        setEvent(prevEvent => ({
          ...prevEvent,
          league_standings: division.content_object?.standings || [],
          league_schedule: division.content_object?.schedule || [],
        }));
      }
    } catch (err) {
      setError("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  
  const refreshEvent = (updatedEvent) => {
    console.log('EventView received updated event:', updatedEvent);
    
    if (updatedEvent) {
      setEvent(updatedEvent);
      
      // Update selectedDivision if it exists in the updated event
      if (selectedDivision && updatedEvent.divisions) {
        const updatedSelectedDivision = updatedEvent.divisions.find(
          div => div.id === selectedDivision.id
        );
        if (updatedSelectedDivision) {
          setSelectedDivision(updatedSelectedDivision);
        }
      }
      
      // If we don't have a selected division but there are divisions, select the first one
      if (!selectedDivision && updatedEvent.divisions && updatedEvent.divisions.length > 0) {
        setSelectedDivision(updatedEvent.divisions[0]);
      }
    } else {
      fetchEvent();
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!event) return <Typography>No event found</Typography>;

  const titleSection = (
    <Box sx={{ mt: 4, px: isMobile ? 2 : 4 }}>
      <Helmet>
        <title>{event.name} | MyTennis Space</title>
      </Helmet>
      <Typography variant="h4" gutterBottom>
        {event.name}
      </Typography>
      {event.club && (
        <Typography variant="body1" gutterBottom>
          Hosted by <Link to={'/clubs/' + event.club?.slug} >{event.club?.name}</Link>
        </Typography>
      )}
      {!helpers.hasStarted(event.start_date) &&
        <Typography variant="body1" color="text.secondary" gutterBottom>
          <i>Event starts {event.start_date}</i>
        </Typography>
      }
      <Typography variant="body1" color="text.secondary" gutterBottom
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(helpers.parseTextToHTML(event.description)) }}>
      </Typography>
      
      {/* Division selector integrated into title section */}
      {selectedDivision && event.divisions && event.divisions.length > 1 && (
        <Box sx={{ 
          mt: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 500,
              minWidth: 'fit-content'
            }}
          >
            Division:
          </Typography>
          <TextField
            select
            variant="outlined"
            size="small"
            value={selectedDivision?.id || ""}
            onChange={(e) => {
              const selected = event.divisions.find(d => d.id === e.target.value);
              setSelectedDivision(selected);
            }}
            sx={{
              minWidth: 180,
              '& .MuiOutlinedInput-root': {
                height: 32,
                '& fieldset': {
                  borderColor: 'divider',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& .MuiSelect-select': {
                py: 0.5,
                fontSize: '0.875rem',
              }
            }}
          >
            {event.divisions?.map((division) => (
              <MenuItem key={division.id} value={division.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {division.name}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      textTransform: 'capitalize',
                      backgroundColor: 'action.hover',
                      px: 0.75,
                      py: 0.25,
                      borderRadius: 0.5,
                      fontSize: '0.75rem'
                    }}
                  >
                    {division.type}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}
    </Box>
  );

  // Switch to render the appropriate view
  let content;
  switch (event.event_type) {
    case "league":
      content = <LeagueViewPage event={event} />;
      break;
    case "tournament":
      content = <TournamentView event={event} tournament_id={event.tournament_id} callback={refreshEvent} />;
      break;
    case "ladder":
      content = <LadderView event={event} />;
      break;
    case "multievent":
      const division_content_id = selectedDivision?.content_object?.id;
      console.log("Selected Division:", selectedDivision);
      if (selectedDivision?.type === 'league')
        content = <LeagueViewPage event={event} />;
      else if (selectedDivision?.type === 'tournament') {
        content = <TournamentView 
          key={division_content_id} 
          event={event} 
          tournament_id={division_content_id} 
          division={selectedDivision}
          callback={refreshEvent} 
        />;
      }
      break;
    default:
      return <Typography>Unknown event type</Typography>;
  }

  return (
    <>
      {titleSection}
      {content}
    </>
  );
};

export default EventView;
