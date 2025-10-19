// Participants Content Component
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, MenuItem, TextField, Typography, CircularProgress, Card, Button, Checkbox } from "@mui/material";
import { eventAPI, divisionAPI } from "api/services";
import { ProfileImage } from "components/forms/ProfileImage";

const ParticipantsContent = ({ event, participants: propParticipants = null, includeDivisions = false, callback }) => {
  const [participants, setParticipants] = useState(propParticipants || []);
  const [loading, setLoading] = useState(!propParticipants);
  const [updating, setUpdating] = useState(false);
  const [lastEventUpdate, setLastEventUpdate] = useState(null);
  const [lastParticipantCount, setLastParticipantCount] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(!!propParticipants);
  //const [participantDivisions, setParticipantDivisions] = useState({}); 
  const [selectedDivisionForAssignment, setSelectedDivisionForAssignment] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    // If participants are provided as props, use them
    if (propParticipants) {
      setParticipants(propParticipants);
      setHasLoaded(true);
      setLoading(false);
      return;
    }

    const fetchParticipants = async () => {
      try {
        // Only show main loading on first load, use updating for subsequent fetches
        if (!hasLoaded) {
          setLoading(true);
        } else {
          setUpdating(true);
        }
        console.log('Fetching participants for event', event.id, 'with includeDivisions:', includeDivisions);
        const response = await eventAPI.getParticipants(event.id, {include_divisions: includeDivisions}, 1, 1000);
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
        //setParticipantDivisions(divisionMap);
        
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
  }, [event.id, event.updated_on, event.count_participants, event.divisions, hasLoaded, lastEventUpdate, lastParticipantCount, propParticipants, includeDivisions]);

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
      
      function refreshEventData() {
        eventAPI.getEvent(event.id).then(updatedEvent => {
          if (updatedEvent && !updatedEvent.statusCode) {
            callback(updatedEvent);
          }
        });
      }

      // Add participants to division
      if (participantsToAdd.length > 0) {
        await divisionAPI.addDivisionPlayers(selectedDivisionForAssignment, participantsToAdd);
        // update the division's league standings if applicable
        const division = event.divisions.find(d => d.id === selectedDivisionForAssignment);
        if (division && division.type === 'league') {
          refreshEventData();
        }
      }

      // Remove participants from division
      if (participantsToRemove.length > 0) {
        await divisionAPI.removeDivisionPlayers(selectedDivisionForAssignment, participantsToRemove);
        // update the division's league standings if applicable
        const division = event.divisions.find(d => d.id === selectedDivisionForAssignment);
        if (division && division.type === 'league') {
          refreshEventData();
        }
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
                      player={participant?.players[0]}
                      size={32}
                      showName={true}
                      asLink={true}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        <Link
                          to={`/players/${participant?.players[0]?.slug}`}
                          style={{ 
                            textDecoration: 'none', 
                            color: 'inherit'
                          }}
                        >
                          {participant?.players[0]?.first_name} {participant?.players[0]?.last_name}
                        </Link>
                      </Typography>
                      
                      
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

export default ParticipantsContent;