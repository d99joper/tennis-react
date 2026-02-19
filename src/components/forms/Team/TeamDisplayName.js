import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Tooltip, Chip } from '@mui/material';
import { ProfileImage } from '../ProfileImage';
import InfoPopup from '../infoPopup';
import { useTheme } from '@mui/material/styles';
import { flexRow } from 'styles/componentStyles';

/**
 * TeamDisplayName component for displaying teams (doubles pairs or multi-player teams)
 * 
 * @param {Object} team - The participant object containing team/pair info
 * @param {number} size - Size for profile images (default 32)
 * @param {boolean} asLink - Whether names should be clickable links (default true)
 * @param {boolean} showInitials - Show names as "F. LastName" format (default false)
 */
const TeamDisplayName = ({ 
  team, 
  size = 32, 
  asLink = true, 
  showInitials = false 
}) => {
  const theme = useTheme();
  const [showPlayerList, setShowPlayerList] = useState(false);

  // Helper to parse name into first and last
  const parseName = (fullName) => {
    if (!fullName) return { first: '', last: '' };
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return { first: parts[0], last: '' };
    const last = parts[parts.length - 1];
    const first = parts.slice(0, -1).join(' ');
    return { first, last };
  };

  // Helper to format name based on showInitials prop
  const formatName = (fullName) => {
    if (!showInitials) return fullName;
    const { first, last } = parseName(fullName);
    if (!first) return last;
    return `${first.charAt(0)}. ${last}`;
  };

  // Render a player name with optional link and hover tooltip
  const renderPlayerName = (player) => {
    const displayName = formatName(player.name);
    
    const nameElement = asLink ? (
      <Link 
        to={`/players/${player.slug}`}
        style={{ 
          textDecoration: 'none', 
          color: theme.palette.primary.main,
          fontWeight: 500,
          '&:hover': {
            textDecoration: 'underline'
          }
        }}
      >
        {displayName}
      </Link>
    ) : (
      <Typography component="span" sx={{ fontWeight: 500, color: 'text.primary' }}>
        {displayName}
      </Typography>
    );

    return (
      <Tooltip
        key={player.id}
        title={
          <Box sx={{ p: 0.5 }}>
            <ProfileImage player={player} size={48} showName={false} />
          </Box>
        }
        arrow
        placement="top"
      >
        <span>{nameElement}</span>
      </Tooltip>
    );
  };

  // Handle doubles team (playerpair)
  if (team.content_type === 'playerpair' && team.players && team.players.length >= 2) {
    return (
      <Box sx={{ ...flexRow, gap: 0.5, alignItems: 'center' }}>
        {renderPlayerName(team.players[0])}
        <Typography component="span" sx={{ color: 'text.secondary', mx: 0.5 }}>
          /
        </Typography>
        {renderPlayerName(team.players[1])}
      </Box>
    );
  }

  // Handle regular team
  if (team.content_type === 'team') {
    const playerCount = team.players?.length || 0;
    
    return (
      <Box sx={{ ...flexRow, gap: 1, alignItems: 'center' }}>
        {asLink ? (
          <Link
            to={`/team/${team.object_id}`}
            style={{
              textDecoration: 'none',
              color: theme.palette.primary.main,
              fontWeight: 500
            }}
          >
            {team.name}
          </Link>
        ) : (
          <Typography sx={{ fontWeight: 500, color: 'text.primary' }}>
            {team.name}
          </Typography>
        )}
        
        {playerCount > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              label={`${playerCount} player${playerCount !== 1 ? 's' : ''}`}
              size="small"
              onClick={() => setShowPlayerList(!showPlayerList)}
              sx={{
                height: 20,
                fontSize: '0.7rem',
                cursor: 'pointer',
                backgroundColor: theme.palette.grey[200],
                '&:hover': {
                  backgroundColor: theme.palette.grey[300]
                }
              }}
            />
            
            <InfoPopup 
              open={showPlayerList} 
              onClose={() => setShowPlayerList(false)}
              size={18}
            >
              <Box sx={{ p: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Team Members
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {team.players.map((player) => (
                    <ProfileImage
                      key={player.id}
                      player={player}
                      size={size}
                      showName={true}
                      asLink={true}
                    />
                  ))}
                </Box>
              </Box>
            </InfoPopup>
          </Box>
        )}
      </Box>
    );
  }

  // Fallback for single player or unknown type
  if (team.players && team.players.length === 1) {
    return (
      <ProfileImage
        player={team.players[0]}
        size={size}
        showName={true}
        asLink={asLink}
      />
    );
  }

  // Last resort fallback
  return (
    <Typography sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
      Unknown team type
    </Typography>
  );
};

export default TeamDisplayName;
