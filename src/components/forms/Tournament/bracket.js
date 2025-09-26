import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2'; // Grid2
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  TextField,
  Button,
  IconButton,
  Divider,
} from '@mui/material';
import { AiFillDelete } from 'react-icons/ai';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';
import { divisionAPI, eventAPI, tournamentsAPI } from 'api/services';
import BracketMatch from './bracketMatch';
import bracket_data from './test_data';
import { MatchEditor } from 'components/forms';
import MyModal from 'components/layout/MyModal';
import { AuthContext } from 'contexts/AuthContext';

const TournamentBracket = ({ initialBracket, event, tournament_id, isSelfReported, division_id, onMatchSubmit = null }) => {
  const [selectedParticipants, setSelectedParticipants] = React.useState([]);
  const [availableParticipants, setAvailableParticipants] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [useSeeding, setUseSeeding] = React.useState(true);
  const [seedCount, setSeedCount] = React.useState(4);
  const [currentRoundIndex, setCurrentRoundIndex] = React.useState(0); // Navigation state
  const [editingMatch, setEditingMatch] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [bracket, setBracket] = useState(initialBracket || null);

  useEffect(() => {
    setBracket(initialBracket || null);
  }, [initialBracket]);
  const { user, isLoggedIn, loading: userIsLoading } = useContext(AuthContext);

  //bracket = bracket_data; // for testing
  // console.log('Rendering TournamentBracket with bracket:', bracket, initialBracket);
  // console.log('Event:', event);
  const handleChange = (e) => {
    const next = e.target.value || [];
    setSelectedParticipants(next);
    // Remove this line - it's causing the flicker
    // setSeedCount((s) => Math.min(s, next.length || 0));
  };

  const handleRemove = (name) => {
    const id = typeof name === 'string' || typeof name === 'number' ? name : name?.id;
    setSelectedParticipants((prev) => {
      const next = prev.filter((p) => p.id !== id);
      // Remove this line too - handle it in useEffect instead
      // setSeedCount((s) => Math.min(s, next.length));
      return next;
    });
  };

  // Add a useEffect to handle seedCount adjustments properly
  useEffect(() => {
    // Only adjust seedCount if it exceeds the number of selected participants
    if (seedCount > selectedParticipants.length) {
      setSeedCount(selectedParticipants.length);
    }
  }, [selectedParticipants.length, seedCount]);

  const handleGenerate = async () => {
    setLoading(true);
    const participants = selectedParticipants.map((p, idx) => ({
      id: p.id,
      seed: useSeeding && idx < seedCount ? idx + 1 : null,
    }));
    console.log('Generating bracket with participants:', participants);

    try {
      const response = await tournamentsAPI.generateBrackets(tournament_id, participants, useSeeding, seedCount);
      const newBracket = { rounds: response }
      console.log('Generated bracket response:', newBracket);

      if (newBracket) {
        // Update local bracket state
        setBracket(newBracket);

        // Propagate the new bracket up to parent components
        if (onMatchSubmit) {
          // For multi-events, we might need to include division info
          const updatedDivision = null
          if (division_id && event.event_type === 'multievent') {
            // find the division object based on division_id
            let currentDivision = event.divisions.find(d => d.id === division_id);
            if (currentDivision) {
              updatedDivision = {
                ...currentDivision,
                content_object: {
                  ...currentDivision.content_object,
                  bracket: newBracket
                }
              }
            }
            onMatchSubmit(newBracket, updatedDivision);
          }
        }
      }
    } catch (err) {
      console.error('Error generating bracket:', err);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!event.id) return;
    const fetchParticipants = async () => {
      try {
        const res = await eventAPI.getParticipants(event.id, null, 0);
        setAvailableParticipants(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchParticipants();
  }, [event.id]);

  const [dragIndex, setDragIndex] = React.useState(null);

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (dragIndex === null || dragIndex === index) return;
    const updated = [...selectedParticipants];
    const [removed] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, removed);
    setSelectedParticipants(updated);
    setDragIndex(null);
  };

  // Navigation handlers
  const handlePrevious = () => {
    setCurrentRoundIndex(Math.max(0, currentRoundIndex - 1));
  };

  const handleNext = () => {
    const maxIndex = bracket.rounds.length - 2; // -2 because we show 2 rounds at once
    setCurrentRoundIndex(Math.min(maxIndex, currentRoundIndex + 1));
  };

  // Modal handlers
  const handleReportScore = (match) => {
    setEditingMatch(match);
    setModalOpen(true);
  };

  const handleAddComment = (match) => {
    // Handle comment functionality
    console.log('Add comment for match:', match);
  };

  const handleMatchEditorSubmit = (updatedMatchData) => {
    console.log("Match reported:", updatedMatchData);
    setEditingMatch(null);
    setModalOpen(false);

    let updatedDivision = null;
    let updatedBracket = null;

    if (updatedMatchData.division) {
      // For multi-events, use the updated division
      updatedDivision = updatedMatchData.division;
      updatedBracket = updatedDivision.content_object?.bracket || null;
    } else {
      // For regular tournaments, update the bracket directly
      const newMatch = updatedMatchData.schedule_match;
      updatedBracket = { ...bracket };
      updatedBracket.rounds = updatedBracket.rounds.map((round) => ({
        ...round,
        matches: round.matches.map((match) =>
          match.id === newMatch.id ? { ...match, ...newMatch } : match
        )
      }));
    }

    // Update local bracket state immediately
    setBracket(updatedBracket);

    // Propagate changes up to parent
    onMatchSubmit && onMatchSubmit(updatedBracket, updatedDivision);
  };

  const closeModal = () => {
    setEditingMatch(null);
    setModalOpen(false);
  };

  // if no bracket -> show selection UI
  if (!bracket) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>No bracket available</Typography>

        <Grid
          container
          spacing={2}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 2fr' },
            alignItems: 'start',
            gap: 16 / 8,
          }}
        >
          {/* 1,1 Select Participants */}
          <Grid xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Select Participants:
            </Typography>
            <Select
              multiple
              value={selectedParticipants}
              onChange={handleChange}
              sx={{ minWidth: 200, maxWidth: 200 }}
              renderValue={(selected) => (selected || []).map((p) => p.name).join(', ')}
            >
              {availableParticipants.map((p) => (
                <MenuItem key={p.id} value={p}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* 1,2 Use seeding switch (content can scroll internally) */}
          <Grid xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={useSeeding}
                    onChange={(e) => setUseSeeding(e.target.checked)}
                    color="primary"
                  />
                }
                label="Use seeding"
              />
              {useSeeding && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    How many players should be seeded?
                  </Typography>
                  <TextField
                    type="number"
                    size="small"
                    value={seedCount}
                    onChange={(e) => {
                      const v = Number(e.target.value) || 0;
                      setSeedCount(Math.max(0, Math.min(v, selectedParticipants.length)));
                    }}
                    inputProps={{ min: 0, max: Math.max(0, selectedParticipants.length) }} // Changed from slotProps
                    sx={{ width: 100 }}
                  />
                </Box>
              )}
            </Box>
          </Grid>

          {/* 1,3 Selected participants grid (scroll internally so it doesn't push button) */}
          <Grid xs={12} md={4}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Selected Participants:
            </Typography>

            <Box
              sx={{
                display: 'inline-block',
                minWidth: 220,
                maxWidth: 360,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              {/* header */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: useSeeding ? '65px 1fr 65px' : '1fr 65px',
                  alignItems: 'center',
                  fontWeight: 600,
                  background: '#1b5e20',
                  color: 'white',
                  px: 1,
                  py: 1,
                }}
              >
                {useSeeding && <Typography sx={{ textAlign: 'center' }}>Seed #</Typography>}
                {/* <Divider orientation="vertical" flexItem sx={{ mx: 0, bgcolor: 'rgba(241, 226, 226, 1)' }} /> */}
                <Typography sx={{ pl: 2 }}>Name</Typography>
                {/* <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'rgba(255,255,255,0.2)' }} /> */}
                <Typography sx={{ textAlign: 'center' }}>Remove</Typography>
              </Box>

              {/* rows: constrain height so tall lists scroll internally */}
              <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
                {selectedParticipants.map((name, idx) => (
                  <Box
                    key={selectedParticipants[idx].id}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: useSeeding ? '65px 1fr 65px' : '1fr 65px',
                      alignItems: 'center',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      px: 1,
                      py: 0.5,
                      cursor: 'grab',
                      background: dragIndex === idx ? 'rgba(0,0,0,0.04)' : 'transparent',
                    }}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(idx)}
                  >
                    {useSeeding && (
                      <Typography sx={{ textAlign: 'center', fontWeight: 500 }}>
                        {idx < seedCount ? idx + 1 : '-'}
                      </Typography>
                    )}
                    <Typography sx={{ pr: 1 }}>{selectedParticipants[idx].name}</Typography>
                    <IconButton size="small" onClick={() => handleRemove(selectedParticipants[idx])}>
                      <AiFillDelete />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Row 2: Generate button spanning all columns */}
          <Grid xs={12} sx={{ gridColumn: '1 / -1' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerate}
              disabled={selectedParticipants.length < 2 || loading}
              sx={{ width: { xs: '100%', md: '100%' }, mt: 2 }}
            >
              {loading ? 'Generating...' : 'Generate Bracket'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // bracket rendering - show only 2 rounds at a time
  const _matchHeight = 80;
  const _matchGap = 20;
  const _roundGap = 60;

  // Get the two rounds to display
  const displayRounds = bracket.rounds.slice(currentRoundIndex, currentRoundIndex + 2);

  // Calculate grid based on the FIRST displayed round (left-hand side)
  const firstDisplayedRound = displayRounds[0];
  const firstRoundMatches = firstDisplayedRound?.matches?.length || 0;
  const totalGridRows = firstRoundMatches * 2 - 1;

  return (
    <Box sx={{ p: 2 }}>
      {/* Navigation Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton
          onClick={handlePrevious}
          disabled={currentRoundIndex === 0}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
            '&:disabled': { bgcolor: 'grey.300' }
          }}
        >
          <IoArrowBack />
        </IconButton>

        <Typography variant="h6">
          {displayRounds.length === 2
            ? `${displayRounds[0]?.round_of_text || `Round ${currentRoundIndex + 1}`} → ${displayRounds[1]?.round_of_text || `Round ${currentRoundIndex + 2}`}`
            : displayRounds[0]?.round_of_text || `Round ${currentRoundIndex + 1}`
          }
        </Typography>

        <IconButton
          onClick={handleNext}
          disabled={currentRoundIndex >= bracket.rounds.length - 2}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
            '&:disabled': { bgcolor: 'grey.300' }
          }}
        >
          <IoArrowForward />
        </IconButton>
      </Box>

      {/* Bracket Display */}
      <Box sx={{ display: 'flex', overflowX: 'auto', gap: `${_roundGap}px`, py: 2, px: 2 }}>
        {displayRounds.map((round, roundIndex) => {
          const matches = round.matches || [];
          const isLastDisplayedRound = roundIndex === displayRounds.length - 1;
          const isFinalRound = currentRoundIndex + roundIndex === bracket.rounds.length - 1;

          // Calculate how many grid rows each match should span in this round
          // Reset the calculation for each displayed round pair
          const matchSpan = Math.pow(2, roundIndex + 1) - 1;
          const matchOffset = Math.pow(2, roundIndex) - 1;

          // Calculate the minimum height needed for this round
          const lastMatchIndex = matches.length - 1;
          const lastMatchGridRow = matchOffset + lastMatchIndex * (matchSpan + 1) + 1;
          const rowHeight = _matchHeight / 2 + _matchGap / 2;
          const minHeight = (lastMatchGridRow - 1) * rowHeight + _matchHeight + 100;

          return (
            <Box key={currentRoundIndex + roundIndex} sx={{ minWidth: 240, position: 'relative' }}>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                {round.round_of_text || `Round ${currentRoundIndex + roundIndex + 1}`}
              </Typography>

              {/* Grid container with calculated minimum height */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateRows: `repeat(${totalGridRows}, ${_matchHeight / 2 + _matchGap / 2}px)`,
                  gap: 0,
                  position: 'relative',
                  minHeight: `${minHeight}px`,
                  height: 'auto',
                }}
              >
                {matches.map((match, matchIndex) => {
                  // Calculate which grid row this match should start at
                  const gridRowStart = matchOffset + matchIndex * (matchSpan + 1) + 1;

                  return (
                    <Box
                      key={matchIndex}
                      sx={{
                        gridRow: `${gridRowStart} / span 1`,
                        position: 'relative',
                        pr: isLastDisplayedRound ? 0 : `${_roundGap}px`,
                      }}
                    >
                      <BracketMatch
                        match={match}
                        matchHeight={_matchHeight}
                        showConnector={!isFinalRound}
                        isAdmin={event.is_admin} // TODO: pass actual isAdmin prop
                        isSelfReported={isSelfReported} // TODO: determine if current user has reported
                        onReportScore={handleReportScore}
                        onAddComment={handleAddComment}
                      />
                    </Box>
                  );
                })}
              </Box>

              {/* Connector lines */}
              {!isLastDisplayedRound && (
                <Box
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: 60,
                    height: `${minHeight}px`,
                    width: `${_roundGap}px`,
                    pointerEvents: 'none',
                  }}
                >
                  {Array.from({ length: Math.floor(matches.length / 2) }).map((_, pairIndex) => {
                    const topMatchGridRow = matchOffset + pairIndex * 2 * (matchSpan + 1) + 1;
                    const bottomMatchGridRow = matchOffset + (pairIndex * 2 + 1) * (matchSpan + 1) + 1;

                    const rowHeight = _matchHeight / 2 + _matchGap / 2;
                    const topY = (topMatchGridRow - 1) * rowHeight + _matchHeight / 2;
                    const bottomY = (bottomMatchGridRow - 1) * rowHeight + _matchHeight / 2;
                    const centerY = (topY + bottomY) / 2;

                    return (
                      <React.Fragment key={pairIndex}>
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 43,
                            top: `${topY - 3}px`,
                            width: '2px',
                            height: `${bottomY - topY - 2}px`,
                            backgroundColor: 'divider',
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 43,
                            top: `${centerY - 1}px`,
                            width: `${_roundGap + 20}px`,
                            height: '2px',
                            backgroundColor: 'divider',
                          }}
                        />
                      </React.Fragment>
                    );
                  })}
                </Box>
              )}

              {/* Right-hand side connector lines for the second displayed round */}
              {roundIndex === 1 && displayRounds.length === 2 && (
                <Box
                  sx={{
                    position: 'absolute',
                    right: -_roundGap,
                    top: 60,
                    height: `${minHeight}px`,
                    width: `${_roundGap}px`,
                    pointerEvents: 'none',
                  }}
                >
                  {Array.from({ length: Math.floor(matches.length / 2) }).map((_, pairIndex) => {
                    const topMatchGridRow = matchOffset + pairIndex * 2 * (matchSpan + 1) + 1;
                    const bottomMatchGridRow = matchOffset + (pairIndex * 2 + 1) * (matchSpan + 1) + 1;

                    const rowHeight = _matchHeight / 2 + _matchGap / 2;
                    const topY = (topMatchGridRow - 1) * rowHeight + _matchHeight / 2;
                    const bottomY = (bottomMatchGridRow - 1) * rowHeight + _matchHeight / 2;
                    const centerY = (topY + bottomY) / 2;

                    return (
                      <React.Fragment key={`right-${pairIndex}`}>
                        {/* Vertical line connecting the pair */}
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 43,
                            top: `${topY - 3}px`,
                            width: '2px',
                            height: `${bottomY - topY - 2}px`,
                            backgroundColor: 'divider',
                          }}
                        />
                        {/* Horizontal line extending to the right */}
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 43,
                            top: `${centerY - 1}px`,
                            width: '20px',
                            height: '2px',
                            backgroundColor: 'divider',
                          }}
                        />
                      </React.Fragment>
                    );
                  })}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Match Editor Modal - Single instance */}
      <MyModal showHide={modalOpen} onClose={closeModal} title="Report Match">
        {editingMatch && (
          <MatchEditor
            participant={user}
            event={event}
            division_id={division_id || null}
            matchType={event.match_type}
            scheduleMatchId={editingMatch.id}
            limitedParticipants={[editingMatch.player1, editingMatch.player2]}
            onSubmit={(matchData) => {
              console.log("Match reported:", matchData);
              handleMatchEditorSubmit(matchData);
              closeModal();
            }}
          />
        )}
      </MyModal>
    </Box>
  );
};


export default TournamentBracket;
