import { Flex, Radio, RadioGroupField } from '@aws-amplify/ui-react';
import { Autocomplete, TextField } from '@mui/material'; //https://mui.com/material-ui/react-autocomplete/
import React, { useEffect, useState } from 'react';
import { userFunctions } from '../../../helpers/index';
import './MatchEditor.css';

const MatchEditor = ({ player, onSubmit, ...props }) => {
    // Initialize the state for the player names and the selected match format
    const [winner, setWinner] = useState({ name: '' })
    const [loser, setLoser] = useState({ name: '' })
    const [isWinner, setIsWinner] = useState('not set')
    const [scoreError, setScoreError] = useState(false)
    const [set1, setSet1] = useState('')
    const [set2, setSet2] = useState()
    const [set3, setSet3] = useState()
    const [set4, setSet4] = useState()
    const [set5, setSet5] = useState()
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

    const handleLoserWinnerChange = (e, values, winner) => {
        if (winner)
            setWinner(values)
        else
            setLoser(values)
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
        setScore = setScore.replace(/[^\d- ]/g, '').trim();

        if (/^\d+ ?- ?\d+$/.test(setScore)) setScoreError(false)
        else { setScoreError(true) }

        // get the individual games
        const games = setScore && setScore.match(/\d+/g).map(Number);

        if (games[0] > 20 || games[1] > 20) setScoreError(true)

        if (Math.abs(games[0] - games[1]) === 1) console.log("show tiebreaker", Math.abs(games[0] - games[1]))

        switch (set) {
            case 1:
                setSet1(setScore)
                break;
            case 2:
                setSet2(setScore)
                break;
            case 3:
                setSet3(setScore)
                break;
            case 4:
                setSet4(setScore)
                break;
            case 5:
                setSet5(setScore)
                break;
            default:
                break;
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
                    <Flex direction={'row'}>
                        <Autocomplete
                            id="winner-search"
                            options={!ladderPlayers ? [{ name: 'Loading...', id: 0 }] : ladderPlayers}
                            disableClearable={isWinner === "yes"}
                            disabled={isWinner === "yes"}
                            getOptionDisabled={(option) => option.name == loser.name}
                            autoSelect={true}
                            onChange={(e, value) => { handleLoserWinnerChange(e, value, true) }}
                            getOptionLabel={options => options.name}
                            value={winner}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Winner" />}
                        />
                        <TextField
                            label="set 1"
                            onChange={(e) => { handleSetChange(e, 1) }}
                            value={set1}
                            className="setBox"
                            id="set1-search"
                            required
                            error={scoreError}
                            helperText={scoreError && "please enter a valid set score"}
                            placeholder="X-X">
                        </TextField>
                    </Flex>
                    <Flex direction={'row'}>
                        <Autocomplete
                            id="loser-search"
                            options={!ladderPlayers ? [{ label: 'Loading...', id: 0 }] : ladderPlayers}
                            disableClearable={isWinner === "no"}
                            disabled={isWinner === "no"}
                            getOptionDisabled={(option) => option.name == winner.name}
                            autoSelect={true}
                            onChange={(e, value) => { handleLoserWinnerChange(e, value, false) }}
                            value={loser}
                            getOptionLabel={options => options.name}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Defeated" />}
                        />
                    </Flex>
                    <button type="submit">Add result</button>
                </Flex>
                : null}
        </form>
    );
};

export { MatchEditor };
