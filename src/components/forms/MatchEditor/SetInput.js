import { TextField } from "@mui/material";
import React, { useState } from "react";

const SetInput = (props) => {

  const [setScore, setSetScore] = useState(props.value ?? '')
  const [error, setError] = useState(false)

  const handleSetChange = (e) => {
    const newScore = formatScore(e.target.value);
    setSetScore(newScore);
    if (props.onChange)
      props.onChange(newScore);
  }

  const handleBlur = (e) => {
    let score = formatScore(e.target.value)

    if (/^\d+(?:(?!-\d+-)\-\d+)+(\(\d+\))?$/.test(score)) {
      // get the individual games
      const games = setScore && setScore.match(/\d+/g).map(Number);
      // check if the game score is unreasonable
      if (games[0] > 20 || games[1] > 20)
        setError(true)
      else {
        // this is a legit score
        setError(false)

        // is it a tie-breaker?
        if (Math.abs(games[0] - games[1]) === 1)
          console.log("it's a tiebreaker")

        if(props.handleBlur)
          props.handleBlur(score)
      }

    }
    else if (score === "") {
      setError(false)
      if(props.handleBlur)
        props.handleBlur(score)
    }
    else setError(true)
  }

  const formatScore = (score) => { return score.replace(/[^\d-\(\) ]/g, '').trim() }

  return (
    <TextField
      sx={props.sx || null}
      id={props.id}
      label={props.label}
      FormHelperTextProps={{ className: "errorText" }}
      onChange={handleSetChange}
      onBlur={handleBlur}
      //onChange={handleBlur}
      value={setScore}
      className="setBox"
      required={!!props.required}
      error={error}
      helperText={error && "please enter a valid set score"}
      placeholder="X-X"
      inputMode="numeric" />
  )
}

export default SetInput