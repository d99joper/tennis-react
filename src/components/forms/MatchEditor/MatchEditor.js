import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Box, Typography, IconButton, Switch, FormControlLabel } from '@mui/material';
import Wizard from '../Wizard/Wizard';
import { playerAPI, courtAPI, matchAPI, authAPI } from 'api/services';
import SetInput from './SetInput';
import InfoPopup from '../infoPopup';
import { helpers } from 'helpers';

const MatchEditor = ({ participant, event = null, availableEvents = [], limitedParticipants = [], scheduleMatchId, onSubmit }) => {
	const [selectedEvent, setSelectedEvent] = useState(event || null);
	const [playedOn, setPlayedOn] = useState('');
	const [opponents, setOpponents] = useState([]);
	const [selectedOpponents, setSelectedOpponents] = useState([]);
	const [selectedWinners, setSelectedWinners] = useState([]);
	const [courts, setCourts] = useState([]);
	const [selectedCourt, setSelectedCourt] = useState('');
	const [sets, setSets] = useState([{ set: 1, value: '' }, { set: 2, value: '' }]);
	const [isDoubles, setIsDoubles] = useState(false);
	const [error, setError] = useState({ playedOn: false, opponents: false });
	const [winner, setWinner] = useState(true);
	const [setErrorText, setSetErrorText] = useState('');
	const [comment, setComment] = useState('');
	const [isPrivate, setIsPrivate] = useState(false);
	const [retired, setRetired] = useState(false);
	const isLimited = limitedParticipants.length > 0;

	useEffect(() => {
		// Fetch opponents and courts
		async function fetchData() {
			try {
				if (!isLimited) {

					const opponentsData = await playerAPI.getParticipants(selectedEvent || null, null); // Adjust API call as necessary
					setOpponents(opponentsData.data.players);

				}
				const courtsData = await courtAPI.getCourts();
				setCourts(courtsData.courts);
			} catch (error) {
				console.error('Failed to fetch data:', error);
			}
		}

		fetchData();
	}, []);

	const onSubmitMatch = () => {
		// Create an object with the match result data

		let match = {
			winners: winner ? selectedWinners : selectedOpponents,
			losers: winner ? selectedOpponents : selectedWinners,
			score: sets.filter(set => set.value).map(set => set.value).join(', '),
			type: event.league_type ?? 'singles', // should be singles or doubles,
			played_on: new Date(playedOn).toISOString().split('T')[0],
			...selectedEvent ? { event_id: selectedEvent.id } : null,
			retired: retired,
			schedule_match_id: scheduleMatchId,
			comments: []
		}

		if (comment.length > 0) {
			const matchComment = {
				content: comment,
				posted_by: authAPI.getCurrentUser.id,
				private: isPrivate,
				posted_on: Date.now//helpers.formatAWSDate(Date.now)
			}
			match.comments.push(matchComment)
		}

		matchAPI.createMatch(match).then((result) => {
			console.log(result)
			// Call the onSubmit prop (callback) and pass the result object
			if (onSubmit)
				onSubmit(match)
		})
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
		const names = playerList.map((opponentId) => {
			const opponent = availablePlayers.find((player) => player.id === opponentId);
			return opponent ? opponent.name : null;
		})
			.filter(Boolean) // Remove any null values if an ID doesn't match
			.join(", ");
		return names;
	}

	const getScore = () => { return sets.filter(set => set.value).map(set => set.value).join(', ') }

	const availablePlayers = isLimited ? limitedParticipants : [participant, ...opponents];

	const steps = [
		!event &&
		{
			label: 'Event Selection',
			content: (
				<Box>
					<Typography variant="h6">Select Event</Typography>
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
					</TextField>
				</Box>
			),
			handleNext: () => !!selectedEvent || availableEvents.length === 0,
		},
		{
			label: 'Match Details',
			content: (
				<Box >
					<Typography variant="h6">Match Details</Typography>
					<TextField
						type="date"
						label="Played On"
						fullWidth
						required
						error={error.playedOn}
						helperText={error.playedOn ? 'Date is required' : ''}
						value={playedOn}
						onChange={(e) => setPlayedOn(e.target.value)}
						sx={{ mb: 2 }}
					/>
					{isLimited && (
						<TextField
							select
							label="Winner(s)"
							fullWidth
							required
							error={error.winner}
							helperText={error.winner ? 'Winner is required' : ''}
							value={Array.isArray(selectedWinners) ? selectedWinners : []}
							onChange={(e) => setSelectedWinners(Array.isArray(e.target.value) ? e.target.value : [e.target.value])}
							multiple={isDoubles}
							sx={{ mb: 2 }}
						>
							{availablePlayers
								//.filter((player) => !selectedOpponents.some((opponent) => opponent === player.id))
								.map((p) => (
									<MenuItem key={p.id} value={p.id}>
										{p.name}
									</MenuItem>
								))}
						</TextField>
					)}
					<TextField
						select
						label="Opponent(s)"
						fullWidth
						required
						error={error.opponents}
						helperText={error.opponents ? 'Opponent is required' : ''}
						value={Array.isArray(selectedOpponents) ? selectedOpponents : []}
						onChange={(e) => setSelectedOpponents(Array.isArray(e.target.value) ? e.target.value : [e.target.value])}
						multiple={isDoubles}
						sx={{ mb: 2 }}
					>
						{availablePlayers
							.filter((player) => !selectedWinners.some((winner) => winner === player.id))
							.map((p) => (
								<MenuItem key={p.id} value={p.id}>
									{p.name}
								</MenuItem>
							))}
					</TextField>
					<TextField
						select
						label="Court"
						fullWidth
						value={selectedCourt}
						onChange={(e) => setSelectedCourt(e.target.value)}
						sx={{ mb: 2 }}
					>
						{courts.map((court) => (
							<MenuItem key={court.id} value={court.id}>
								{court.name}</MenuItem>
						))}
					</TextField>
				</Box>
			),
			handleNext: () => {
				const playedOnError = !playedOn;
				const opponentsError = selectedOpponents.length === 0;
				const winnersError = selectedWinners.length === 0 && isLimited;
				setError({ playedOn: playedOnError, opponents: opponentsError, winners: winnersError });
				return !playedOnError && !opponentsError && !winnersError;
			},
		},
		{
			label: 'Score Reporting',
			content: (
				<Box>
					<Typography variant="h6">Report Score</Typography>
					{!selectedWinners &&
						<FormControlLabel
							control={
								<Switch
									checked={winner}
									onChange={() => setWinner(!winner)}
								/>
							}
							label={winner ? 'I Won' : 'I Lost'}
							sx={{ mb: 2 }}
						/>
					}
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
						{getPlayers(selectedWinners) || participant.name}
					</Typography>
					<Typography>
						{!winner ? 'Winner' : 'Opponent'}: &nbsp;
						{selectedOpponents.map(id => availablePlayers.find(o => o.id === id)?.name).join(', ')}
					</Typography>
					<Typography>Court: {courts.find(c => c.id === selectedCourt)?.name}</Typography>
					<Typography>Score: {retired ? 'Default' : sets.filter(set => set.value).map(set => set.value).join(', ')}</Typography>
					<Typography>Comment: <i>{comment}</i></Typography>
					<Typography>Note Type: {isPrivate ? 'Private' : 'Public'}</Typography>
				</Box>
			),
			handleNext: async () => {
				const matchData = {
					event: selectedEvent?.id || null,
					played_on: playedOn,
					losers: selectedOpponents,
					winners: isLimited ? selectedWinners : [participant],
					court: selectedCourt,
					score: sets.filter(set => set.value).map(set => set.value).join(', '),
					comment,
					is_private: isPrivate,
				};
				await onSubmit(matchData);
				return true;
			},
		},
	].filter(Boolean);

	return <Wizard steps={steps} submitText="Submit Match" handleSubmit={onSubmitMatch} />;
};

export default MatchEditor;
