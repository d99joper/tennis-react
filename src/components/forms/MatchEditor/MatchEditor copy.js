import { Flex, Radio, RadioGroupField, TextAreaField, View } from '@aws-amplify/ui-react';
import {
	Select, TextField,
	MenuItem, InputLabel, FormControl,
	Checkbox, FormControlLabel, Button, Typography, Autocomplete
} from '@mui/material'; //https://mui.com/material-ui/react-autocomplete/
import React, { useEffect, useState } from 'react';
import { enums, helpers, ladderHelper } from '../../../helpers/index';
import SetInput from './SetInput'
import './MatchEditor.css';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import debounce from 'lodash.debounce'
import { CreatePlayer, SelectWithFetch } from '../index';
import { courtAPI, matchAPI, playerAPI } from 'api/services';
import CreateCourt from 'views/court/create';

//import { Dayjs } from 'dayjs';

const MatchEditor = (
	{
		ladder,
		ladders,
		player,
		onSubmit,
		isAdmin,
		minDate = new Date().setMonth(new Date().getMonth() - 1),
		type = enums.MATCH_TYPE.SINGLES,
		...props
	}) => {
	// Initialize the state for the player names and the selected match format
	const [playedOn, setPlayedOn] = useState(null);
	const [winner, setWinner] = useState([{ ...player }])
	const [loser, setLoser] = useState([])
	const [court, setCourt] = useState({})
	const [isWinner, setIsWinner] = useState(true)
	const [isLadderMatch, setIsLadderMatch] = useState(false)
	const [matchFormat, setMatchFormat] = useState(0)
	const [sampleResult, setSampleResult] = useState('*eg. 6-3, 7-6(4)')
	const [retired, setRetired] = useState(false)
	const [comment, setComment] = useState('')
	const [ladderId, setLadderId] = useState(props.ladderId || 0)
	const showLadderSelect = typeof (props.ladderId) === 'undefined'

	// Initialize the state for the score
	const [score, setScore] = useState(['', '', '', '', ''])

	//const ladderPlayers = lf.GetLadderPlayers(ladderId)
	if (!ladders)
		ladders = player?.ladders

	//https://stackoverflow.com/questions/40811535/delay-suggestion-time-in-mui-autocomplete
	const ladderPlayers = ladderHelper.useLadderPlayersData(ladderId, '')

	useEffect(() => { console.log('ladderid updated') }, [ladderId])
	const handleSubmit = (event) => {
		event.preventDefault();

		// Create an object with the match result data
		let match = {
			winner: [{ ...winner[0] }],
			loser: [{ ...loser[0] }],
			score: score.filter(Boolean).join(', '),
			type: type,
			played_on: new Date(playedOn).toISOString().split('T')[0],
			...ladderId != '0' ? { ladder: { id: ladderId } } : null,
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
		setLoser([{ name: '' }])
		setWinner([{ ...player }])
		setComment('')
		setPlayedOn(null)
		setLadderId(props.ladderId || 0)
	}

	const handleWinnerRadio = (e) => {
		const didPlayerWin = (e.target.value === 'true')

		// set and switch the winner/loser
		if (didPlayerWin) {
			setLoser([{ ...winner }])
			setWinner([{ ...player }])
		}
		else {
			setWinner([{ ...loser }])
			setLoser([{ ...player }])
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

	const handleMatchFormatChange = (e) => {
		setMatchFormat(e.target.value)
		switch (e.target.value) {
			case enums.MATCH_FORMATS.REGULAR_3.val:
				setSampleResult('*eg. 6-3, 7-6(4)')
				break;
			case enums.MATCH_FORMATS.PRO_8.val:
				setSampleResult('*eg. 8-5 or 8-7(4)')
				break;
			case enums.MATCH_FORMATS.PRO_10.val:
				setSampleResult('*eg. 10-6 or 10-9(5)')
				break;
			case enums.MATCH_FORMATS.FAST4_3.val:
				setSampleResult('*eg. 4-2, 3-4(2), 4-1')
				break;
			case enums.MATCH_FORMATS.FAST4_5.val:
				setSampleResult('*eg. 4-2, 3-4(2), 4-1, 4-3(3)')
				break;
			default:
				break;
		}
	}

	const playerFetch = async (filter) => {
		const results = await playerAPI.getPlayers(filter)
		return results.players.map(({ id, name }) => ({ id, name }))
	}

	const courtFetch = async (filter) => {
		const results = await courtAPI.getCourts(filter)
		return results.courts.map(({ id, name }) => ({ id, name }))
	}


	return (
		<form 
			//onSubmit={handleSubmit}
		>
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
										if (isWinner)
											setLoser({ id: '0', name: '' })
										else
											setWinner({ id: '0', name: '' })
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
					: <Typography variant='h6'>{ladderPlayers.ladder.name}</Typography>
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

				<Flex direction={'row'} className={'mediaFlex'}>
					<SelectWithFetch
						key="match_location_select"
						placeholder='Match location'
						fetchFunction={courtFetch}
						onItemSelect={x => setCourt(x)}
						selectedItem={court}
						allowCreate={true}
						initialItems={[]}
					>
						<CreateCourt />
					</SelectWithFetch>
				</Flex>

				{/* Display the players by autocomplete */}
				<Flex direction={'row'} className={'mediaFlex'}>
					<SelectWithFetch
						key="winner_select"
						fetchFunction={ladderId > 0 ? ladderId : playerFetch}
						placeholder="Winner"
						ladderId={ladderId}
						allowCreate={true}
						initialItems={ladderPlayers.players}
						//initialItems={[{id: '1', name:'player 1'}, {id:'2', name: 'player 2'}]}
						disabledItemList={[{ id: loser[0]?.id }]}
						disabled={isWinner && !isAdmin}
						selectedItem={winner[0]}
						onItemSelect={p => setWinner([{ ...p }])}
					>
						<CreatePlayer />
					</SelectWithFetch>
					<SelectWithFetch
						key="loser_select"
						fetchFunction={ladderId === 0 ? playerFetch : ladderId}
						placeholder="Defeated"
						//ladderId={ladderId}
						initialItems={ladderPlayers.players}
						//initialItems={[{id: '1', name:'player 1'}, {id:'2', name: 'player 2'}]}
						disabledItemList={[{ id: winner[0]?.id }]}
						disabled={!isWinner}
						selectedItem={loser[0]}
						onItemSelect={p => setLoser([{ ...p }])}
					>
						<CreatePlayer />
					</SelectWithFetch>
				</Flex>
				{/* Match format */}
				<Flex direction={'column'}>
					<Flex className='mediaFlex' direction={'row'}>

						<FormControl sx={{ minWidth: 120, width: 300 }}>
							<InputLabel id="select-match-format-label">Match format</InputLabel>
							<Select
								labelId='select-match-format-label'
								label="Match format"
								id="match-format-select"
								value={matchFormat}
								onChange={(e) => { handleMatchFormatChange(e) }}>
								<MenuItem value={enums.MATCH_FORMATS.REGULAR_3.val}>{enums.MATCH_FORMATS.REGULAR_3.desc}</MenuItem>
								<MenuItem value={enums.MATCH_FORMATS.PRO_8.val}>{enums.MATCH_FORMATS.PRO_8.desc}</MenuItem>
								<MenuItem value={enums.MATCH_FORMATS.PRO_10.val}>{enums.MATCH_FORMATS.PRO_10.desc}</MenuItem>
								<MenuItem value={enums.MATCH_FORMATS.FAST4_3.val}>{enums.MATCH_FORMATS.FAST4_3.desc}</MenuItem>
								<MenuItem value={enums.MATCH_FORMATS.FAST4_5.val}>{enums.MATCH_FORMATS.FAST4_5.desc}</MenuItem>
							</Select>
						</FormControl>
						{/* Sets */}
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
					<span style={{ marginTop: '-.9rem', fontStyle: 'italic' }}>{sampleResult}</span>
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
					placeholder={`Any comments about the match?`}
				/>
				<label className="summary">
					{/* {winner && loser &&
					(winner[0].name && loser[0].name) && winner[0].name + " beats " + loser[0].name + " with " + score.filter(Boolean).join(', ')
					} */}
				</label>
				<Button type="button" onClick={(e) => handleSubmit(e)} variant='submit'>Add result</Button>
			</Flex>
		</form>
	);
};

export { MatchEditor };
