import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Ladder, Ladders } from "components/forms";
import { enums } from "helpers";
import { Button, Divider, Grid2, Typography } from "@mui/material";
import { ladderAPI } from "api/services";


const LadderView = (props) => {

  const params = useParams();
  const [userId, setUserId] = useState(props.currentUser?.id)
  const [playerLadders, setPlayerLadders] = useState([])
  const [nearbyLadders, setNearbyLadders] = useState([])
  const [allowLocation, setAllowLocation] = useState(false)
  //const [isLoggedIn, setIsLoggedIn] = useState(props.isLoggedIn)
  const isLoggedIn = props.isLoggedIn
  const currentUser = props.currentUser
  //console.log(isLoggedIn, currentUser)

  const LadderSearch = () => {
    return <Button style={{ marginTop: 15 }} variation="secondary"><Link to="/ladders/search" >Search for more ladders</Link></Button>
  }

  useEffect(() => {
    async function GetUserInfo() {
      // const currentUser = await userHelper.getCurrentlyLoggedInPlayer()
      console.log(currentUser)
      setUserId(currentUser?.id)
      //setIsPlayerInLadder(await ladderFunctions.IsPlayerInLadder(currentUser?.id, params.ladderId))
      //setIsLoggedIn(await userHelper.CheckIfSignedIn())
    }
    if (params.ladderId)//&& currentUser.id !== -1)
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
      const ladders = await ladderAPI.GetPlayerLadders(currentUser?.id)
      setPlayerLadders(ladders)
      return ladders
    }
    async function GetNearByLadders(excludeList) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(x => {
          // get the ids to exclude
          ladderAPI.FindNearByLadders({ lat: x.coords.latitude, lng: x.coords.longitude }, 30, excludeList)
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

  }, [params.ladderId], userId)

  if (params.ladderId)
    return (
      <>
        <Grid2
          templateRows={'1fr auto'}
        >
          {/* display the ladder */}
          {params.ladderId &&
            <div style={{ minHeight: '300px' }}>
              <Ladder id={params.ladderId} isLoggedIn={isLoggedIn} currentUser={currentUser} loggedInPlayerId={userId} />
              {/* join/leave ladder button (if you leave, you lose all your points but obviously keep your matches) */}
              {/* Maybe this should be on the profile page instead? Or, better here where you can see the ladder? */}


            </div>
          }
          {/* Search for ladders */}
          {/* <LadderSearch /> */}
        </Grid2>
      </>
    )
  else if (isLoggedIn) {// no ladderId, so display my ladders
    return (
      <>
        <Grid2 templateColumns={"1fr"} templateRows={"1fr auto 1fr 1fr auto"} gap="1rem">
          <Typography variant="h6">My Ladders</Typography>
          <Ladders
            ladders={playerLadders}
            width={500}
            displayAs={enums.DISPLAY_MODE.Card}
          />

          <Divider />
          <Typography variant="h6">Nearby Ladders</Typography>
          {nearbyLadders.ladders &&
            <Ladders
              ladders={nearbyLadders.ladders}
              width={500}
              displayAs={enums.DISPLAY_MODE.Card}
            />
          }
        </Grid2>

        <LadderSearch />
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