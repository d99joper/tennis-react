import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Button, Collection, Divider, Grid, Text } from "@aws-amplify/ui-react";
import { Link } from "react-router-dom";
import { ItemCard, Ladder, Ladders } from "components/forms";
import { enums, helpers, ladderFunctions, userFunctions } from "helpers";
import LadderSearch from "./search";
import { Box } from "@mui/system";


const LadderView = (props) => {

    const params = useParams();
    const [isPlayerInLadder, setIsPlayerInLadder] = useState(true)
    const [userId, setUserId] = useState(props.currentUser.id)
    const [playerLadders, setPlayerLadders] = useState([])
    const [nearbyLadders, setNearbyLadders] = useState([])
    const [allowLocation, setAllowLocation] = useState(false)

    //const [isLoggedIn, setIsLoggedIn] = useState(props.isLoggedIn)
    const isLoggedIn = props.isLoggedIn
    const currentUser = props.currentUser
    //console.log(isLoggedIn, currentUser)

    const LadderSearch = () => { return <Link to="/ladders/search" >Search for other ladders</Link> }


    useEffect(() => {
        async function GetUserInfo() {
            const currentUser = await userFunctions.getCurrentlyLoggedInPlayer()
            console.log(currentUser)
            setUserId(currentUser.id)
            setIsPlayerInLadder(await ladderFunctions.IsPlayerInLadder(currentUser.id, params.ladderId))
            //setIsLoggedIn(await userFunctions.CheckIfSignedIn())
        }
        if (params.ladderId && currentUser.id !== -1)
            GetUserInfo()

        async function GetLadders() {
            let excludeList = ['-1']
            if (isLoggedIn) {
                const ladders = await GetPlayerLadders()
                ladders.map(({ id }) => {
                    excludeList.push(id)
                })
                await GetNearByLadders(excludeList)
            }
        }
        async function GetPlayerLadders() {
            const ladders = await ladderFunctions.GetPlayerLadders(currentUser.id)
            setPlayerLadders(ladders)
            return ladders
        }
        async function GetNearByLadders(excludeList) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(x => {
                    // get the ids to exclude
                    ladderFunctions.FindNearByLadders({ lat: x.coords.latitude, lng: x.coords.longitude }, 30, excludeList)
                        .then((ladders) => { setNearbyLadders(ladders); console.log(ladders) })
                    //{ latitude: x.coords.latitude, longitude: x.coords.longitude })
                    setAllowLocation(true)
                });
            } else {
                console.log("Geolocation is not supported by this browser.")
                setAllowLocation(false)
            }
        }

        if (!params.ladderId) {
            // get player ladders
            GetLadders()
            // if (isLoggedIn)
            //     GetPlayerLadders()
        }

    }, [params.ladderId], isPlayerInLadder, userId)

    function joinLadder() {
        console.log('Join ladder')
        ladderFunctions.AddLadderPlayer(userId, params.ladderId).then(() => {
            setIsPlayerInLadder(true)
        })
    }

    if (params.ladderId)
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
                    <LadderSearch />
                </Grid>
            </>
        )
    else if (isLoggedIn) {// no ladderId, so display my ladders
        return (
            <>
                <Grid templateColumns={"1fr 1fr"} templateRows={"1fr 1fr auto 1fr 1fr auto"} gap="1rem">
                    <Text columnStart="1" columnEnd="-1">My Ladders</Text>
                    <Text>Singles</Text>
                    <Text>Doubles</Text>
                    <Ladders 
                        ladders={playerLadders.filter(x => x.matchType === enums.MATCH_TYPE.SINGLES)} 
                        useMatchItems={true} 
                        usePlayerItems={true} 
                    />
                    <Ladders 
                        ladders={playerLadders.filter(x => x.matchType === enums.MATCH_TYPE.DOUBLES)} 
                        useMatchItems={true} 
                        usePlayerItems={true} 
                    />

                    <Grid columnStart="1" columnEnd="-1">
                        <Divider />
                        <Text>Nearby Ladders</Text>
                    </Grid>
                    <Text>Singles</Text>
                    <Text>Doubles</Text>
                    {nearbyLadders.ladders &&
                    <>
                        <Ladders 
                            ladders={nearbyLadders.ladders.filter(x => x.matchType === enums.MATCH_TYPE.SINGLES)} 
                        />
                        <Ladders 
                            ladders={nearbyLadders.ladders.filter(x => x.matchType === enums.MATCH_TYPE.DOUBLES)} 
                        />
                    </>
                    }
                </Grid>

                <p>
                    <LadderSearch />
                </p>
            </>
        )
    }
    else
        return (
            <>
                Nearby ladders <br />
                <LadderSearch />
            </>
        )
}

export default LadderView