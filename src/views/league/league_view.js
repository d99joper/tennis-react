import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  Grid2,
  Button,
  ListItem,
  List,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import MyModal from 'components/layout/MyModal';
import { MatchEditor, ProfileImage } from 'components/forms';
import LeagueScheduler from '../../components/forms/League/leagueScheduler';
import { authAPI, eventAPI } from 'api/services';
import AddParticipants from 'components/forms/League/addParticipants';
import ScheduleView from './schedule_view';
import { GiPencil } from 'react-icons/gi';
import LeagueAdminTools from 'components/forms/League/adminTools';
import Wizard from 'components/forms/Wizard/Wizard';
import usePaginatedParticipants from 'helpers/usePaginatedParticipants';
import { MdClose } from 'react-icons/md';

const LeagueViewPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentTab, setCurrentTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [event, setEvent] = useState(null);
  const [standings, setStandings] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [matches, setMatches] = useState([]);
  const [editSchedule, setEditSchedule] = useState(false);
  const currentUser = authAPI.getCurrentUser()
  const [showAddMatch, setShowAddMatch] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { participants, loadMore, loading, hasMore } = usePaginatedParticipants(id);

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        const event = await eventAPI.getEvent(id);
        console.log('event', event)
        if (event && !event.statusCode) {
          setEvent(event);
          setStandings(event.league_standings || []);
          setSchedule(event.league_schedule || []);
          setMatches(event.matches || []);
        } else {
          console.error(event.statusMessage);
        }
      } catch (error) {
        console.error('Failed to fetch league:', error);
      }
    };

    fetchLeague();

  }, [id]);


  const handleMatchSubmit = () => {
    setShowAddMatch(false);
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handlePlayerClick = (participant) => {
    setSelectedParticipant(participant);
    console.log(participant)
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedParticipant(null);
  };

  const addParticipants = () => {
    const leagueToUpdate = {
      id: event.id,
      participants_data: [
        { id: 'e3335b3d-a6e9-4f7d-aca3-0aa62b3414cc' },
        { id: '000ef295-2298-4b1a-8ea2-15c4563971d3' },
        { id: "00121742-17a8-4183-92e2-9c1697042696" },
        { id: "001e8f31-42a8-4d53-ad03-bb55ed9db669" },
        { id: "004f9bdd-cf06-495a-a862-b6523c4c9658" },
        { id: "00504ee0-f6fa-49f2-b1e1-b7a56b701ab0" },
        { id: "0069542e-d7ca-43e8-9bb2-a2564a7fd068" },
      ],
      admins_data: [{ id: 'a0ee264b-9486-49dc-908a-ee9b7d0485aa' }]
    }
    console.log(leagueToUpdate)
    eventAPI.updateEvent(leagueToUpdate);
  }

  if (!event) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Box sx={{ mt: 4, px: isMobile ? 2 : 4 }}>
      <Typography variant="h4" gutterBottom>
        {event.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {event.description}
        <Button onClick={() => { addParticipants() }}>Add participants and admins</Button>
      </Typography>

      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant={isMobile ? 'scrollable' : 'fullWidth'}
      >
        <Tab label="Standings" />
        <Tab label="Schedule" />
        <Tab label="Matches" />
        <Tab label="Participants" />
        {event.is_admin && <Tab label="Admin Tools" />} {/* Admin-only tab */}
      </Tabs>

      {/** STANDINGS TAB */}
      {currentTab === 0 && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            Standings
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Player</TableCell>
                  <TableCell>Wins</TableCell>
                  <TableCell>Losses</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {standings.map((participant, index) => (
                  <TableRow
                    key={participant.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {event.type === 'singles' ?
                          <ProfileImage player={participant.players[0]} size={40} />
                          : ''
                        }
                        <Typography
                          variant="body1"
                          color="primary"
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handlePlayerClick(participant)}
                        >
                          {participant.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{participant.wins}</TableCell>
                    <TableCell>{participant.losses}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      {/** SCHEDULE TAB */}
      {currentTab === 1 && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            Schedule &nbsp;&nbsp;
            {event.is_admin &&
              editSchedule 
                ? <MdClose className='pointer' onClick={() => setEditSchedule(false)} />
                : <GiPencil className='pointer' onClick={() => setEditSchedule(true)} />
            }
          </Typography>

          {editSchedule
            ? <LeagueScheduler
              event={event}
              schedule={schedule}
              // setEvent={setEvent}
              // setSchedule={setSchedule}
              // setMatches={setMatches}
              onSave={(newSchedule, keepOpen=true) => {
                setSchedule(newSchedule)
                //setEditSchedule(keepOpen)
                setEvent((prev) => ({ ...prev, league_schedule: newSchedule}));
              }}
            />
            : <ScheduleView schedule={schedule} />
          }

        </Box>
      )}

      {/** MATCHES TAB */}
      {currentTab === 2 && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            Matches
          </Typography>

          {/* Add Match Button */}
          {event?.is_participant && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowAddMatch(true)} // Show wizard editor
                sx={{ mb: 2 }}
              >
                Add Match
              </Button>
            )}

          {/* Table to Display Matches */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Match</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {matches.map((match, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {match.player1.name} vs {match.player2.name}
                    </TableCell>
                    <TableCell>{match.score || 'N/A'}</TableCell>
                    <TableCell>{match.date || 'Not scheduled'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add Match Wizard */}
          {showAddMatch && (
            <MatchEditor
              participants={event.participants}
              onSubmit={handleMatchSubmit}
              leagueId={event.id}
            />
          )}
        </Box>
      )}
      {currentTab === 3 && (
        <Box>
          <List>
            {participants.map((participant) => (
              <ListItem key={participant.id}>
                {participant.players.map((p) => (
                  p.name
                ))}
              </ListItem>
            ))}
          </List>
          {hasMore && (
            <Button onClick={loadMore} disabled={loading}>
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          )}
        </Box>
      )}

      {/* Admin Tools Tab */}
      {currentTab === 4 && event.is_admin && (
        <Grid2 container direction={'column'}>
          {/* 1. invite players
          2. update restrictions
          3. update max participants
          4. update start and end dates
          5. update description
          6. send out league notifications */}
          <LeagueAdminTools league={event} participants={event.participants || []} setLeague={setEvent} />
          <AddParticipants league={event} />

        </Grid2>
      )}

      <MyModal
        showHide={modalOpen}
        onClose={handleModalClose}
        title="Details"
      >
        {selectedParticipant && (
          <Box display="flex" alignItems="center" gap={2}>
            {event.league_type === 'singles_old' ?
              <>
                <ProfileImage player={selectedParticipant.players[0]} size={60} />
                <Box>
                  <Typography variant="h6">{selectedParticipant.name}</Typography>
                  <Typography
                    as="p"
                    variant="body1"
                    color="primary"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/profile/${selectedParticipant.players[0].id}`)}
                  >
                    View Full Profile
                  </Typography>
                </Box>
              </>
              : event.league_type === 'doubles' || event.league_type === 'singles' ?
                <>
                  {selectedParticipant.players.map((player, i) =>
                    <React.Fragment key={player.id}>
                      <ProfileImage player={player} size={60} />
                      <Box>
                        <Typography variant="h6">{player.name}</Typography>
                        <Typography
                          as="p"
                          variant="body1"
                          color="primary"
                          sx={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/profile/${player.id}`)}
                        >
                          View Full Profile
                        </Typography>
                      </Box>
                    </React.Fragment>
                  )}
                </>
                : event.league_type === 'team' ?
                  <>
                    <Typography variant="h6">{selectedParticipant.name}</Typography>
                  </>
                  : ''
            }
          </Box>
        )}
        {selectedParticipant && (
          <Box mt={2}>
            <Typography variant="body2" gutterBottom>{selectedParticipant.matchResults}</Typography>

          </Box>
        )}
      </MyModal>
    </Box>
  );
};

export default LeagueViewPage;
