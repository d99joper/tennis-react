import { Flex, Radio, RadioGroupField, TextAreaField, Text, View } from '@aws-amplify/ui-react';
import {
	Autocomplete, Select, TextField,
	MenuItem, InputLabel, FormControl,
	Checkbox, FormControlLabel, Button, Typography
} from '@mui/material'; //https://mui.com/material-ui/react-autocomplete/
import React, { useEffect, useRef, useState } from 'react';
import { enums, helpers, ladderHelper } from '../../../helpers/index';
import SetInput from './SetInput'
import './MatchEditor.css';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { GrCircleInformation } from 'react-icons/gr'
import debounce from 'lodash.debounce'
import { SelectPlayer } from './SelectPlayer';
import { matchAPI } from 'api/services';

//import { Dayjs } from 'dayjs';

const MatchEditor = (
	{
		ladder,
		ladders,
		player,
		onSubmit,
		isAdmin,
		minDate,
		type = enums.MATCH_TYPE.SINGLES,
		...props
	}) => {
	// Initialize the state for the player names and the selected match format
	const [playedOn, setPlayedOn] = useState(null);
	const [winner, setWinner] = useState([{...player}])
	const [loser, setLoser] = useState([{ name: '' }])
	const [isWinner, setIsWinner] = useState(true)
	const [isLadderMatch, setIsLadderMatch] = useState(false)
	const [matchFormat, setMatchFormat] = useState(0)
	const [scoreError, setScoreError] = useState(false)
	const [retired, setRetired] = useState(false)
	const [comment, setComment] = useState('')
	const [ladderId, setLadderId] = useState(props.ladderId || 0)
	const [searchInput, setSearchInput] = useState('')
	const showLadderSelect = typeof (props.ladderId) === 'undefined'

	// Initialize the state for the score
	const [score, setScore] = useState(['', '', '', '', ''])

	//const ladderPlayers = lf.GetLadderPlayers(ladderId)
	if (!ladders)
		ladders = player?.ladders

	//https://stackoverflow.com/questions/40811535/delay-suggestion-time-in-mui-autocomplete
	const ladderPlayers = ladderHelper.useLadderPlayersData(ladderId, searchInput)

	const handleSubmit = (event) => {
		event.preventDefault();

		// Create an object with the match result data
		let match = {
			winner: [{...winner[0]}],
			loser: [{...loser[0]}],
			score: score.filter(Boolean).join(', '),
			type: type,
			played_on: new Date(playedOn).toISOString().split('T')[0],
			...ladderId != '0' ? {ladder: { id: ladderId }} : null,
			retired: retired
		}

		if (comment.length > 0) {
			const matchComment = {
				content: comment,
				posted_by: player.id,
				private: true,
				posted_on: Date.now//helpers.formatAWSDate(Date.now)
			}
			match.comment = matchComment
		}

		//mf.createMatch(match).then((result) => {
		matchAPI.createMatch(match).then((result) => {
			// Call the onSubmit prop and pass the result object
			console.log(result)
			onSubmit(match)
			resetForm()
		})

	}

	function resetForm() {
		// setSet1()
		// setSet2('')
		// setSet3('')
		// setSet4('')
		// setSet5('')
		setLoser([{name:''}])
		setWinner([{...player}])
		setComment('')
		setPlayedOn(null)
		setLadderId(props.ladderId || 0)
	}

	const handleWinnerRadio = (e) => {
		const didPlayerWin = (e.target.value === 'true')

		// set and switch the winner/loser
		if (didPlayerWin) {
			setLoser([{...winner}])
			setWinner([{...player}])
		}
		else {
			setWinner([{...loser}])
			setLoser([{...player}])
		}
		setIsWinner(didPlayerWin)
	}

	const handleLadderRadio = (e) => {
		const isYes = e.target.value === 'true'
		if (!isYes)
			setLadderId(0)
		setIsLadderMatch(isYes)
	}

	const handleSetChange = (newValue, set) => {
		let newScore = [...score]
		newScore[set - 1] = newValue
		setScore(newScore)
	}

	return (
		<form onSubmit={handleSubmit}>
			{!isAdmin &&
				<>
					<RadioGroupField
						label="Did you win?"
						direction={'row'}
						name="isWinner"
						value={isWinner}
						onChange={handleWinnerRadio}
					>
						<Radio value={true} checked={isWinner}>Yes</Radio>
						<Radio value={false}>No</Radio>
					</RadioGroupField>
					{!isWinner &&
						<div className="error" style={{ float: 'right', display: 'block', width: '300px', overflowX: 'visible', marginTop: '-100px' }}>
							<b>Warning:</b> The winner is supposed to submit the score.
							To prevent duplicate scores, make sure your opponent is not planning to submit it.
						</div>
					}
				</>
			}
			<Flex direction={'column'} gap="1" marginTop={'1em'}>
				{/* If this is opened from a player's profile, 
						ask if it's a ladder match */}
				{showLadderSelect ?
					<>
						<RadioGroupField
							label="Was this match for a ladder?"
							direction={'row'}
							name="isLadderMatch"
							value={isLadderMatch}
							onChange={handleLadderRadio}
						>
							<Radio value={true}>Yes</Radio>
							<Radio value={false} checked={!isLadderMatch}>No</Radio>
						</RadioGroupField>
						{/** If user chooses a ladder */}
						{isLadderMatch &&
							<View >
								<InputLabel id="select-ladders-label">My ladders</InputLabel>
								<Select
									labelId='select-ladders-label'
									autoWidth={true}
									label="My Ladders"
									id="ladder-select"
									required
									value={ladderId}
									onChange={(e) => { 
										setLadderId(e.target.value)
										setWinner({name:''})
										setLoser({name:''}) 
									}}
								>
									<MenuItem key='0' value={0}>{"-- Select ladder --"}</MenuItem>
									{ladders?.map(option => {
										return (
											<MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
										)
									})}
								</Select>
							</View>
						}
					</>
					/** Else, it should be the ladder page, so elect the ladder  */
					: <Typography variant='h6'>ladderPlayers.ladder.name</Typography>
				}
				<Flex direction={'row'} className={'mediaFlex'}>
					{/* Date match was played */}
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							label="Match played date"
							required
							minDate={minDate}
							maxDate={Date.now()}
							value={playedOn}
							onChange={(newValue) => {
								setPlayedOn(newValue);
							}}
							renderInput={(params) => <TextField required {...params} sx={{ width: 200 }} />}
						/>
					</LocalizationProvider>
				</Flex>

				{/* Display the players by autocomplete */}
				<Flex direction={'row'} className={'mediaFlex'}>
					<SelectPlayer
						label="Winner"
						ladderId={ladderId}
						ladderPlayers={ladderPlayers}
						disabledPlayerList={[{ id: loser[0]?.id }]}
						disabled={isWinner && !isAdmin}
						player={winner[0]}
						onPlayerSelect={p => setWinner([{...p}])}
					/>
					<SelectPlayer
						label="Defeated"
						ladderId={ladderId}
						ladderPlayers={ladderPlayers}
						disabledPlayerList={[{ id: winner[0]?.id }]}
						disabled={!isWinner}
						player={loser[0]}
						onPlayerSelect={p => setLoser([{...p}])}
					/>
				</Flex>
				<Flex className='mediaFlex' direction={'row'}>
					{/* Match format */}
					<FormControl sx={{ minWidth: 120, width: 300 }}>
						<InputLabel id="select-match-format-label">Match format</InputLabel>
						<Select
							labelId='select-match-format-label'
							label="Match format"
							id="match-format-select"
							value={matchFormat}
							onChange={(e) => { setMatchFormat(e.target.value) }}>
							<MenuItem value={enums.MATCH_FORMATS.REGULAR_3.val}>{enums.MATCH_FORMATS.REGULAR_3.desc}</MenuItem>
							<MenuItem value={enums.MATCH_FORMATS.PRO_8.val}>{enums.MATCH_FORMATS.PRO_8.desc}</MenuItem>
							<MenuItem value={enums.MATCH_FORMATS.PRO_10.val}>{enums.MATCH_FORMATS.PRO_10.desc}</MenuItem>
							<MenuItem value={enums.MATCH_FORMATS.FAST4_3.val}>{enums.MATCH_FORMATS.FAST4_3.desc}</MenuItem>
							<MenuItem value={enums.MATCH_FORMATS.FAST4_5.val}>{enums.MATCH_FORMATS.FAST4_5.desc}</MenuItem>
						</Select>
					</FormControl>

					{/* Sets */}
					<Flex gap="1rem" direction={'column'}>

						<Flex gap={'1rem'} direction={'row'}>
							<SetInput
								label="set 1"
								id="set1"
								matchFormat={matchFormat}
								required={!retired}
								handleBlur={(newVal) => { handleSetChange(newVal, 1) }}
								key="set1"
							/>
							{![enums.MATCH_FORMATS.PRO_10.val, enums.MATCH_FORMATS.PRO_8.val].includes(matchFormat) &&
								<>
									<SetInput
										label="set 2"
										id="set2"
										matchFormat={matchFormat}
										required={!retired}
										handleBlur={(newVal) => { handleSetChange(newVal, 2) }}
										key="set2"
									/>
									<SetInput
										label="set 3"
										id="set3"
										matchFormat={matchFormat}
										required={matchFormat === enums.MATCH_FORMATS.FAST4_5.val && !retired}
										handleBlur={(newVal) => { handleSetChange(newVal, 3) }}
										key="set3"
									/>
								</>
							}
						</Flex>
					</Flex>
					{enums.MATCH_FORMATS.FAST4_5.val === matchFormat &&
						<Flex gap={'1rem'} direction={'row'}>
							<SetInput
								label="set 4"
								id="set4"
								matchFormat={matchFormat}
								handleBlur={(e) => { handleSetChange(e, 4) }}
								key="set4"
							/>
							<SetInput
								label="set 5"
								id="set5"
								matchFormat={matchFormat}
								handleBlur={(e) => { handleSetChange(e, 5) }}
								key="set5"
							/>
						</Flex>
					}
				</Flex>

				<FormControlLabel
					label="Opponent retired"
					control={
						<Checkbox
							checked={retired}
							onChange={(e, val) => { setRetired(val) }}
						/>
					}
				/>
				{/* comment */}
				<TextAreaField
					label="comment"
					id="match-comment"
					className='comment'
					onBlur={(e) => setComment(e.currentTarget.value)}
					placeholder={`Any comments about the match? You can also add tiebreak scores here.`}
				/>
				<label className="summary">
					{(winner[0].name && loser[0].name) && winner[0].name + " beats " + loser[0].name + " with " + score.filter(Boolean).join(', ')}
				</label>
				<Button type="submit" variant='submit'>Add result</Button>
			</Flex>
		</form>
	);
};

export { MatchEditor };
