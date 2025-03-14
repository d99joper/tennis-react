import React, { useState, useEffect, useRef, useContext } from 'react';
import { TextField, Box, Typography, IconButton, Switch, FormControlLabel, CircularProgress, Autocomplete, Divider } from '@mui/material';
import Wizard from '../Wizard/Wizard';
import { matchAPI } from 'api/services';
import SetInput from './SetInput';
import InfoPopup from '../infoPopup';
import { debounce } from 'lodash';
import { ProfileImage } from '../ProfileImage';
import { AuthContext } from 'contexts/AuthContext';
import CourtSearchAutocomplete from '../Courts/searchCourt';
import PlayerSearch from '../Player/playerSearch';
import GetParticipants from '../Event/getParticipants';

const MatchEditor = ({
	participant,
	event = null,
	availableEvents = [],
	scheduleMatchId,
	limitedParticipants = [],
	date = '',
	matchType = 'singles',
	onSubmit
}) => {
	const [selectedEvent, setSelectedEvent] = useState(event || null);
	const [playedOn, setPlayedOn] = useState(date);
	const [selectedOpponents, setSelectedOpponents] = useState([limitedParticipants[1]] || []);
	const [selectedWinners, setSelectedWinners] = useState([limitedParticipants[0] ?? participant] || []);
	const [winnerParticipant, setWinnerParticipant] = useState(null);
	const [opponentParticipant, setOpponentParticipant] = useState(null);
	const [selectedCourt, setSelectedCourt] = useState('');
	const [sets, setSets] = useState([{ set: 1, value: '' }, { set: 2, value: '' }]);
	const [isDoubles, setIsDoubles] = useState(matchType === 'doubles');
	const [error, setError] = useState({ playedOn: false, opponents: false });
	const [winner, setWinner] = useState(true);
	const [setErrorText, setSetErrorText] = useState('');
	const [comment, setComment] = useState('');
	const [isPrivate, setIsPrivate] = useState(false);
	const [retired, setRetired] = useState(false);
	const { user } = useContext(AuthContext)

	// Fetch opponents only once for events
	useEffect(() => {
		if(selectedEvent)
			setIsDoubles(selectedEvent?.match_type === 'doubles')
	}, [selectedEvent]);

	const onSubmitMatch = async () => {
		// Create an object with the match result data

		let match = {
			winners: (winner ? selectedWinners : selectedOpponents).map(p => p.id), // Convert Player objects to IDs
			losers: (winner ? selectedOpponents : selectedWinners).map(p => p.id),
			score: sets.filter(set => set.value).map(set => set.value).join(', '),
			type: isDoubles ? 'doubles' : 'singles', // should be singles or doubles,
			court_id: selectedCourt?.id || null,
			played_on: new Date(playedOn).toISOString().split('T')[0],
			...selectedEvent ? { event_id: selectedEvent.id } : null,
			retired: retired,
			schedule_match_id: scheduleMatchId,
			comments: []
		}

		if (comment.length > 0) {
			const matchComment = {
				content: comment,
				posted_by: user.id,
				private: isPrivate,
				posted_on: Date.now
			}
			match.comments.push(matchComment)
		}

		const newMatch = await matchAPI.createMatch(match);
		if(onSubmit)
				onSubmit(newMatch)
	};

	const handleSetChange = (index, value) => {
		const updatedSets = [...sets];
		updatedSets[index].value = value;
		setSets(updatedSets);
	};

	const addSet = () => {
		if (sets.length < 5) {
			setSets([...sets, { set: sets.length + 1, value: '' }]);
		}
	};

	const validateSets = () => {
		if (retired) return true;

		let winCount = 0;
		let loseCount = 0;
		let isValid = true;

		sets.forEach(set => {
			if (set.value) {
				const tiebreakMatch = set.value.match(/^\d+-\d+\(\d+\)$/);
				const [first, second] = tiebreakMatch
					? set.value.split(/[\-\(\)]/).slice(0, 2).map(Number)
					: set.value.split('-').map(Number);

				if (first === second || isNaN(first) || isNaN(second)) {
					isValid = false;
				} else if (first > second) {
					winCount++;
				} else {
					loseCount++;
				}
			}
		});

		if (!isValid || winCount <= loseCount) {
			setSetErrorText('This is not a valid score. Ensure the winner has more sets won.');
			return false;
		}

		setSetErrorText('');
		return true;
	};

	const getPlayers = (playerList) => {
		const names = playerList.map((p) => p?.name)
			.filter(Boolean) // Remove any null values if an ID doesn't match
			.join(", ");
		return names;
	}

	const getScore = () => { return sets.filter(set => set.value).map(set => set.value).join(', ') }

	const steps = [
		!event &&
		{
			label: 'Event Selection',
			content: (
				<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
					<Typography variant="h6">Friendly match</Typography>
					<InfoPopup>
						If you want to post a match result from a league or tournament, please do so on the respective event's site. <br />
						Only friendly matches can be posted from your profile page.
					</InfoPopup>
					{/* <Typography variant="h6">Select Event</Typography>
					<TextField
						select
						label="Event"
						fullWidth
						value={selectedEvent?.id || 'none'}
						onChange={(e) => {
							const eventId = e.target.value;
							const selected = eventId === 'none' ? null : availableEvents.find(ev => ev.id === eventId);
							setSelectedEvent(selected);
						}}
						sx={{ mb: 2 }}
					>
						<MenuItem value="none">None (Friendly Match)</MenuItem>
						{availableEvents.map((ev) => (
							<MenuItem key={ev.id} value={ev.id}>{ev.name}</MenuItem>
						))}
					</TextField> */}
				</Box>
			),
			handleNext: () => !!selectedEvent || availableEvents.length === 0,
		},
		{
			label: 'Match Details',
			content: (
				<Box display={'flex'} flexDirection={'column'} gap={2}>
					<Typography variant="h6">Match Details</Typography>

					{selectedEvent ?
						limitedParticipants.length > 0 ?
							<Typography variant='body1'>
								{limitedParticipants[0]?.name} vs {limitedParticipants[1]?.name}
							</Typography>
							: <>
								<GetParticipants
									eventId={event.id}
									selectedParticipant={winnerParticipant}
									setSelectedParticipant={setWinnerParticipant}
									setParticipantPlayers={setSelectedWinners}
									excludeParticipants={[opponentParticipant]}
									label="Winners"
									required
									error={error.winners}
								/>
								<GetParticipants
									eventId={event.id}
									selectedParticipant={opponentParticipant}
									setSelectedParticipant={setOpponentParticipant}
									setParticipantPlayers={setSelectedOpponents}
									excludeParticipants={[winnerParticipant]}
									label="Opponents"
									required
									error={error.opponents}
								/>
							</>
						: // no event set (friendly match)
						<>
							<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
								<ProfileImage player={selectedWinners[0]} /> {selectedWinners[0].name}
							</Box>
							{isDoubles &&
								<Box>
									<PlayerSearch
										selectedPlayer={selectedWinners[1]}
										setSelectedPlayer={(p) => setSelectedWinners([selectedWinners[0], p].filter(Boolean))}
										excludePlayers={[...selectedWinners, ...selectedOpponents].filter(p => p !== selectedWinners[1])}
										label="Winner partner"
										required
										allowCreate={true}
										error={error.winners}
										errorMessage={error.winners ? 'Partner is required in doubles' : ''}
									/>
									<Divider sx={{ pt: 2 }} >Opponents</Divider>
								</Box>
							}

							<PlayerSearch
								selectedPlayer={selectedOpponents[0]}
								setSelectedPlayer={(p) => setSelectedOpponents([p, selectedOpponents[1]].filter(Boolean))}
								excludePlayers={[...selectedWinners, ...selectedOpponents].filter(p => p !== selectedOpponents[0])}
								label="Opponent"
								required
								allowCreate={true}
								error={error.opponents}
								errorMessage={error.opponents ? 'Opponent is required' : ''}
							/>
							{isDoubles &&
								<PlayerSearch
									selectedPlayer={selectedOpponents[1]}
									setSelectedPlayer={(p) => setSelectedOpponents([selectedOpponents[0], p].filter(Boolean))}
									excludePlayers={[...selectedWinners, ...selectedOpponents].filter(p => p !== selectedOpponents[1])}
									label="Opponent partner"
									required
									allowCreate={true}
									error={error.opponents}
									errorMessage={error.winners ? 'Partner is required in doubles' : ''}
								/>
							}
						</>
					}

					<TextField
						type="date"
						label="Played On"
						fullWidth
						slotProps={{ inputLabel: { shrink: true } }}
						required
						error={error.playedOn}
						helperText={error.playedOn ? 'Date is required' : ''}
						value={playedOn}
						onChange={(e) => setPlayedOn(e.target.value)}
					/>

					<CourtSearchAutocomplete selectedCourt={selectedCourt} setSelectedCourt={setSelectedCourt} />

				</Box>
			),
			handleNext: () => {
				const playedOnError = !playedOn;
				const opponentsError = selectedOpponents.length === 0;
				const winnersError = selectedWinners.length === 0;
				setError({ playedOn: playedOnError, opponents: opponentsError, winners: winnersError });
				return !playedOnError && !opponentsError && !winnersError;
			},
		},
		{
			label: 'Score Reporting',
			content: (
				<Box>
					<Typography variant="h6">Report Score</Typography>
					{/* {(!selectedWinners || limitedParticipants.length > 0) && */}
					<FormControlLabel
						control={
							<Switch
								checked={winner}
								onChange={() => setWinner(!winner)}
							/>
						}
						label={(winner ? getPlayers(selectedWinners) : getPlayers(selectedOpponents)) + ' Won'}
						sx={{ mb: 2 }}
					/>
					{/* } */}
					<FormControlLabel
						control={
							<Switch
								checked={retired}
								onChange={() => setRetired(!retired)}
							/>
						}
						label='Retired'
						sx={{ mb: 2 }}
					/>
					<Typography variant="body1" sx={{ mb: 2 }}>
						{retired ? (
							winner
								? `${getPlayers(selectedWinners) ?? participant.name} won by default.`
								: `${getPlayers(selectedOpponents)} won by default.`
						) : (
							winner
								? `${getPlayers(selectedWinners) ?? participant.name} defeated ${getPlayers(selectedOpponents)}: 
										${getScore()}`
								: `${getPlayers(selectedOpponents)} defeated ${getPlayers(selectedWinners) ?? participant.name}: 
										${getScore()}`
						)}
					</Typography>
					{!retired && (
						<>
							{sets.map((set, index) => (
								<SetInput
									key={index}
									value={set.value}
									label={`Set ${set.set}`}
									onChange={(newVal) => handleSetChange(index, newVal)}
									sx={{ mb: 1, width: '7ch', mr: 0.3 }}
								/>
							))}
							{sets.length < 5 && (
								<IconButton onClick={addSet} color="primary" sx={{ mb: 2 }}>
									+ Add Set
								</IconButton>
							)}
							{setErrorText && (
								<Typography color="error" variant="body2">{setErrorText}</Typography>
							)}
						</>
					)}
				</Box>
			),
			handleNext: () => validateSets(),
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
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						sx={{ mb: 2 }}
					/>
					<FormControlLabel
						control={
							<Switch
								checked={isPrivate}
								onChange={() => setIsPrivate(!isPrivate)}
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
					<Typography variant="h6">Review Match Details</Typography>
					<Typography>Date: {playedOn}</Typography>
					<Typography>
						{winner ? 'Winner' : 'Opponent'}: &nbsp;
						{getPlayers(selectedWinners)}
					</Typography>
					<Typography>
						{!winner ? 'Winner' : 'Opponent'}: &nbsp;
						{getPlayers(selectedOpponents)}
					</Typography>
					<Typography>Court: {selectedCourt?.name}</Typography>
					<Typography>Score: {retired ? 'Default' : sets.filter(set => set.value).map(set => set.value).join(', ')}</Typography>
					{comment && <>
						<Typography>Comment: <i>{comment}</i></Typography>
						<Typography>Note Type: {isPrivate ? 'Private' : 'Public'}</Typography>
					</>
					}
				</Box>
			),
			handleNext: async () => {
				const matchData = {
					event: selectedEvent?.id || null,
					played_on: playedOn,
					losers: selectedOpponents,
					winners: selectedWinners,
					court: selectedCourt,
					score: sets.filter(set => set.value).map(set => set.value).join(', '),
					comment,
					is_private: isPrivate,
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
	].filter(Boolean);

	return <Wizard steps={steps} submitText="Submit Match" handleSubmit={onSubmitMatch} />;
};

export default MatchEditor;
