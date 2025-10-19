import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';
import BracketMatch from './bracketMatch';
import BracketGenerator from './bracketGenerator';
import { MatchEditor } from 'components/forms';
import MyModal from 'components/layout/MyModal';
import { AuthContext } from 'contexts/AuthContext';

const TournamentBracket = ({ initialBracket, 
  event, 
  tournament_id, 
  isSelfReported, 
  division_id, 
  availableParticipants = [], 
  onMatchSubmit = null, }) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0); // Navigation state
  const [currentBracketIndex, setCurrentBracketIndex] = useState(0); // Which bracket (Main Draw, Consolation, etc.)
  const [editingMatch, setEditingMatch] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [brackets, setBrackets] = useState(initialBracket || null);

  useEffect(() => {
    setBrackets(initialBracket || null);
  }, [initialBracket]);
  const { user } = useContext(AuthContext);

  // Helper to normalize bracket structure - handle both single bracket object and array
  const bracketsArray = Array.isArray(brackets) ? brackets : (brackets?.rounds ? [brackets] : []);
  const currentBracket = bracketsArray[currentBracketIndex] || null;

  //bracket = bracket_data; // for testing
  // console.log('Rendering TournamentBracket with bracket:', bracket, initialBracket);
  // console.log('Event:', event);

  const handleBracketGenerated = (newBracket) => {
    console.log('Bracket generated callback received:', newBracket);
    
    // Update local bracket state
    setBrackets(newBracket);

    // Propagate the new bracket up to parent components
    if (onMatchSubmit) {
      // For multi-events, we might need to include division info
      let updatedDivision = null;
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
          };
        }
      }
      onMatchSubmit(newBracket, updatedDivision);
    }
  };

  // Navigation handlers
  const handlePrevious = () => {
    setCurrentRoundIndex(Math.max(0, currentRoundIndex - 1));
  };

  const handleNext = () => {
    const maxIndex = currentBracket?.rounds?.length ? currentBracket.rounds.length - 2 : 0; // -2 because we show 2 rounds at once
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
      updatedBracket = { ...currentBracket };
      updatedBracket.rounds = updatedBracket.rounds.map((round) => ({
        ...round,
        matches: round.matches.map((match) =>
          match.id === newMatch.id ? { ...match, ...newMatch } : match
        )
      }));
    }

    // Update local bracket state immediately
    setBrackets(updatedBracket);

    // Propagate changes up to parent
    onMatchSubmit && onMatchSubmit(updatedBracket, updatedDivision);
  };

  const closeModal = () => {
    setEditingMatch(null);
    setModalOpen(false);
  };

  // if no bracket -> show selection UI
  if (!currentBracket) {
    return (
      <Box sx={{ p: 2 }}>
        <BracketGenerator
          availableParticipants={availableParticipants}
          tournamentId={tournament_id}
          onBracketGenerated={handleBracketGenerated}
          title="Generate Tournament Bracket"
          subtitle="Select participants and configure seeding to generate your tournament bracket"
        />
      </Box>
    );
  }

  // bracket rendering - show only 2 rounds at a time
  const _matchHeight = 80;
  const _matchGap = 20;
  const _roundGap = 60;

  // Get the two rounds to display - handle case where currentBracket.rounds might be undefined or empty
  const displayRounds = (!currentBracket?.rounds || currentBracket.rounds.length === 0)
    ? []
    : currentBracket.rounds.length === 1
    ? [currentBracket.rounds[0]] // Single round only
    : currentBracket.rounds.slice(currentRoundIndex, currentRoundIndex + 2); // Show 2 rounds at a time

  // Calculate grid based on the FIRST displayed round (left-hand side)
  const firstDisplayedRound = displayRounds[0];
  const firstRoundMatches = firstDisplayedRound?.matches?.length || 0;
  const totalGridRows = firstRoundMatches * 2 - 1;

  return (
    <Box sx={{ p: 2 }}>
      {/* Bracket Selector - Only show if there are multiple brackets */}
      {bracketsArray.length > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Select
            value={currentBracketIndex}
            onChange={(e) => {
              setCurrentBracketIndex(e.target.value);
              setCurrentRoundIndex(0); // Reset round index when switching brackets
            }}
            size="small"
          >
            {bracketsArray.map((b, idx) => (
              <MenuItem key={idx} value={idx}>
                {b.name || `Bracket ${idx + 1}`}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}

      {/* Navigation Controls - Only show if there are multiple rounds */}
      {currentBracket?.rounds && currentBracket.rounds.length > 1 && (
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
            disabled={currentRoundIndex >= (currentBracket?.rounds?.length || 0) - 2}
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
      )}
      
      {/* Single round title - show only if there's exactly 1 round */}
      {currentBracket?.rounds && currentBracket.rounds.length === 1 && displayRounds[0] && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Typography variant="h6">
            {displayRounds[0]?.round_of_text || 'Final'}
          </Typography>
        </Box>
      )}

      {/* Bracket Display */}
      {displayRounds.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No bracket rounds available. Generate a bracket to get started.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', overflowX: 'auto', gap: `${_roundGap}px`, py: 2, px: 2 }}>
          {displayRounds.map((round, roundIndex) => {
          const matches = round.matches || [];
          const isLastDisplayedRound = roundIndex === displayRounds.length - 1;
          const isFinalRound = currentRoundIndex + roundIndex === (currentBracket?.rounds?.length || 0) - 1;

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
                        isAdmin={event.is_admin} 
                        isSelfReported={isSelfReported} 
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
      )}

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
