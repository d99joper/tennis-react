import { Flex, Radio, RadioGroupField } from '@aws-amplify/ui-react';
import { Autocomplete, Select, TextField, MenuItem, InputLabel, FormControl, Checkbox, FormControlLabel, Button } from '@mui/material'; //https://mui.com/material-ui/react-autocomplete/
import React, { useState } from 'react';
import { enums, ladderFunctions as lf } from '../../../helpers/index';
import SetInput from './SetInput'
import './MatchEditor.css';

// todo: 1. Add more players to database. 
//       2. List players from db in select 
//       3. Save match on submit
//       4. Update list of matches pull from actual matches
//       5. After adding match, add the latest match to list
//       6. Put matcheditor in Modal from Profile page?


const MatchEditor = ({ player, onSubmit, ...props }) => {
    // Initialize the state for the player names and the selected match format
    const [winner, setWinner] = useState({ name: '' })
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
    const [ladderId, setLadderId] = useState(props.ladderId || 0)

    // Initialize the state for the score
    const [score, setScore] = useState([set1, set2, set3, set4, set5])

    const ladderPlayers = lf.GetLadderPlayers(ladderId);
    const handleSubmit = (event) => {
        event.preventDefault();
        // Create an object with the match result data
        const result = {
            winner,
            loser,
            score
        };
        console.log(result)
        // Call the onSubmit prop and pass the result object
        //onSubmit(result);
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
        console.log('HandleSetChange')
        let s = e.target.value
        let newScore = [...score]
        newScore[set-1] = s
        setScore(newScore)
        console.log(newScore)
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
                <div className="error" style={{display: 'block', width: '300px',overflowX: 'visible'}}>
                    Warning: Winner is supposed to report the score. 
                    You can report it, but make sure your opponent isn't planning on reporting it as well, 
                    to prevent duplicate scores.  
                </div>
            }

                <Flex direction={'column'} gap="1" marginTop={'1em'}>
                    <Autocomplete
                        id="winner-search"
                        required
                        options={!ladderPlayers ? [{ name: 'Loading...', id: 0 }] : ladderPlayers}
                        disableClearable={isWinner}
                        disabled={isWinner}
                        getOptionDisabled={(option) => option.name == loser.name}
                        autoSelect={true}
                        onChange={(e, value) => { setWinner(value) }}
                        getOptionLabel={options => options.name}
                        value={winner}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Winner" />}
                    />
                    <Autocomplete
                        id="loser-search"
                        required
                        options={!ladderPlayers ? [{ label: 'Loading...', id: 0 }] : ladderPlayers}
                        disableClearable={!isWinner}
                        disabled={!isWinner}
                        getOptionDisabled={(option) => option.name == winner.name}
                        autoSelect={true}
                        onChange={(e, value) => { setLoser(value) }}
                        value={loser}
                        getOptionLabel={options => options.name}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Defeated" />}
                    />
                    {/* Match format */}
                    <FormControl sx={{ minWidth: 120 }}>
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
                    <label> 
                        {winner.name + " beats " + loser.name + " with " + score.filter(Boolean).join(', ')}
                    </label>
                    <Button type="submit">Add result</Button>
                </Flex>
        </form>
    );
};

export { MatchEditor };
