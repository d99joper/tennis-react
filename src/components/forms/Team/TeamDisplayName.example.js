import React from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';
import TeamDisplayName from './TeamDisplayName';

/**
 * Example/Demo component showing TeamDisplayName usage with mock data
 */
const TeamDisplayNameExample = () => {
  // Mock doubles team (playerpair)
  const doublesTeam = {
    id: 'participant-1',
    content_type: 'playerpair',
    object_id: 'pair-123',
    name: null,
    players: [
      {
        id: 'player-1',
        name: 'John Smith',
        slug: 'john-smith',
        first_name: 'John',
        last_name: 'Smith',
        image_urls: {
          thumbnail: 'https://via.placeholder.com/150'
        }
      },
      {
        id: 'player-2',
        name: 'Jane Doe',
        slug: 'jane-doe',
        first_name: 'Jane',
        last_name: 'Doe',
        image_urls: {
          thumbnail: 'https://via.placeholder.com/150'
        }
      }
    ],
    divisions: []
  };

  // Mock regular team
  const regularTeam = {
    id: 'participant-2',
    content_type: 'team',
    object_id: 'team-456',
    name: 'Thunder Strikers',
    players: [
      {
        id: 'player-3',
        name: 'Mike Johnson',
        slug: 'mike-johnson',
        first_name: 'Mike',
        last_name: 'Johnson',
        image_urls: {
          thumbnail: 'https://via.placeholder.com/150'
        }
      },
      {
        id: 'player-4',
        name: 'Sarah Williams',
        slug: 'sarah-williams',
        first_name: 'Sarah',
        last_name: 'Williams',
        image_urls: {
          thumbnail: 'https://via.placeholder.com/150'
        }
      },
      {
        id: 'player-5',
        name: 'David Brown',
        slug: 'david-brown',
        first_name: 'David',
        last_name: 'Brown',
        image_urls: {
          thumbnail: 'https://via.placeholder.com/150'
        }
      },
      {
        id: 'player-6',
        name: 'Emily Davis',
        slug: 'emily-davis',
        first_name: 'Emily',
        last_name: 'Davis',
        image_urls: {
          thumbnail: 'https://via.placeholder.com/150'
        }
      }
    ],
    divisions: []
  };

  // Mock single player participant (fallback case)
  const singlePlayer = {
    id: 'participant-3',
    content_type: 'player',
    object_id: 'player-7',
    name: null,
    players: [
      {
        id: 'player-7',
        name: 'Alex Martinez',
        slug: 'alex-martinez',
        first_name: 'Alex',
        last_name: 'Martinez',
        image_urls: {
          thumbnail: 'https://via.placeholder.com/150'
        }
      }
    ],
    divisions: []
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        TeamDisplayName Component Examples
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Doubles Team (playerpair)
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Default (full names):
          </Typography>
          <TeamDisplayName team={doublesTeam} size={32} asLink={true} />
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            With initials (F. LastName):
          </Typography>
          <TeamDisplayName team={doublesTeam} size={32} asLink={true} showInitials={true} />
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Without links:
          </Typography>
          <TeamDisplayName team={doublesTeam} size={32} asLink={false} />
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Regular Team (team)
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            With player count chip (click to see players):
          </Typography>
          <TeamDisplayName team={regularTeam} size={32} asLink={true} />
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Without links:
          </Typography>
          <TeamDisplayName team={regularTeam} size={32} asLink={false} />
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Single Player (fallback)
        </Typography>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Falls back to ProfileImage:
          </Typography>
          <TeamDisplayName team={singlePlayer} size={32} asLink={true} />
        </Box>
      </Paper>

      <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Mock Data Structure
        </Typography>
        <Typography variant="body2" component="pre" sx={{ 
          fontSize: '0.75rem', 
          overflow: 'auto',
          backgroundColor: 'grey.900',
          color: 'grey.50',
          p: 2,
          borderRadius: 1
        }}>
{`// Doubles Team
${JSON.stringify(doublesTeam, null, 2)}

// Regular Team
${JSON.stringify(regularTeam, null, 2)}`}
        </Typography>
      </Paper>
    </Box>
  );
};

export default TeamDisplayNameExample;
