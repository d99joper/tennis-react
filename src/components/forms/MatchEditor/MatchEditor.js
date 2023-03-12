import { Flex, Radio, RadioGroupField, TextAreaField, Text } from '@aws-amplify/ui-react';
import {
    Autocomplete, Select, TextField,
    MenuItem, InputLabel, FormControl,
    Checkbox, FormControlLabel, Button
} from '@mui/material'; //https://mui.com/material-ui/react-autocomplete/
import React, { useEffect, useState } from 'react';
import { enums, helpers, ladderFunctions as lf, matchFunctions as mf } from '../../../helpers/index';
import SetInput from './SetInput'
import './MatchEditor.css';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { GrCircleInformation } from 'react-icons/gr'

//import { Dayjs } from 'dayjs';

const MatchEditor = ({ player, onSubmit, isAdmin, minDate, ...props }) => {
    // Initialize the state for the player names and the selected match format
    const [playedOn, setPlayedOn] = useState(null);
    const [winner, setWinner] = useState(player)
    const [loser, setLoser] = useState({ name: '' })
    const [isWinner, setIsWinner] = useState(true)
    const [matchFormat, setMatchFormat] = useState(0)
    const [scoreError, setScoreError] = useState(false)
    const [retired, setRetired] = useState(false)
    const [set1, setSet1] = useState('')
    const [set2, setSet2] = useState('')
    const [set3, setSet3] = useState('')
    const [set4, setSet4] = useState('')
    const [set5, setSet5] = useState('')
    const [comment, setComment] = useState('')
    const [ladderId, setLadderId] = useState(props.ladderId || 0)
    const [searchInput, setSearchInput] = useState('')
    const showLadderSelect = typeof (props.ladderId) === 'undefined'

    // Initialize the state for the score
    const [score, setScore] = useState([set1, set2, set3, set4, set5])

    //const ladderPlayers = lf.GetLadderPlayers(ladderId)

    const playerLadders = lf.usePlayerLadders(player.id)
    //https://stackoverflow.com/questions/40811535/delay-suggestion-time-in-mui-autocomplete
    const ladderPlayers = lf.useLadderPlayersData(ladderId, searchInput)

    const handleSubmit = (event) => {
        event.preventDefault();

        // Create an object with the match result data
        let match = {
            winner,
            loser,
            score,
            type: 'SINGLES',
            playedOn: playedOn,
            ladderID: ladderId,
            retired: retired
        }

        if(comment.length > 0) {
            const matchComment = {
                content: comment,
                postedByID: player.id,
                private: true,
                postedOn: helpers.formatAWSDate(Date.now)
            }
            match.comment = matchComment
        }

        mf.createMatch(match).then((result) => {
            // Call the onSubmit prop and pass the result object
            console.log(result)
            onSubmit(result)
            resetForm()
        })

    }

    function resetForm() {
        setSet1('')
        setSet2('')
        setSet3('')
        setSet4('')
        setSet5('')
        setLoser({ name: '' })
        setWinner(player)
        setComment('')
        setPlayedOn(null)
        setLadderId(props.ladderId || 0)
    }

    const handleWinnerRadio = (e) => {
        const didPlayerWin = (e.target.value === 'true')

        // set and switch the winner/loser
        if (didPlayerWin) {
            setLoser(winner)
            setWinner(player)
        }
        else {
            setWinner(loser)
            setLoser(player)
        }
        setIsWinner(didPlayerWin)
    }

    const handleSetChange = (e, set) => {
        let s = e.target.value
        let newScore = [...score]
        newScore[set - 1] = s
        setScore(newScore)

        switch (set) {
            case 1:
                setSet1(s)
                break;
            case 2: setSet2(s)
                break;
            case 3: setSet3(s)
                break;
            case 4: setSet4(s)
                break;
            case 5: setSet5(s)
                break;
            default: break;
        }
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
                        onChange={handleWinnerRadio}>
                        <Radio value={true} checked={isWinner}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                    </RadioGroupField>
                    {!isWinner &&
                        <div className="error" style={{ display: 'block', width: '300px', overflowX: 'visible' }}>
                            Warning: Winner is supposed to report the score.
                            You can report it, but make sure your opponent isn't planning on reporting it as well,
                            to prevent duplicate scores.
                        </div>
                    }
                </>
            }
            <Flex direction={'column'} gap="1" marginTop={'1em'}>
                <Flex direction={'row'} className={'mediaFlex'}>
                    {/* Set or display ladder */}
                    {showLadderSelect ?
                        <FormControl sx={{ minWidth: 120, width: 300 }}>
                            <InputLabel id="select-ladders-label">My ladders</InputLabel>
                            <Select
                                labelId='select-ladders-label'
                                label="My Ladders"
                                id="ladder-select"
                                required
                                value={ladderId}
                                onChange={(e) => { setLadderId(e.target.value) }}>
                                {playerLadders?.map(option => {
                                    return (
                                        <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                                    )
                                })}
                                <MenuItem key="other_ladder" value="-1">Other *</MenuItem>
                            </Select>
                            {ladderId === '-1' ?
                                <Text fontSize=".75em" variation="info" fontWeight={'100'}>
                                    <GrCircleInformation />
                                    Use 'Other' for matches you want to track,
                                    but that are not part of a Tennis Space ladder.
                                </Text>
                                : null
                            }
                        </FormControl>
                        :
                        <label>ladderPlayers.ladder.name</label>
                    }
                    {/* Date match was played */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Match played date"
                            required
                            minDate={minDate}
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
                    <Autocomplete
                        id="winner-search"
                        required
                        options={!ladderPlayers ? [{ name: 'Loading...', id: -1 }] : ladderPlayers.players}
                        disableClearable={isWinner}
                        disabled={isWinner && !isAdmin}
                        getOptionDisabled={(option) => option.id === loser.id}
                        autoSelect={true}
                        onChange={(e, value) => { setWinner(value) }}
                        getOptionLabel={option => option.name}
                        value={winner}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField required {...params} label="Winner" />}
                    />
                    {/* 'A last option, for instance: Add "YOUR SEARCH".'      
                        https://mui.com/material-ui/react-autocomplete/ */}
                    <Autocomplete
                        id="loser-search"
                        required
                        options={!ladderPlayers ? [{ label: 'Loading...', id: -1 }] : ladderPlayers.players}
                        disableClearable={!isWinner}
                        disabled={!isWinner}
                        getOptionDisabled={(option) => option.id === winner.id}
                        autoSelect={true}
                        onChange={(e, value) => { setLoser(value) }}
                        value={loser}
                        getOptionLabel={option => option.name}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField required {...params} label="Defeated" />}
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
                                matchFormat={matchFormat}
                                required={!retired}
                                value={set1}
                                handleBlur={(e) => { handleSetChange(e, 1) }}
                                key="1"
                            />
                            {![enums.MATCH_FORMATS.PRO_10.val, enums.MATCH_FORMATS.PRO_8.val].includes(matchFormat) &&
                                <>
                                    <SetInput
                                        label="set 2"
                                        matchFormat={matchFormat}
                                        value={set2}
                                        required={!retired}
                                        handleBlur={(e) => { handleSetChange(e, 2) }}
                                        key="2"
                                    />
                                    <SetInput
                                        label="set 3"
                                        matchFormat={matchFormat}
                                        value={set3}
                                        required={matchFormat === enums.MATCH_FORMATS.FAST4_5.val && !retired}
                                        handleBlur={(e) => { handleSetChange(e, 3) }}
                                        key="3"
                                    />
                                </>
                            }
                        </Flex>
                    </Flex>
                    {enums.MATCH_FORMATS.FAST4_5.val === matchFormat &&
                        <Flex gap={'1rem'} direction={'row'}>
                            <SetInput
                                label="set 4"
                                matchFormat={matchFormat}
                                value={set4}
                                handleBlur={(e) => { handleSetChange(e, 4) }}
                                key="4"
                            />
                            <SetInput
                                label="set 5"
                                matchFormat={matchFormat}
                                value={set5}
                                handleBlur={(e) => { handleSetChange(e, 5) }}
                                key="5"
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
                    {(winner.name && loser.name) && winner.name + " beats " + loser.name + " with " + score.filter(Boolean).join(', ')}
                </label>
                <Button type="submit">Add result</Button>
            </Flex>
        </form>
    );
};

export { MatchEditor };
