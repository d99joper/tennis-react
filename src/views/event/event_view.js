import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, MenuItem, TextField, Typography, useMediaQuery, CircularProgress, Card, Button, Checkbox } from "@mui/material";
import { eventAPI, divisionAPI } from "api/services";
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
import { ProfileImage } from "components/forms/ProfileImage";
import DivisionSelect from '../../components/forms/Event/divisionSelect';

// Participants Content Component
const ParticipantsContent = ({ event }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [lastEventUpdate, setLastEventUpdate] = useState(null);
  const [lastParticipantCount, setLastParticipantCount] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [participantDivisions, setParticipantDivisions] = useState({});
  const [selectedDivisionForAssignment, setSelectedDivisionForAssignment] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        // Only show main loading on first load, use updating for subsequent fetches
        if (!hasLoaded) {
          setLoading(true);
        } else {
          setUpdating(true);
        }
        
        const response = await eventAPI.getParticipants(event.id, null, 1, 1000);
        const participantsList = response.data || [];
        setParticipants(participantsList);
        
        // Build participant to divisions mapping (supports multiple divisions per participant)
        const divisionMap = {};
        if (event.divisions) {
          event.divisions.forEach(division => {
            if (division.participants) {
              division.participants.forEach(participantId => {
                if (!divisionMap[participantId]) {
                  divisionMap[participantId] = [];
                }
                divisionMap[participantId].push(division.id);
              });
            }
          });
        }
        setParticipantDivisions(divisionMap);
        
        setLastEventUpdate(event.updated_on || event.id);
        setLastParticipantCount(event.count_participants);
        setHasLoaded(true);
      } catch (error) {
        console.error('Failed to fetch participants:', error);
        if (!hasLoaded) {
          setParticipants([]);
        }
        setHasLoaded(true);
      } finally {
        setLoading(false);
        setUpdating(false);
      }
    };

    // Only fetch if we haven't loaded yet, or if the event has been updated, or if participant count changed
    const shouldFetch = !hasLoaded || 
                       lastEventUpdate !== (event.updated_on || event.id) ||
                       lastParticipantCount !== event.count_participants;

    if (shouldFetch) {
      fetchParticipants();
    }
  }, [event.id, event.updated_on, event.count_participants, event.divisions, hasLoaded, lastEventUpdate, lastParticipantCount]);

  // Auto-select participants who are already in the selected division
  useEffect(() => {
    if (selectedDivisionForAssignment) {
      const participantsInDivision = participants
        .filter(p => p.divisions?.some(div => div.id === selectedDivisionForAssignment))
        .map(p => p.id);
      
      setSelectedParticipants(participantsInDivision);
    } else {
      setSelectedParticipants([]);
    }
  }, [selectedDivisionForAssignment, participants]);

  const handleParticipantToggle = (participantId) => {
    setSelectedParticipants(prev => {
      if (prev.includes(participantId)) {
        return prev.filter(id => id !== participantId);
      } else {
        return [...prev, participantId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedParticipants.length === participants.length) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(participants.map(p => p.id).filter(Boolean));
    }
  };
  
  const handleBulkAssign = async () => {
    if (!selectedDivisionForAssignment) return;
    
    try {
      setAssigning(true);
      
      // Get participants who are already in the selected division
      const participantsAlreadyInDivision = participants
        .filter(p => p.divisions?.some(div => div.id === selectedDivisionForAssignment))
        .map(p => p.id);
      
      // Find participants to add (checked but not already in division)
      const participantsToAdd = selectedParticipants.filter(id => 
        !participantsAlreadyInDivision.includes(id)
      );
      
      // Find participants to remove (were in division but now unchecked)
      const participantsToRemove = participantsAlreadyInDivision.filter(id => 
        !selectedParticipants.includes(id)
      );
      
      // Add participants to division
      if (participantsToAdd.length > 0) {
        await divisionAPI.addDivisionPlayers(selectedDivisionForAssignment, participantsToAdd);
      }
      
      // Remove participants from division
      if (participantsToRemove.length > 0) {
        await divisionAPI.removeDivisionPlayers(selectedDivisionForAssignment, participantsToRemove);
      }
      
      // Update participants data to reflect changes
      setParticipants(prev => prev.map(participant => {
        const participantId = participant.id;
        let updatedDivisions = [...(participant.divisions || [])];
        
        // Add division if participant was added
        if (participantsToAdd.includes(participantId)) {
          const division = event.divisions.find(d => d.id === selectedDivisionForAssignment);
          if (division && !updatedDivisions.some(d => d.id === division.id)) {
            updatedDivisions.push(division);
          }
        }
        
        // Remove division if participant was removed
        if (participantsToRemove.includes(participantId)) {
          updatedDivisions = updatedDivisions.filter(d => d.id !== selectedDivisionForAssignment);
        }
        
        return {
          ...participant,
          divisions: updatedDivisions
        };
      }));
      
      // Clear selections
      setSelectedParticipants([]);
      setSelectedDivisionForAssignment('');
      
    } catch (error) {
      console.error('Failed to assign/remove participants to/from division:', error);
    } finally {
      setAssigning(false);
    }
  };

  // Calculate add/remove counts for button text
  const getAssignmentCounts = () => {
    if (!selectedDivisionForAssignment) return { toAdd: 0, toRemove: 0 };
    
    const participantsAlreadyInDivision = participants
      .filter(p => p.divisions?.some(div => div.id === selectedDivisionForAssignment))
      .map(p => p.id);
    
    const toAdd = selectedParticipants.filter(id => !participantsAlreadyInDivision.includes(id)).length;
    const toRemove = participantsAlreadyInDivision.filter(id => !selectedParticipants.includes(id)).length;
    
    return { toAdd, toRemove };
  };

  const { toAdd, toRemove } = getAssignmentCounts();
  const hasChanges = toAdd > 0 || toRemove > 0;

  // Show main loading only on first load
  if (loading && !hasLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  const showCheckboxes = event.is_admin && event.event_type === 'multievent' && event.divisions?.length > 0;

  return (
    <Box>
      <Card sx={{ p: 2, mb: 2, backgroundColor: 'background.paper', boxShadow: 1 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Signed up ({event.count_participants})
        </Typography>

        {/* Division Assignment Section - Only for admins */}
        {showCheckboxes && (
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            backgroundColor: 'grey.50', 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.200'
          }}>
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
              Assign participants to division:
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                select
                size="small"
                variant="outlined"
                value={selectedDivisionForAssignment}
                onChange={(e) => setSelectedDivisionForAssignment(e.target.value)}
                disabled={assigning}
                sx={{ minWidth: 180 }}
                placeholder="Select division"
              >
                <MenuItem value="">
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    Select a division
                  </Typography>
                </MenuItem>
                {event.divisions?.map((division) => (
                  <MenuItem key={division.id} value={division.id}>
                    <Typography variant="body2">
                      {division.name}
                    </Typography>
                  </MenuItem>
                ))}
              </TextField>
              
              {selectedDivisionForAssignment && (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleSelectAll}
                    disabled={assigning}
                    sx={{ textTransform: 'none' }}
                  >
                    {selectedParticipants.length === participants.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  
                  {hasChanges && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleBulkAssign}
                      disabled={assigning}
                      sx={{ 
                        textTransform: 'none',
                        backgroundColor: toRemove > 0 ? 'error.main' : 'primary.main',
                        '&:hover': {
                          backgroundColor: toRemove > 0 ? 'error.dark' : 'primary.dark',
                        }
                      }}
                    >
                      {assigning ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        (() => {
                          const parts = [];
                          if (toAdd > 0) parts.push(`Assign ${toAdd}`);
                          if (toRemove > 0) parts.push(`Remove ${toRemove}`);
                          return parts.join(' and ');
                        })()
                      )}
                    </Button>
                  )}
                </>
              )}
            </Box>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {participants.length > 0 ? (
            <>
              {participants.map((participant, index) => {
                const participantId = participant.id;
                const isSelected = selectedParticipants.includes(participantId);
                
                // Check if participant is already in the selected division
                const isAlreadyInSelectedDivision = selectedDivisionForAssignment && 
                  participant.divisions?.some(div => div.id === selectedDivisionForAssignment);
                
                // Determine if this would be a removal (was in division but now unchecked)
                const wouldBeRemoved = isAlreadyInSelectedDivision && !isSelected;
                
                return (
                  <Box key={participant.id || index} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: isSelected ? 'action.selected' : 'transparent',
                    border: isSelected ? '1px solid' : '1px solid transparent',
                    borderColor: isSelected ? 'primary.main' : 'transparent'
                  }}>
                    {/* Checkbox - only show when division is selected for assignment */}
                    {showCheckboxes && selectedDivisionForAssignment && (
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleParticipantToggle(participantId)}
                        disabled={assigning}
                        size="small"
                        sx={{
                          color: wouldBeRemoved ? 'error.main' : 'primary.main',
                          '&.Mui-checked': {
                            color: wouldBeRemoved ? 'error.main' : 'primary.main',
                          },
                          '& .MuiSvgIcon-root': wouldBeRemoved ? {
                            backgroundColor: 'error.main',
                            color: 'white',
                            borderRadius: '3px'
                          } : {}
                        }}
                        icon={wouldBeRemoved ? 
                          <Box sx={{
                            width: 18,
                            height: 18,
                            backgroundColor: 'error.main',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid',
                            borderColor: 'error.main'
                          }}>
                            <Box sx={{
                              width: 10,
                              height: 2,
                              backgroundColor: 'white'
                            }} />
                          </Box>
                          : undefined
                        }
                        checkedIcon={wouldBeRemoved ? 
                          <Box sx={{
                            width: 18,
                            height: 18,
                            backgroundColor: 'error.main',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid',
                            borderColor: 'error.main'
                          }}>
                            <Box sx={{
                              width: 10,
                              height: 2,
                              backgroundColor: 'white'
                            }} />
                          </Box>
                          : undefined
                        }
                      />
                    )}
                    
                    <ProfileImage
                      player={participant?.content_object}
                      size={32}
                      showName={true}
                      asLink={true}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        <Link
                          to={`/players/${participant?.content_object?.slug}`}
                          style={{ 
                            textDecoration: 'none', 
                            color: 'inherit'
                          }}
                        >
                          {participant?.content_object?.first_name} {participant?.content_object?.last_name}
                        </Link>
                      </Typography>
                      {participant?.content_object?.rating && (
                        <Typography variant="caption" sx={{
                          color: 'text.secondary',
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          alignSelf: 'flex-start',
                          mt: 0.25
                        }}>
                          {participant.content_object.rating}
                        </Typography>
                      )}
                      
                      {/* Show assigned divisions - always show from participant.divisions */}
                      {participant.divisions && participant.divisions.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                          {participant.divisions.map(division => (
                            <Typography
                              key={division.id}
                              variant="caption"
                              sx={{
                                backgroundColor: 'primary.light',
                                color: 'primary.contrastText',
                                px: 0.75,
                                py: 0.25,
                                borderRadius: 0.5,
                                fontSize: '0.7rem'
                              }}
                            >
                              {division.name}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>
                );
              })}
              
              {/* Show small loading indicator at the end when updating */}
              {updating && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  opacity: 0.6,
                  py: 1
                }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Updating...
                  </Typography>
                </Box>
              )}
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {updating ? "Loading participants..." : "No participants found"}
            </Typography>
          )}
        </Box>
      </Card>
    </Box>
  );
};

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
            <ParticipantsContent event={event} />
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
            <ParticipantsContent event={event} />
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
