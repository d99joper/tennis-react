import { Flex, Radio, RadioGroupField } from '@aws-amplify/ui-react';
import { Autocomplete, Select, TextField, MenuItem, InputLabel, FormControl } from '@mui/material'; //https://mui.com/material-ui/react-autocomplete/
import React, { useState } from 'react';
import { userFunctions, enums } from '../../../helpers/index';
import SetInput from './SetInput'
import './MatchEditor.css';

const MatchEditor = ({ player, onSubmit, ...props }) => {
    // Initialize the state for the player names and the selected match format
    const [winner, setWinner] = useState({ name: '' })
    const [loser, setLoser] = useState({ name: '' })
    const [isWinner, setIsWinner] = useState('not set')
    const [matchFormat, setMatchFormat] = useState(1)
    const [scoreError, setScoreError] = useState(false)
    const [set1, setSet1] = useState('')
    const [set2, setSet2] = useState('')
    const [set3, setSet3] = useState('')
    const [set4, setSet4] = useState('')
    const [set5, setSet5] = useState('')
    const [showSet4, setShowSet4] = useState()
    const [showSet5, setShowSet5] = useState()
    const [ladderId, setLadderId] = useState(props.ladderId || 0)

    // Initialize the state for the score
    const [score, setScore] = useState('')

    const ladderPlayers = userFunctions.useLadderPlayersData(ladderId);
    const handleSubmit = () => {

        // Create an object with the match result data
        const result = {
            winner,
            loser,
            score
        };

        // Call the onSubmit prop and pass the result object
        onSubmit(result);
    }

    const handleWinnerRadio = (e) => {
        const didPlayerWin = e.target.value
        // set and switch the winner/loser

        if (didPlayerWin === "yes") {
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
        let setScore = e.target.value

        switch (set) {
            case 1: setSet1(setScore)
                break;
            case 2: setSet2(setScore)
                break;
            case 3: setSet3(setScore)
                break;
            case 4: setSet4(setScore)
                break;
            case 5: setSet5(setScore)
                break;
            default: break;
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <RadioGroupField
                label="Did you win?"
                name="isWinner"
                value={isWinner}
                onChange={handleWinnerRadio}>
                <Radio value={"yes"}>Yes</Radio>
                <Radio value={"no"}>No</Radio>
            </RadioGroupField>

            {isWinner !== "not set" ?
                <Flex direction={'column'} gap="1" marginTop={'1em'}>
                    <Autocomplete
                        id="winner-search"
                        required
                        options={!ladderPlayers ? [{ name: 'Loading...', id: 0 }] : ladderPlayers}
                        disableClearable={isWinner === "yes"}
                        disabled={isWinner === "yes"}
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
                        disableClearable={isWinner === "no"}
                        disabled={isWinner === "no"}
                        getOptionDisabled={(option) => option.name == winner.name}
                        autoSelect={true}
                        onChange={(e, value) => { setLoser(value) }}
                        value={loser}
                        getOptionLabel={options => options.name}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Defeated" />}
                    />
                    {/* Match format */}
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
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
                        value={set1}
                        onChange={(e) => { handleSetChange(e, 1) }}
                        key="1"
                        />
                    {![enums.MATCH_FORMATS.PRO_10.val, enums.MATCH_FORMATS.PRO_8.val].includes(matchFormat) && 
                        <>
                        <SetInput
                            label="set 2"
                            matchFormat={matchFormat}
                            value={set2}
                            onChange={(e) => { handleSetChange(e, 2) }}
                            key="2"
                            />
                        <SetInput
                            label="set 3"
                            matchFormat={matchFormat}
                            value={set3}
                            onChange={(e) => { handleSetChange(e, 3) }}
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
                            onChange={(e) => { handleSetChange(e, 4) }}
                            key="4"
                            />
                        <SetInput
                            label="set 5"
                            matchFormat={matchFormat}
                            value={set5}
                            onChange={(e) => { handleSetChange(e, 5) }}
                            key="5"
                            />
                        </Flex>
                    }
                    </Flex>
                    <button type="submit">Add result</button>
                </Flex>
                : null}
        </form>
    );
};

export { MatchEditor };
