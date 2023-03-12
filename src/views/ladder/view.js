import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Button, Grid } from "@aws-amplify/ui-react";
import { Link } from "react-router-dom";
import { Ladder } from "components/forms";
import { ladderFunctions, userFunctions } from "helpers";


const LadderView = () => {

    const params = useParams();
    const [isPlayerInLadder, setIsPlayerInLadder] = useState(false)
    const [userId, setUserId] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)


    useEffect(() => {
        async function GetUserInfo() {
            const currentUser = await userFunctions.getCurrentlyLoggedInPlayer()
            console.log(currentUser)
            setUserId(currentUser.id)
            setIsPlayerInLadder(await ladderFunctions.IsPlayerInLadder(currentUser.id, params.ladderId))
            setIsLoggedIn(await userFunctions.CheckIfSignedIn())
        }
        GetUserInfo()
    }, [params.id], isPlayerInLadder)

    function joinLadder() {
        console.log('Join ladder')
        ladderFunctions.AddLadderPlayer(userId, params.ladderId).then(() => {
            setIsPlayerInLadder(true)
        })
    }
    return (
        <>
            {(isLoggedIn && !isPlayerInLadder) &&
                <Button onClick={joinLadder}>Join this ladder</Button>
            }
            <Grid
                templateRows={'1fr auto'}
            >
                {/* display the ladder */}
                {params.ladderId &&
                    <div style={{ minHeight: '300px' }}>
                        <Ladder id={params.ladderId} isPlayerInLadder={isPlayerInLadder} />
                        {/* join/leave ladder button (if you leave, you lose all your points but obviously keep your matches) */}
                        {/* Maybe this should be on the profile page instead? Or, better here where you can see the ladder? */}


                    </div>
                }
                {/* Search for ladders */}
                <Link to="/ladders/search" >Search for other ladders</Link>
            </Grid>
        </>
    )
}

export default LadderView