import React from 'react';
import Wizard from '../Wizard/Wizard';
import ScoreReportingStep from './scoreReporting';
import EventSelectionStep from './eventSelection';
import { Box, FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import InfoPopup from '../infoPopup';

const MatchEditorWizard = ({ matchLogic }) => {
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
      label: 'Score Reporting',
      content: <ScoreReportingStep {...matchLogic} />,
      handleNext: () => matchLogic.validateSets(),
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
        <Box>
          <Typography variant="h6">Review Match</Typography>
          <Typography>Date: {matchLogic.playedOn}</Typography>
          <Typography>Winner: {matchLogic.getPlayers(matchLogic.selectedWinners)}</Typography>
          <Typography>Opponent: {matchLogic.getPlayers(matchLogic.selectedOpponents)}</Typography>
          <Typography>Court: {matchLogic.getCourt()}</Typography>
          <Typography>Score: {matchLogic.getScore()}</Typography>
          {matchLogic.comment && <>
						<Typography>Comment: <i>{matchLogic.comment}</i></Typography>
						<Typography>Note Type: {matchLogic.isPrivate ? 'Private' : 'Public'}</Typography>
					</>
					}
          <button onClick={matchLogic.onSubmitMatch}>Submit</button>
        </Box>
      ),
    },
  ].filter(Boolean); // Removes null if event is not selected

  return <Wizard steps={steps} submitText="Submit Match" handleSubmit={matchLogic.onSubmitMatch} />;
};

export default MatchEditorWizard;
