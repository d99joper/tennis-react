import { Radio, RadioGroupField } from '@aws-amplify/ui-react';
import { Autocomplete, TextField } from '@mui/material'; //https://mui.com/material-ui/react-autocomplete/
import React, { useEffect, useState } from 'react';
import { userFunctions } from '../../../helpers/index';
import './MatchEditor.css';

const MatchEditor = ({ player, onSubmit, ...props }) => {
    // Initialize the state for the player names and the selected match format
    const [winner, setWinner] = useState({name: ''})
    const [loser, setLoser] = useState({name: ''})
    const [isWinner, setIsWinner] = useState('not set')
    const [set1W, setSet1W] = useState()
    const [set1L, setSet1L] = useState()
    const [set2W, setSet2W] = useState()
    const [set2L, setSet2L] = useState()
    const [set3W, setSet3W] = useState()
    const [set3L, setSet3L] = useState()
    const [set4W, setSet4W] = useState()
    const [set4L, setSet4L] = useState()
    const [set5W, setSet5W] = useState()
    const [set5L, setSet5L] = useState()
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

    const handleLoserWinnerChange = (e,values, winner) => {
        if(winner)
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
        setScore = setScore.replace(/[^\d]/g, '');

        // don't allow ridicoulos numbers
        if (setScore > 20) setScore = 19

        switch (set) {
            case 'W1':
                set1W(setScore)
                break;
            case 'W2':
                set2W(setScore)
                break;
            case 'W3':
                set2W(setScore)
                break;
            case 'W4':
                set2W(setScore)
                break;
            case 'W5':
                set2W(setScore)
                break;
            case 'L1':
                set2W(setScore)
                break;
            case 'L2':
                set2W(setScore)
                break;
            case 'L3':
                set2W(setScore)
                break;
            case 'L4':
                set2W(setScore)
                break;
            case 'L5':
                set2W(setScore)
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
                <>
                    <label>
                        
                        <Autocomplete
                            id="winner-search"
                            options={!ladderPlayers ? [{name: 'Loading...', id:0}] : ladderPlayers}
                            disableClearable={isWinner === "yes"}
                            disabled={isWinner === "yes"}
                            getOptionDisabled={(option) => option.name == loser.name}
                            autoSelect={true}
                            // onChange={(e, newValue) => {
                            //     console.log(newValue)
                            //     setWinner(newValue)
                            //   }}
                            onChange={(e,value) => {handleLoserWinnerChange(e,value, true)}}
                            getOptionLabel={options => options.name}
                            value={winner}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Winner" />}
                        />
                        {/* Winner score */}
                        <input type="text" name="set1_winner" className='setBox'
                            onChange={(e) => {handleSetChange(e, 'W1')}}></input>
                        <input type="text" name="set2_winner" className='setBox' 
                            onChange={(e) => {handleSetChange(e, 'W2')}}></input>
                        <input type="text" name="set3_winner" className='setBox' 
                            onChange={(e) => {handleSetChange(e, 'W3')}}></input>
                        <input type="text" name="set4_winner" className='setBox' 
                            style={{display: (showSet4 ? 'block' : 'none')}} 
                            onChange={(e) => {handleSetChange(e, 'W4')}}></input>
                        <input type="text" name="set5_winner" className='setBox' 
                            style={{display: (showSet4 ? 'block' : 'none')}} 
                            onChange={(e) => {handleSetChange(e, 'W5')}}></input>
                    </label>
                    <label>
                        
                        <Autocomplete
                            id="loser-search"
                            options={!ladderPlayers ? [{label: 'Loading...', id:0}] : ladderPlayers}
                            disableClearable={isWinner === "no"}
                            disabled={isWinner === "no"}
                            getOptionDisabled={(option) => option.name == winner.name}
                            autoSelect={true}
                            onChange={(e,value) => {handleLoserWinnerChange(e,value, false)}}
                            value={loser}
                            getOptionLabel={options => options.name}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Defeated" />}
                        />
                        {/* Looser score */}
                        <input type="text" name="set1_loser" className='setBox' 
                            onChange={(e) => {handleSetChange(e, 'L1')}}></input>
                        <input type="text" name="set2_loser" className='setBox' 
                            onChange={(e) => {handleSetChange(e, 'L2')}}></input>
                        <input type="text" name="set3_loser" className='setBox' 
                            onChange={(e) => {handleSetChange(e, 'L3')}}></input>
                        <input type="text" name="set4_loser" className='setBox' 
                            style={{display: (showSet4 ? 'block' : 'none')}} 
                            onChange={(e) => {handleSetChange(e, 'L4')}}></input>
                        <input type="text" name="set5_loser" className='setBox' 
                            style={{display: (showSet5 ? 'block' : 'none')}} 
                            onChange={(e) => {handleSetChange(e, 'L5')}}></input>
                    </label>

                    {/* Submit button */}
                    <button type="submit">Add result</button>
                </>
                : null}
        </form>
    );
};

export { MatchEditor };
