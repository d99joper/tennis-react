import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Button } from "@aws-amplify/ui-react";
import { Link } from "react-router-dom";
import { Ladder } from "components/forms";
import { userFunctions } from "helpers";


const LadderView = () => {

    const params = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState()

    useEffect(() => {
        const loggedIn = async () => {
            return await userFunctions.CheckIfSignedIn()
        }
        setIsLoggedIn(loggedIn);
    }, [])

    return (
        <>
            {/* display the ladder */}
            {isLoggedIn &&
                <>
                    <Ladder id={params.ladderId} />
                    {/* join/leave ladder button (if you leave, you lose all your points but obviously keep your matches) */}
                    {/* Maybe this should be on the profile page instead? Or, better here where you can see the ladder? */}
                    {/* <Button onClick={leaveLadder}>Leave this ladder</Button> */}

                    {/* Search for ladders */}
                    <Link to="/ladders/search" >Search for other ladders</Link>
                    <Link to="/ladders/new" >Create new ladder</Link>
                </>
            }
        </>
    )
}

export default LadderView