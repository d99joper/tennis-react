import { Grid } from "@aws-amplify/ui-react";
import { ladderFunctions as lf } from "helpers";
import React, { useEffect, useState } from "react";
import { Matches } from "../../forms/index.js"
import './Ladder.css'

const Ladder = ({
    id,
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
    }, [])

    return (
        <Grid
            templateColumns={'1fr 1fr'}
        >
            {ladder &&
                <>
                    <div id='standing'>
                        {ladder && <div>standings</div>}
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