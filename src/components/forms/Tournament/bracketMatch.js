// BracketMatch component for rendering individual matches
import React, { useContext, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { ProfileImage } from '../ProfileImage';
import { AuthContext } from 'contexts/AuthContext';

// Helper function to parse and split scores
const parseScore = (scoreString, playerNumber, winnerId, player1Id, player2Id) => {
  if (!scoreString) return [];

  // Split by comma and clean up
  const sets = scoreString.split(',').map(set => set.trim());

  return sets.map(set => {
    const scores = set.split('-').map(s => s.trim());
    if (scores.length === 2) {
      // Determine if player1 is the winner by comparing with winnerId
      const isPlayer1Winner = winnerId === player1Id;
      
      if (playerNumber === 1) {
        // For player 1: if they won, return first score, otherwise second
        return isPlayer1Winner ? scores[0] : scores[1];
      } else {
        // For player 2: if player1 won, return second score, otherwise first 
        return isPlayer1Winner ? scores[1] : scores[0];
      }
    }
    return '';
  });
};

// Helper function to determine if a score should be highlighted (highest in the set)
const shouldHighlightScore = (scoreString, setIndex, isWinner) => {
  if (!scoreString) return false;
  
  const sets = scoreString.split(',').map(set => set.trim());
  if (setIndex >= sets.length) return false;
  
  const set = sets[setIndex];
  const scores = set.split('-').map(s => parseInt(s.trim()));
  
  const [score1, score2] = scores;
  
  if(isWinner) console.log("Player is winner");
  
  // Highlight if this player's score is higher than opponent's
  if (isWinner) {
    return score1 > score2;
  } else {
    return score2 > score1;
  }
};

const BracketMatch = ({
  match,
  matchHeight = 64,
  showConnector = true,
  isAdmin = false,
  isSelfReported = false,
  onReportScore = null,
  onAddComment = null,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, isLoggedIn, loading: userIsLoading } = useContext(AuthContext)

  if (!match || match.isDummy) {
    // Render invisible placeholder for spacing
    return (
      <Box
        sx={{
          height: `${matchHeight}px`,
          position: 'relative',
          minWidth: 180,
          visibility: 'hidden',
        }}
      >
        {showConnector && (
          <Box
            sx={{
              position: 'absolute',
              right: -45,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '45px',
              height: '2px',
              visibility: 'hidden',
            }}
          />
        )}
      </Box>
    );
  }

  // Update how you determine the winner and call parseScore
  const winnerId = (match.winners && match.winners.length > 0) ? match.winners[0].id : 
                   match.winner_id || null;
  const isPlayer1Winner = winnerId === match.player1?.id;
  const isPlayer2Winner = winnerId === match.player2?.id;

  const player1Scores = parseScore(match.score, 1, winnerId, match.player1?.id, match.player2?.id);
  const player2Scores = parseScore(match.score, 2, winnerId, match.player1?.id, match.player2?.id);
  const isPlayer1CurrentUser = user?.id && match.player1?.id === user.id;
  const isPlayer2CurrentUser = user?.id && match.player2?.id === user.id;
  const isCurrentUserInMatch = isPlayer1CurrentUser || isPlayer2CurrentUser;
  // console.log("isCurrentUserInMatch:", isCurrentUserInMatch);
  // console.log("isself:", isSelfReported);
  const canReportScore = !match.score && ( isAdmin || (isSelfReported && isCurrentUserInMatch));
  const areBothPlayersPresent = match.player1 && match.player2;
  const canComment = !!match.score;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReportScore = () => {
    if (onReportScore) {
      onReportScore(match);
    }
    handleMenuClose();
  };

  const handleAddComment = () => {
    if (onAddComment) {
      onAddComment(match);
    }
    handleMenuClose();
  };

  const shouldShowMenu = areBothPlayersPresent && (canReportScore || canComment);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: `${matchHeight}px`,
        position: 'relative',
        minWidth: 180,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      {/* Three-dot menu positioned above the match */}
      {shouldShowMenu && (
        <IconButton
          size="small"
          onClick={handleMenuOpen}
          sx={{
            position: 'absolute',
            top: -12,
            right: 8,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '50%',
            width: 24,
            height: 24,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            zIndex: 1,
          }}
        >
          <BsThreeDotsVertical size={10} />
        </IconButton>
      )}

      {/* Player 1 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'center',
          height: `${matchHeight / 2}px`,
          px: 2,
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
          gap: 1,
        }}
      >
        <Box
          sx={{
            fontWeight: isPlayer1Winner ? 700 : 400,
            color: isPlayer1Winner ? 'primary.main' : 'text.primary',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            minWidth: 0, // Allow flex item to shrink below content size
            overflow: 'hidden',
          }}
        >
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "left", 
            gap: 1,
            minWidth: 0, // Allow flex item to shrink
            overflow: 'hidden',
            width: '100%',
          }}>
            {match.player1 && (
              <ProfileImage 
                player={match.player1} 
                asLink={true} 
                showName={true} 
                size={30}
                sx={{
                  '& .MuiTypography-root': {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }
                }}
              />
            )}
            {match.seed1 && (
              <Typography
                variant="caption"
                sx={{
                  whiteSpace: 'nowrap',
                  flexShrink: 0, // Prevent seed from being cut off
                }}
              >
                ({match.seed1})
              </Typography>
            )}
          </Box>
        </Box>

        {/* Player 1 Score Grid */}
        {player1Scores.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${player1Scores.length}, 20px)`,
              gap: '4px',
              justifyItems: 'center',
              flexShrink: 0, // Prevent score grid from shrinking
            }}
          >
            {player1Scores.map((score, index) => (
              <Typography
                key={index}
                variant="caption"
                sx={{
                  fontWeight: shouldHighlightScore(match.score, index, isPlayer1Winner) ? 700 : 400,
                  fontSize: '0.75rem',
                  minWidth: '16px',
                  textAlign: 'center',
                }}
              >
                {score}
              </Typography>
            ))}
          </Box>
        )}
      </Box>

      {/* Player 2 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'center',
          height: `${matchHeight / 2}px`,
          px: 2,
          gap: 1,
        }}
      >
        <Box
          sx={{
            fontWeight: isPlayer2Winner ? 700 : 400,
            color: isPlayer2Winner ? 'primary.main' : 'text.primary',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            minWidth: 0, // Allow flex item to shrink below content size
            overflow: 'hidden',
          }}
        >
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "left", 
            gap: 1,
            minWidth: 0, // Allow flex item to shrink
            overflow: 'hidden',
            width: '100%',
          }}>
            {match.player2 && (
              <ProfileImage 
                player={match.player2} 
                asLink={true} 
                showName={true} 
                size={30}
                sx={{
                  '& .MuiTypography-root': {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }
                }}
              />
            )}
            {match.seed2 && (
              <Typography
                variant="caption"
                sx={{
                  whiteSpace: 'nowrap',
                  flexShrink: 0, // Prevent seed from being cut off
                }}
              >
                ({match.seed2})
              </Typography>
            )}
          </Box>
        </Box>

        {/* Player 2 Score Grid */}
        {player2Scores.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${player2Scores.length}, 20px)`,
              gap: '4px',
              justifyItems: 'center',
              flexShrink: 0, // Prevent score grid from shrinking
            }}
          >
            {player2Scores.map((score, index) => (
              <Typography
                key={index}
                variant="caption"
                sx={{
                  fontWeight: shouldHighlightScore(match.score, index, isPlayer2Winner) ? 700 : 400,
                  fontSize: '0.75rem',
                  minWidth: '16px',
                  textAlign: 'center',
                }}
              >
                {score}
              </Typography>
            ))}
          </Box>
        )}
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {canReportScore && (
          <MenuItem onClick={handleReportScore}>
            Report Score
          </MenuItem>
        )}
        {canComment && (
          <MenuItem onClick={handleAddComment}>
            Comment
          </MenuItem>
        )}
      </Menu>

      {/* Horizontal connector line from center of match */}
      {showConnector && (
        <Box
          sx={{
            position: 'absolute',
            right: -45,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '45px',
            height: '2px',
            backgroundColor: 'divider',
          }}
        />
      )}
    </Box>
  );
};

export default BracketMatch;