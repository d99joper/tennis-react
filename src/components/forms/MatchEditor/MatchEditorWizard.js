import React from 'react';
import Wizard from '../Wizard/Wizard';
import ScoreReportingStep from './scoreReporting';
import { Box, Card, FormControl, FormControlLabel, Radio, RadioGroup, Switch, Table, TableBody, TableCell, TableRow, TextField, Typography } from '@mui/material';
import InfoPopup from '../infoPopup';
import FriendlyMatchPlayers from './friendlyMatchPlayers';
import CourtSearchAutocomplete from '../Courts/searchCourt';
import { helpers } from 'helpers';

const MatchEditorWizard = ({ matchLogic, onSubmit }) => {
  console.log(matchLogic.selectedOpponents)
  const steps = [
    !matchLogic.selectedEvent &&
    {
      label: 'Event Selection',
      content: (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6">Friendly match</Typography>
          <InfoPopup>
            If you want to post a match result from a league or tournament, please do so on the respective event's site. <br />
            Only friendly matches can be posted from your profile page.
          </InfoPopup>
        </Box>
      ),
      handleNext: () => !!matchLogic.selectedEvent || matchLogic.availableEvents.length === 0,
    },
    {
      label: 'Match Details',
      content: (
        <Box display={'flex'} flexDirection={'column'} gap={2}>
          {/* <Typography variant="h6">Match Details</Typography> */}
          {matchLogic.selectedEvent
            ? ''
            : <FriendlyMatchPlayers matchLogic={matchLogic} />
          }
          <TextField
            type="date"
            label="Played On"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            required
            error={matchLogic.error.playedOn}
            helperText={matchLogic.error.playedOn ? 'Date is required' : ''}
            value={matchLogic.playedOn}
            onChange={(e) => matchLogic.setPlayedOn(e.target.value)}
          />

          <CourtSearchAutocomplete
            selectedCourt={matchLogic.selectedCourt}
            setSelectedCourt={matchLogic.setSelectedCourt}
          />
        </Box>
      ),
      handleNext: () => {
        const playedOnError = !matchLogic.playedOn;
        const opponentsError = matchLogic.selectedOpponents.length === 0;
        const winnersError = matchLogic.selectedWinners.length === 0;
        matchLogic.setError({ playedOn: playedOnError, opponents: opponentsError, winners: winnersError });
        return !playedOnError && !opponentsError && !winnersError;
      },
    },
    {
      label: 'Who won?',
      content: (
        <FormControl>
          <RadioGroup
            name="radio-buttons-group"
            value={matchLogic.winner.toString()} // Must be string
            onChange={(e) => matchLogic.setWinner(e.target.value === 'true')}
          >
            <FormControlLabel value="true" control={<Radio />} label={matchLogic.getPlayers(matchLogic.selectedWinners)} />
            <FormControlLabel value="false" control={<Radio />} label={matchLogic.getPlayers(matchLogic.selectedOpponents)} />
          </RadioGroup>

        </FormControl>
      ),
      handleNext: () => { return helpers.hasValue(matchLogic.winner) }
    },
    {
      label: 'Score Reporting',
      content: (
        <ScoreReportingStep matchLogic={matchLogic} />
      ),
      handleNext: () => matchLogic.retired || matchLogic.validateSets(),
    },
    {
      label: 'Comments',
      content: (
        <Box>
          <Typography variant="h6">Add Comment</Typography>
          <TextField
            label="Comment"
            fullWidth
            multiline
            rows={3}
            value={matchLogic.comment}
            onChange={(e) => matchLogic.setComment(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={matchLogic.isPrivate}
                onChange={() => matchLogic.setIsPrivate(!matchLogic.isPrivate)}
              />
            }
            label="Private Note"
            sx={{ mb: 2 }}
          />
          <InfoPopup>
            A private note is only visible to you, while a public comment is shared with others.
          </InfoPopup>
        </Box>
      ),
      handleNext: () => true,
    },
    {
      label: 'Confirm and Submit',
      content: (
        <Card sx={{ bgcolor: 'white', p: 2, }}>
          <Typography variant="h6">Review Match</Typography>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Date:</TableCell>
                <TableCell>{matchLogic.playedOn}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Winner:</TableCell>
                <TableCell>{matchLogic.winner ? matchLogic.getPlayers(matchLogic.selectedWinners) : matchLogic.getPlayers(matchLogic.selectedOpponents)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Opponent:</TableCell>
                <TableCell>{!matchLogic.winner ? matchLogic.getPlayers(matchLogic.selectedWinners) : matchLogic.getPlayers(matchLogic.selectedOpponents)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Court:</TableCell>
                <TableCell>{matchLogic.getCourt()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Score:</TableCell>
                <TableCell>{matchLogic.getScore()}</TableCell>
              </TableRow>
              {matchLogic.comment &&
                <TableRow>
                  <TableCell>
                    Comment: <br />
                    ({matchLogic.isPrivate ? 'Private' : 'Public'})
                  </TableCell>
                  <TableCell><i>{matchLogic.comment}</i></TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </Card>
      ),
      handleNext: async () => {
        const matchData = {
          event: matchLogic.selectedEvent?.id || null,
          played_on: matchLogic.playedOn,
          losers: matchLogic.winner ? matchLogic.selectedOpponents : matchLogic.selectedWinners,
          winners: matchLogic.winner ? matchLogic.selectedWinners : matchLogic.selectedOpponents,
          court: matchLogic.getCourt(),
          score: matchLogic.getScore(),
          comment: matchLogic.comment,
          is_private: matchLogic.isPrivate,
        };
        try {
          await onSubmit(matchData); // Perform async action
          return true; // Proceed to next step
        } catch (error) {
          console.error("Error submitting match data:", error);
          return false; //  Prevent moving to the next step if an error occurs
        }
      },
    },
  ].filter(Boolean); // Removes null if event is not selected

  return <Wizard steps={steps} submitText="Submit Match" handleSubmit={matchLogic.onSubmitMatch} />;
};

export default MatchEditorWizard;
