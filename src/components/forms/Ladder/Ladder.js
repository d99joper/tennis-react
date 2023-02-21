import { ladderFunctions as lf } from "helpers";
import React from "react";
import './Ladder.css'

const Ladder = ({
    id, 
    ...props
}) => {

    // get latest standing
    //lf.GetLadderStandings(id)

    // get latest matches (10)
    //lf.GetLadderMatches(id)


    return (
        <>
            Empty ladder
        </>
    )
}

export {Ladder};