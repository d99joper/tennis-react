import { Flex, Radio, RadioGroupField, TextAreaField, View } from '@aws-amplify/ui-react'
import {
	Select, TextField,
	MenuItem, InputLabel, FormControl,
	Checkbox, FormControlLabel, Button, Typography, Grid, Box, CircularProgress
} from '@mui/material'; //https://mui.com/material-ui/react-autocomplete/
import React, { useEffect, useState } from 'react'
import { enums, ladderHelper } from '../../../helpers/index'
import SetInput from './SetInput'
import './MatchEditor.css'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { CreatePlayer, ErrorHandler, InfoPopup, SelectWithFetch } from '../index'
import { courtAPI, matchAPI, playerAPI } from 'api/services'
import CreateCourt from 'views/court/create'

//import { Dayjs } from 'dayjs';

const MatchEditor = (
	{
		ladder = null,
		ladders,
		player,
		onSubmit,
		isAdmin,
		minDate = new Date().setMonth(new Date().getMonth() - 1),
		type = enums.MATCH_TYPE.SINGLES,
		...props
	}) => {
	// steps determine what is shown
	const steps = ['ladder', 'date', 'winner', 'loser', 'court', 'score', 'comment', 'confirm', 'loading']
	const [stepIndex, setStepIndex] = useState(0)
	const [infoText, setInfoText] = useState('')
	const [matchInfoText, setMatchInfoText] = useState('')
	const [error, setError] = useState('')
	const isFixedLadder = typeof (props.ladderId) !== 'undefined'
	console.log(isFixedLadder)


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
	const [showSummary, setShowSummary] = useState(false)
	//const showLadderSelect = typeof (props.ladderId) === 'undefined'

	// Initialize the state for the score
	const [score, setScore] = useState(['', '', '', '', ''])

	if (!ladders)
		ladders = player?.ladders
	console.log('ladder', props.ladderId)
	//https://stackoverflow.com/questions/40811535/delay-suggestion-time-in-mui-autocomplete
	const ladderInfo = ladderHelper.useLadderPlayersData(ladderId, '')

	useEffect(() => {
		console.log('ladderid updated', ladderId)
		// skip the ladder step if coming from a ladder 
		if (ladderId !== 0 && stepIndex < 2) {
			console.log('update step from', stepIndex)
			handleStep(1)
			updateInfoTexts(stepIndex + 1)
		}
		else
			updateInfoTexts(stepIndex)
	}, [ladderId, ladderInfo])

	const handleSubmit = () => {
		//event.preventDefault();
		if ((!winner[0]) || (!loser[0]) || score[0] === '' || !playedOn)
			return

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

		// set to loading step
		setStepIndex(stepIndex+1)
		
		matchAPI.createMatch(match).then((result) => {
			// Call the onSubmit prop (callback) and pass the result object
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
		console.log('set winner and loser', winner, loser)
		// set and switch the winner/loser
		if (didPlayerWin) {
			setLoser([])
			setWinner([{ ...player }])
		}
		else {
			setWinner([])
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
		updateMatchInfo(newScore)
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

	const stepErrorCheck = (currentStep) => {
		let isError = false
		setError('')
		if (currentStep === 'winner') {
			if (!winner[0]?.id) {
				setError('Please select a winner')
				isError = true
			}
		} else if (currentStep === 'date') {
			if (!playedOn) {
				setError('The match date is required.')
				isError = true
			}
		} else if (currentStep === 'loser') {
			if (!loser[0]?.id) {
				setError('Please select an opponent.')
				isError = true
			}
		} else if (currentStep === 'score') {
			// check the first three sets, if they are required
			for (let i = 1; i <= 3; i++) {
				const set = document.getElementById('set' + i)
				const isRequired = set.hasAttribute('required')
				if (isRequired) {
					if (set.value.trim() === '') {
						set.focus()
						setError('Set score is required')
						isError = true
						break
					}
				}
			}
		}

		return isError
	}
	const updateInfoTexts = (index) => {
		// reset the error text
		setError('')

		// if (steps[index] === 'winner') {
		// 	setInfoText('')
		// } else if (steps[index] === 'ladder') {
		// 	setInfoText('')
		// } else if (steps[index] === 'loser') {
		// 	setInfoText('Who did you defeat?')
		// } else if (steps[index] === 'date') {
		// 	setInfoText('')
		// } else if (steps[index] === 'court') {
		// 	setInfoText('')
		// } else if (steps[index] === 'score') {
		// 	setInfoText('')
		// } else if (steps[index] === 'comment') {
		// 	setInfoText('Any comments?')
		// } else if (steps[index] === 'confirm') {
		// 	setInfoText('confirm info')
		// }
		updateMatchInfo()
	}
	const updateMatchInfo = (newScore) => {
		let strWinner = winner.length === 1 ? winner[0].name : ''
		strWinner += winner.length > 1 ? ' and ' + winner[1].name : ''
		let strLoser = loser.length === 1 ? loser[0].name : ''
		strLoser += loser.length > 1 ? ' and ' + loser[1].name : ''
		let strLocation = court?.name ? ' at ' + court.name : ''
		let currentScore = newScore ?? score
		let strDate = playedOn ? (<>{`${new Date(playedOn).toISOString().split('T')[0]}`}<br /></>) : ''

		if (strDate && strDate !== '')
			setShowSummary(true)
		else
			setShowSummary(false)

		setMatchInfoText(
			<>
				{strDate}
				{ladderId !== 0 ? (<>{`${ladderInfo.ladder.name} match `}<br /></>) : ''}
				{winner[0] && loser[0] ? strWinner + ' beat ' + strLoser : ''}
				{currentScore[0] !== '' ? (<><br />{currentScore.filter(Boolean).join(', ')}</>) : ''}
				{strLocation}
			</>
		)
	}

	const handleStep = (stepIncreament) => {

		const newIndex = stepIndex + stepIncreament
		if (newIndex >= 0 && newIndex < steps.length) {
			// error checks if we are not stepping backwards
			if (stepIncreament > 0)
				if (stepErrorCheck(steps[stepIndex])) return

			// set the info text
			updateInfoTexts(newIndex)

			// update the step
			setStepIndex(newIndex)
		}
	}

	const isDisabled = (button) => {
		if(button === 'back')
			return stepIndex === 0 || (stepIndex === 1 && isFixedLadder)
		if (button === 'next')
			return ['confirm', 'loading'].includes(steps[stepIndex])
	}
	return (
		<form
			style={{ minHeight: '300px', minWidth: '400px', maxWidth: '500px' }}
		>
			{/* <Typography>
				{infoText}
			</Typography> */}
			{/* Step: 'winner'  */}
			{steps[stepIndex] === 'winner' && (
				<Grid>
					<RadioGroupField
						label="Did you win?"
						direction={'row'}
						name="isWinner"
						value={isWinner}
						onChange={handleWinnerRadio}
					>
						<Radio value={true} checked={isWinner}>Yes</Radio>
						<Radio value={false}>No</Radio>
						<InfoPopup paddingLeft={"0.1rem"} color="#ff8a12" size="20" iconType='warning'>
							<div className="error">
								<b>Warning:</b> The winner is supposed to submit the score.
								To prevent duplicate scores, make sure your opponent is not planning to submit it.
							</div>
						</InfoPopup>
					</RadioGroupField>
					<SelectWithFetch
						key="winner_select"
						fetchFunction={ladderId > 0 ? ladderId : playerFetch}
						placeholder="Winner"
						ladderId={ladderId}
						allowCreate={true}
						initialItems={ladderInfo.players}
						disabledItemList={[{ id: loser[0]?.id }]}
						disabled={isWinner && !isAdmin}
						selectedItem={winner[0]?.id ? winner[0] : null}
						onItemSelect={p => setWinner([{ ...p }])}
					>
						<CreatePlayer />
					</SelectWithFetch>
				</Grid>
			)}
			{/* Step: 'ladder'  */}
			{steps[stepIndex] === 'ladder' && (
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
			)}
			{/* Step: 'loser'  */}
			{steps[stepIndex] === 'loser' && (
				<SelectWithFetch
					key="loser_select"
					fetchFunction={ladderId === 0 ? playerFetch : ladderId}
					placeholder="Defeated"
					//ladderId={ladderId}
					initialItems={ladderInfo.players}
					//initialItems={[{id: '1', name:'player 1'}, {id:'2', name: 'player 2'}]}
					disabledItemList={[{ id: winner[0]?.id }]}
					disabled={!isWinner}
					selectedItem={loser[0]}
					onItemSelect={p => setLoser([{ ...p }])}
				>
					<CreatePlayer />
				</SelectWithFetch>
			)}
			{/* Step: 'date'  */}
			{steps[stepIndex] === 'date' && (
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
			)}
			{/* Step: 'court'  */}
			{steps[stepIndex] === 'court' && (
				<SelectWithFetch
					key="match_location_select"
					placeholder='Match location'
					fetchFunction={courtFetch}
					onItemSelect={x => setCourt(x)}
					selectedItem={court}
					allowCreate={true}
					initialItems={[]}
					showLocationIcon={true}
				>
					<CreateCourt />
				</SelectWithFetch>
			)}
			{/* Step: 'score'  */}
			{steps[stepIndex] === 'score' && (
				<>
					{/* Match format */}
					<Flex direction={'column'}>
						<Flex className='mediaFlex' direction={'column'}>
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
									value={score[0]}
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
											value={score[1]}
											handleBlur={(newVal) => { handleSetChange(newVal, 2) }}
											key="set2"
										/>
										<SetInput
											label="set 3"
											id="set3"
											matchFormat={matchFormat}
											value={score[2]}
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
										value={score[3]}
										handleBlur={(e) => { handleSetChange(e, 4) }}
										key="set4"
									/>
									<SetInput
										label="set 5"
										id="set5"
										matchFormat={matchFormat}
										value={score[4]}
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
				</>
			)}
			{/* Step: 'comment'  */}
			{steps[stepIndex] === 'comment' && (
				<TextAreaField
					//label="comment"
					id="match-comment"
					className='comment'
					onBlur={(e) => setComment(e.currentTarget.value)}
					placeholder={`Any comments about the match?`}
				/>
			)}
			{/* Step: 'confirm'  */}
			{steps[stepIndex] === 'confirm' && (
				<>Please confirm your match information.<br /> 
				Then hit the submit button to post.</>
			)}
			{/* Step: 'confirm'  */}
			{steps[stepIndex] === 'loading' && (
				<h3><CircularProgress /> Saving match...</h3>
			)}

			<ErrorHandler error={error} />
			<hr />
			<Button onClick={() => handleStep(-1)} disabled={isDisabled('back')}>
				Back
			</Button>
			<Button onClick={() => handleStep(1)} disabled={isDisabled('next')}>
				Next
				{/* {steps[stepIndex] === 'confirm' ? 'Submit' : 'Next'} */}
			</Button>

			{showSummary &&
				<Box className='summaryBox'>
					New match: <br />
					{matchInfoText}
				</Box>
			}
			{steps[stepIndex] === 'confirm' &&
				<Button onClick={() => {handleSubmit()}}>
					Submit	
				</Button>
			}
		</form>
	);
};

export { MatchEditor };
