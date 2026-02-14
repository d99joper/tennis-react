import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState, useContext, useRef } from "react";
import { Box, Typography, useMediaQuery, Grid, Collapse, IconButton, Chip } from "@mui/material";
import { AuthContext } from "contexts/AuthContext";
import { eventAPI } from "api/services";
import LeagueViewPage from "views/league/league_view";
import TournamentView from "views/Tournament/tournamentView";
import LadderView from "views/ladder/view";
import { Helmet } from "react-helmet-async";
import { helpers } from "helpers";
import { useTheme } from "@mui/material/styles"; 
import TruncatedText from "components/forms/truncateText";
import JoinRequest from "components/forms/Notifications/joinRequests";
import InfoPopup from "components/forms/infoPopup";
import { FaUsers } from "react-icons/fa";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import ParticipantsContent from "components/forms/Event/ParticipantContent";
import SeoHelmet from "components/seoHelmet";
import DivisionCard from "components/forms/Event/DivisionCard";

const EventView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Use React Router's hook
  const division_num = searchParams.get('division'); // This will properly track changes
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [divisionsExpanded, setDivisionsExpanded] = useState(
    searchParams.get('divisionsExpanded') !== 'false' // Default to true/expanded
  );

  // Responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Check if user is enrolled in a specific division
  const isUserEnrolledInDivision = (divisionId) => {
    if (!user?.id || !participants.length) return false;
    
    // Find participant records that include this user
    return participants.some(participant => {
      // Check if this participant includes the user (singles, doubles, or team)
      const isUserInParticipant = 
        participant.player?.id === user.id || 
        participant.players?.some(p => p.id === user.id);
      
      // Check if this participant is enrolled in the division
      const isInDivision = participant.divisions?.some(div => div.id === divisionId);
      
      return isUserInParticipant && isInDivision;
    });
  };

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      const event = await eventAPI.getEvent(id);
      //console.log("EventView rendering with event_type:", event.event_type);
      setEvent(event);
      //console.log("Event data:", event);
      
      // Fetch participants once at the top level with division information
      if (event.id) {
        try {
          const res = await eventAPI.getParticipants(event.id, {include_divisions: true}, 0);
          setParticipants(res.data || []);
        } catch (err) {
          console.error('Error fetching participants:', err);
        }
      }
    } catch (err) {
      setError("Failed to load event");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  // Handle initial division selection after event loads
  useEffect(() => {
    if (event && event.divisions) {
      //console.log("division_num from URL:", division_num);

      let division = null;
      if (division_num !== null) {
        const division_index = parseInt(division_num);
        if (division_index >= 0 && division_index < event.divisions.length) {
          division = event.divisions[division_index];
        }
      }
      // If division_num is null or invalid, leave division as null (blank selection)

      //console.log("Setting initial/updated division:", division);

      // Update selectedDivision
      setSelectedDivision(division);

      // If it's a league division, update league data
      if (division && division.type === 'league') {
        console.log("Updating league data for division:", division);
        setEvent(prevEvent => ({
          ...prevEvent,
          league_standings: division.content_object?.standings || [],
          league_schedule: division.content_object?.schedule || [],
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.id, division_num]); // Only depend on event ID and division_num to prevent infinite loops

  const refreshEvent = (updatedEvent) => {
    //console.log('EventView received updated event:', updatedEvent);

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
      
      // Refresh participants when event is refreshed with division information
      if (updatedEvent.id) {
        eventAPI.getParticipants(updatedEvent.id, {include_divisions: true}, 0)
          .then(res => setParticipants(res.data || []))
          .catch(err => console.error('Error refreshing participants:', err));
      }
    } else {
      fetchEvent();
    }
  };

  const contentRef = useRef(null); // Add ref for scroll target

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!event) return <Typography>No event found</Typography>;

  const titleSection = (
    <Box sx={{ mt: 4, px: isMobile ? 2 : 4 }}>
      <Helmet>
        <title>{event.name} | MyTennis Space</title>
      </Helmet>
      <SeoHelmet
        title={`${event.name} | My Tennis Space`}
        description={event.description}
        url={`https://mytennis.space/events/${event.slug}`}
      />
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

      <TruncatedText text={event.description} />

      {/* Show JoinRequest only for single-division events */}
      {(!event.divisions || event.divisions.length <= 1) && (
        <JoinRequest
          objectType={'event'}
          matchType={event.match_type}
          restrictions={event.restrictions}
          id={event.id}
          isMember={event?.is_participant}
          memberText={'You are participating'}
          isOpenRegistration={event.is_open_registration}
          startDate={event.start_date}
          registrationDate={event.registration_open_date}
          callback={async () => {
            const updatedEvent = await eventAPI.getEvent(id);
            if (updatedEvent && !updatedEvent.statusCode) {
              setEvent(updatedEvent);
            } else {
              console.error(event.statusMessage);
            }
          }}
        />
      )}

      {/* Participants Info Popup */}
      {event.count_participants > 0 && (
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {event.count_participants} participant{event.count_participants !== 1 ? 's' : ''}
          </Typography>
          <InfoPopup
            iconType="custom"
            customIcon={<FaUsers />}
            width="400px"
            size={16}
          >
            <ParticipantsContent event={event} callback={setEvent} participants={participants} />
          </InfoPopup>
        </Box>
      )}
    </Box>
  );

  // Division cards section
  const divisionCards = event.divisions && event.divisions.length > 1 && (
    <Box sx={{ mt: 4, px: isMobile ? 2 : 4 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          cursor: 'pointer',
          '&:hover': {
            '& .division-heading': {
              color: 'primary.main'
            }
          }
        }}
        onClick={() => {
          const newExpanded = !divisionsExpanded;
          setDivisionsExpanded(newExpanded);
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set('divisionsExpanded', newExpanded.toString());
          navigate(`?${newSearchParams.toString()}`, { replace: true });
        }}
      >
        <IconButton 
          size="small"
          sx={{ mr: 1 }}
        >
          {divisionsExpanded ? <MdExpandLess /> : <MdExpandMore />}
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h5" 
            className="division-heading"
            sx={{ 
              fontWeight: 600,
              transition: 'color 0.2s'
            }}
          >
            Choose Your Division
          </Typography>
        </Box>
      </Box>
      <Collapse in={divisionsExpanded}>
        <Grid container spacing={2} sx={{ mt: 1, width: '100%' }}>
        {event.divisions.map((division, index) => (
          <Grid size={{xs:12, sm:6, md:4}} key={division.id} sx={{ display: 'flex' }}>
            <DivisionCard
              division={division}
              event={event}
              isSelected={selectedDivision?.id === division.id}
              isEnrolled={isUserEnrolledInDivision(division.id)}
              onClick={() => {
                const newSearchParams = new URLSearchParams(searchParams);
                if (selectedDivision?.id === division.id) {
                  // Deselect if clicking same division
                  setSelectedDivision(null);
                  newSearchParams.delete('division');
                } else {
                  // Select new division
                  setSelectedDivision(division);
                  newSearchParams.set('division', index.toString());
                  
                  // On mobile: collapse divisions and scroll to content
                  if (isMobile) {
                    setDivisionsExpanded(false);
                    newSearchParams.set('divisionsExpanded', 'false');
                    
                    // Scroll to content after a brief delay (let React render)
                    setTimeout(() => {
                      contentRef.current?.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                      });
                    }, 100);
                  }
                }
                navigate(`?${newSearchParams.toString()}`, { replace: true });
              }}
              onSignUpSuccess={() => {
                fetchEvent();
              }}
              userMeetsRequirements={true} // TODO: Implement actual restriction checking
            />
          </Grid>
        ))}
        </Grid>
      </Collapse>
    </Box>
  );

  // Add sticky breadcrumb when division is selected on mobile
  const divisionBreadcrumb = selectedDivision && isMobile && !divisionsExpanded && (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        py: 1.5,
        px: isMobile ? 2 : 4,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        boxShadow: 1
      }}
    >
      <Chip
        label={selectedDivision.name}
        color="primary"
        sx={{ fontWeight: 600 }}
      />
      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
        Viewing division
      </Typography>
      <IconButton
        size="small"
        onClick={() => {
          setDivisionsExpanded(true);
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set('divisionsExpanded', 'true');
          navigate(`?${newSearchParams.toString()}`, { replace: true });
        }}
        sx={{ ml: 'auto' }}
      >
        <MdExpandMore />
      </IconButton>
    </Box>
  );

  // Switch to render the appropriate view
  let content;
  switch (event.event_type) {
    case "league":
      content = <LeagueViewPage event={event} participants={participants} callback={refreshEvent} />;
      break;
    case "tournament":
      content = <TournamentView event={event} tournament_id={event.tournament_id} participants={participants} callback={refreshEvent} />;
      break;
    case "ladder":
      content = <LadderView event={event} participants={participants} callback={refreshEvent} />;
      break;
    case "multievent":
      if (!selectedDivision) {
        // No division selected, show participants list
        content = (
          <Box sx={{ px: isMobile ? 2 : 4, mt: 4 }}>
            <ParticipantsContent event={event} participants={participants} includeDivisions={true} callback={setEvent} />
          </Box>
        );
      } else {
        const division_content_id = selectedDivision?.content_object?.id;
        if (selectedDivision?.type === 'league') {
          content = <LeagueViewPage event={event} participants={participants} league_id={division_content_id} callback={refreshEvent} />;
        } else if (selectedDivision?.type === 'tournament') {
          content = <TournamentView event={event} tournament_id={division_content_id} participants={participants} callback={refreshEvent} />;
        } else if (selectedDivision?.type === 'ladder') {
          content = <LadderView event={event} participants={participants} callback={refreshEvent} />;
        }
      }
      break;
    default:
      content = null;
  }

  return (
    <>
      {titleSection}
      {divisionCards}
      {divisionBreadcrumb}
      <Box ref={contentRef} sx={{ scrollMarginTop: '80px' }}>
        {content}
      </Box>
    </>
  );

};

export default EventView;
