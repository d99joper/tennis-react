import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  useMediaQuery,
  Grid2,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import MyModal from 'components/layout/MyModal';
import { InfoPopup, MatchEditor, Matches, ProfileImage } from 'components/forms';
import LeagueScheduler from '../../components/forms/League/leagueScheduler';
import { authAPI, eventAPI } from 'api/services';
import AddParticipants from 'components/forms/League/addParticipants';
import ScheduleView from './schedule_view';
import { GiPencil } from 'react-icons/gi';
import LeagueAdminTools from 'components/forms/League/adminTools';
import { MdClose } from 'react-icons/md';
import StandingsView from './standings_view';

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
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

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


  const handleMatchEditorSubmit = (newMatch) => {
    console.log(newMatch);
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleMatchModalClose = () => {
    setMatchModalOpen(false);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedParticipant(null);
  };

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
        {/* <Button onClick={() => { addParticipants() }}>Add participants and admins</Button> */}
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
        {event.is_admin && <Tab label="Admin Tools" />} {/* Admin-only tab */}
      </Tabs>

      {/** STANDINGS TAB */}
      {currentTab === 0 && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            Standings
          </Typography>
          <StandingsView standings={standings} />
          {/* <TableContainer component={Paper}>
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
          </TableContainer> */}
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
              onSave={(newSchedule, keepOpen = true) => {
                setSchedule(newSchedule)
                //setEditSchedule(keepOpen)
                setEvent((prev) => ({ ...prev, league_schedule: newSchedule }));
              }}
            />
            : <ScheduleView event={event} schedule={schedule} onScoreReported={() => { console.log('someone reported a score') }} />
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
              onClick={() => setMatchModalOpen(true)} // Show wizard editor
              sx={{ mb: 2 }}
            >
              Add Match
            </Button>
          )}

          <Matches 
            originType={'event'}
            originId={event.id}
            initialMatches={event.matches}
            pageSize={10}
            showComments={true}
            showH2H={true}
          />
          

          {/* Add Match Wizard */}
          {/* Match Editor Modal */}
          <MyModal showHide={matchModalOpen} onClose={handleMatchModalClose} title="Report Match">
            <MatchEditor
              participant={currentUser}
              event={event}
              onSubmit={(matchData) => {
                console.log("Match reported:", matchData);
                handleMatchEditorSubmit(matchData);
                handleMatchModalClose();
              }}
            />
          </MyModal>
        </Box>
      )}

      {/* Admin Tools Tab */}
      {currentTab === 3 && event.is_admin && (
        <Grid2 container direction={'column'}>
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
