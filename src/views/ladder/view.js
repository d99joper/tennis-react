import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Button, Grid } from "@aws-amplify/ui-react";
import { Link } from "react-router-dom";
import { Ladder } from "components/forms";
import { ladderFunctions, userFunctions } from "helpers";


const LadderView = () => {

    const params = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState()
    const [ladder, setLadder] = useState()

    console.log(params)
    useEffect(() => {
        const loggedIn = async () => {
            return await userFunctions.CheckIfSignedIn()
        }
        setIsLoggedIn(loggedIn)

    }, [params.id])

    function joinLadder() {
        console.log('Join ladder')
    }
    return (
        <>
            <Button onClick={joinLadder}>Join this ladder</Button>
            <Grid
                templateRows={'1fr auto'}
            >
                {/* display the ladder */}
                {params.ladderId &&
                    <div style={{ minHeight: '300px' }}>
                        <Ladder id={params.ladderId} />
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