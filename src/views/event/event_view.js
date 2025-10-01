import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, MenuItem, TextField, Typography, useMediaQuery } from "@mui/material";
import { eventAPI } from "api/services";
import LeagueViewPage from "views/league/league_view";
import TournamentView from "views/Tournament/tournamentView";
import LadderView from "views/ladder/view";
import { Helmet } from "react-helmet-async";
import { helpers } from "helpers";
import { useTheme } from "@emotion/react";
import TruncatedText from "components/forms/truncateText";
import JoinRequest from "components/forms/Notifications/joinRequests";
import InfoPopup from "components/forms/infoPopup";
import { FaUsers } from "react-icons/fa";
import ParticipantsContent from "components/forms/Event/ParticipantContent";

const EventView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Use React Router's hook
  const division_num = searchParams.get('division'); // This will properly track changes
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
    } catch (err) {
      setError("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  // Only fetch event when ID changes, not division_num
  useEffect(() => {
    fetchEvent();
  }, [id]); // Remove division_num from dependencies

  // Handle initial division selection after event loads
  useEffect(() => {
    if (event && event.divisions) {
      console.log("division_num from URL:", division_num);

      let division = null;
      if (division_num !== null) {
        const division_index = parseInt(division_num);
        if (division_index >= 0 && division_index < event.divisions.length) {
          division = event.divisions[division_index];
        }
      }
      // If division_num is null or invalid, leave division as null (blank selection)

      console.log("Setting initial/updated division:", division);

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
  }, [division_num, event?.divisions]); // This only updates division selection, not the entire event

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

      <TruncatedText text={event.description} />

      <JoinRequest
        objectType={'event'}
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

      {/* Participants Info Popup */}
      {event.count_participants > 0 && (
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {event.count_participants} participant{event.count_participants !== 1 ? 's' : ''}
          </Typography>
          <InfoPopup
            iconType="custom"
            customIcon={<FaUsers />}
            //backgroundColor="white"
            width="400px"
            size={16}
          >
            <ParticipantsContent event={event} callback={setEvent} />
          </InfoPopup>
        </Box>
      )}

      {/* Division selector integrated into title section */}
      {event.divisions && event.divisions.length > 1 && (
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
              if (e.target.value === "") {
                // Blank option selected
                setSelectedDivision(null);

                // Remove division parameter from URL
                const newSearchParams = new URLSearchParams(window.location.search);
                newSearchParams.delete('division');

                const newUrl = newSearchParams.toString()
                  ? `${window.location.pathname}?${newSearchParams.toString()}`
                  : window.location.pathname;
                navigate(newUrl, { replace: true });
              } else {
                const selected = event.divisions.find(d => d.id === e.target.value);
                setSelectedDivision(selected);

                // Update URL with division index
                const divisionIndex = event.divisions.findIndex(d => d.id === e.target.value);
                const newSearchParams = new URLSearchParams(window.location.search);
                newSearchParams.set('division', divisionIndex.toString());

                // Update URL without page reload
                const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
                navigate(newUrl, { replace: true });
              }
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
            <MenuItem value="">
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                Select a division
              </Typography>
            </MenuItem>
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
      if (!selectedDivision) {
        // No division selected, show participants list
        content = (
          <Box sx={{ px: isMobile ? 2 : 4, mt: 4 }}>
            <ParticipantsContent event={event} includeDivisions={true} callback={setEvent} />
          </Box>
        );
      } else {
        const division_content_id = selectedDivision?.content_object?.id;
        console.log("Selected Division:", selectedDivision);
        if (selectedDivision?.type === 'league')
          content = <LeagueViewPage event={event} division={selectedDivision} />;
        else if (selectedDivision?.type === 'tournament') {
          content = <TournamentView
            key={division_content_id}
            event={event}
            tournament_id={division_content_id}
            division={selectedDivision}
            callback={refreshEvent}
          />;
        }
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
