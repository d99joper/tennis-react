import { Grid } from "@aws-amplify/ui-react";
import { ladderFunctions as lf } from "helpers";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Matches } from "../../forms/index.js"
import './Ladder.css'

const Ladder = ({
    id,
    isPlayerInLadder,
    ...props
}) => {

    const [ladder, setLadder] = useState()

    // get latest standing
    useEffect(() => {
        async function getLadder() {
            const l = await lf.GetLadder(id)
            //console.log(l)
            //l.standings = JSON.parse(l.standings)
            return l
        }
        getLadder().then((data) => {
            setLadder(data)
            console.log(data)
        })
    }, [isPlayerInLadder, id])

    return (
        <Grid
            templateColumns={'1fr 1fr'}
        >
            {ladder &&
                <>
                    <div id='standing'>
                        {Object.keys(ladder.standings).length > 0 ? 
                            JSON.parse(ladder.standings.details).map((s,i) => {
                                return (
                                    <div key={s.player.id}>
                                        <Link to={`../../profile/${s.player.id}`}>
                                            {`${i+1}. ${s.player.name} ${s.points}p`}
                                        </Link>
                                    </div>
                                )
                            })
                        : <div>No players</div>}
                    </div>
                    <div id='matches'>
                        <Matches
                            ladderMatches={ladder.matches}
                            limit="10">
                            allowAdd={true}
                        </Matches>
                    </div>
                </>
            }
        </Grid>
    )
}

export { Ladder };