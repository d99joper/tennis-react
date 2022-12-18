import { TextField } from "@mui/material";
import React, { useState } from "react";

const SetInput = (props) => {

    const [setScore, setSetScore] = useState(props.value)
    const [error, setError] = useState(false)

    const handleSetChange = (e) => {
        setSetScore(formatScore(e.target.value))
    }

    const handleBlur = (e) => {
        let score = formatScore(e.target.value)

        if (!/^\d+ ?- ?\d+$/.test(score))
            setError(true)
        else {
            // get the individual games
            const games = setScore && setScore.match(/\d+/g).map(Number);
            // check if the game score is unreasonable
            if (games[0] > 10 || games[1] > 10)
                setError(true)
            else {
                // this is a legit score
                setError(false)

                // is it a tie-breaker?
                if (Math.abs(games[0] - games[1]) === 1)
                    console.log("show tiebreaker", Math.abs(games[0] - games[1]))
            }
        }
        props.handleBlur(e)
    }

    const formatScore = (score) => { return score.replace(/[^\d- ]/g, '').trim() }

    return (
        <TextField
            label={props.label}
            FormHelperTextProps={{className: "errorText"}}
            onChange={handleSetChange}
            onBlur={handleBlur}
            value={setScore}
            className="setBox"
            id="set-search"
            required={!!props.required}
            error={error}
            helperText={error && "please enter a valid set score"}
            placeholder="X-X">
        </TextField>
    )
}

export default SetInput