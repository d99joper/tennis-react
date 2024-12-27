import { Button, Grid, Loader, TabItem, Tabs, View } from "@aws-amplify/ui-react";
import { enums, helpers, ladderHelper, userHelper } from "helpers"
import React, { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Ladder.css'
import { Modal, Typography, Table, TableHead, TableCell, TableBody, Avatar, TableRow, CardHeader, Box, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, TextField, CircularProgress } from "@mui/material"
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { GiSwordsPower, GiTennisRacket } from "react-icons/gi"
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai"
import { MdOutlineSms } from "react-icons/md"
import { Storage } from "aws-amplify"
import { Matches, ProfileImage } from "../../forms/index.js"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { eventAPI, ladderAPI, matchAPI, playerAPI } from "api/services";
// import Modal from "components/layout/Modal/modal.js";
// import { Modal, ModalClose, ModalDialog, Sheet } from "@mui/joy";

const Ladder = ({
  id,
  loggedInPlayerId,
  isLoggedIn,
  currentUser = null,
  ...props
}) => {

  const MatchEditor = lazy(() => import("../../forms/index") //MatchEditor/MatchEditor")
    .then(module => { return { default: module.MatchEditor } }))

  const [ladder, setLadder] = useState()
  //const [matches, setMatches] = useState({ nextToken: null, matches: [] })
  const [player, setPlayer] = useState()
  const [isPlayerInLadder, setIsPlayerInLadder] = useState()
  const [showChallangeModal, setShowChallangeModal] = useState(false)
  const [showAddMatchModal, setShowAddMatchModal] = useState(false)
  //const [nextMatchesToken, setNextMatchesToken] = useState()
  const [displayedStandings, setDisplayedStandings] = useState()
  const [standingsAsOfDate, setStandingsAsOfDate] = useState()
  const [showProfileClickOptions, setShowProfileClickOptions] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(0)
  const [loadingPlayer, setLoadingPlayer] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

console.log('ladder')
  
const toggleProfileLink = (id) => {
    console.log(id)
    if (id != selectedPlayer)
      setShowProfileClickOptions(true)
    else
      setShowProfileClickOptions(!showProfileClickOptions)
    setSelectedPlayer(id)
  }

  // async function setPlayerImages(standings) {

  //   return await Promise.all(standings.map(async (s, i) => {
  //     await userHelper.SetPlayerImage(s.player)
  //     return s
  //   }))
  // }
  // get latest standing
  useEffect(() => {
    setIsLoading(true)
    async function getLadder() {
      //const l = await lf.GetLadder(id)//, nextMatchesToken)
      //const l = await ladderAPI.getLadder(id)
      try {

        const event = await eventAPI.getEvent(id)
        // get the 5 latest matches for the ladder
        // const matchData = await matchAPI.getMatchesForEvent(event.id, 1, 5)
        // event.matches = matchData.matches
        console.log(event)
        return event
      }
      catch(e){
        console.log(e)
      }
      //l.totalCount = matchData.totalCount
      // parse the details JSON and set player images
      //l.standings = await setPlayerImages(l.standings)

    }

    getLadder().then((data) => {
      setLadder(data)
      setDisplayedStandings(data.ladder_standings)
      // check if the user is part of the ladder
      const isInLadder = ladderHelper.IsPlayerInLadder(currentUser?.id, data.ladder_standings)
      setIsPlayerInLadder(isInLadder)
      setIsLoading(false)
    })

  }, [id])

  function addMatches(nextToken) {
  }

  function handleAddMatch(match) {
    // console.log(match)
    // console.log(ladder)
    //console.log(matches)
    //setMatches(oldMatches => ({ matches: [...oldMatches.matches, { match: match }] }))
    ladderAPI.getLadder(ladder.id).then((l) => {
      console.log(l, match)
      setLadder((prevLadder) => ({ ...l, matches: { matches: [...prevLadder.matches.matches, match] } }))
      setDisplayedStandings(l.standings)
      setShowAddMatchModal(false)
    })
    // show the details from todays date
    //updateDisplayedStandings2(Date.now())
  }

  function handleChallenge(playerId) {

    // display a modal with details
    setShowChallangeModal(true)
    if (!player || playerId != player.id) {
      setPlayer({})
      // Start loading player data
      setLoadingPlayer(true)
      // userHelper.getPlayer(playerId).then((data) => {
      playerAPI.getPlayer(playerId).then((data) => {
        // set the player data
        console.log(data)
        setPlayer(data)
        // Stop loading player data
        setLoadingPlayer(false)
      })
    }
  }

  function joinLadder() {
    console.log('Join ladder')
    ladderAPI.addPlayerToLadder(currentUser?.id, ladder.id).then(() => {
      setIsPlayerInLadder(true)
      ladderAPI.getLadder(ladder.id).then((data) => {
        setLadder(data)
        setDisplayedStandings(data.standings)
      })
    })
  }

  return (
    <div>
      {(isLoggedIn && !isPlayerInLadder) &&
        <Button onClick={joinLadder}>Join this ladder</Button>
      }
      <View columnStart="1" columnEnd="-1">
        <Typography variant="h4">{ladder?.name}</Typography>
        <Typography variant="caption">{ladder?.description}</Typography>
        {/** Profile click challenge Modal */}
        <Modal
          onClose={() => setShowChallangeModal(false)}
          open={showChallangeModal}
          aria-labelledby={`Challenge ${player?.name}`}
          aria-describedby="Challenge another player to a match"
        >
          <Box sx={helpers.modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={'1rem'}>
              {`Challenge ${player?.name}`}
            </Typography>
            <Typography variant="body1" width={350}>
              Contact {player?.name} to schedule a match at a time and place that works for both of you.
            </Typography>
            <Typography marginTop={'1rem'} marginBottom={'1rem'} >
              You can challange {player?.name.split(' ')[0]} by
            </Typography>
            {/* Render the spinner while loadingPlayer is true */}
            {loadingPlayer && (
              <div className="spinner">
                <CircularProgress size={50} />
              </div>
            )}
            <Typography component={'div'} paddingLeft={'1rem'}>
              {player?.phone && <div><a href={`tel:+${player?.phone}`}><AiOutlinePhone /> {player?.phone}</a></div>}
              {player?.phone && <div><a href={`sms:+${player?.phone}?&body=Hi ${player?.name.split(' ')[0]}!%20I'd%20like%20to%20challange%20you%20to%20a%20ladder%20match`}><MdOutlineSms /> {player?.phone}</a></div>}
              <div><a href={`mailto:${player?.email}`}><AiOutlineMail /> {player?.email}</a></div>
            </Typography>
          </Box>
        </Modal>
      </View>
      <Tabs>
        <TabItem title="Standings">
          {ladder &&
            <div gap={10} id="ladderGrid">
              <div className="left">
                <div className="header">
                  {/** Add a match button and dialog */}
                  <View className="matchButton">
                    {isPlayerInLadder &&
                      <Button variation="primary" onClick={() => setShowAddMatchModal(true)}>Add a match</Button>
                    }
                    <Dialog
                      onClose={() => setShowAddMatchModal(false)}
                      open={showAddMatchModal}
                      aria-labelledby={`Add a match`}
                      aria-describedby="Add a new match"
                      padding={'1rem'}
                    >
                      <DialogTitle>Add a new match</DialogTitle>
                      <Box padding={'1rem'}>
                        <Suspense fallback={<h2><Loader />Loading...</h2>}>
                          <MatchEditor
                            ladderId={ladder.id}
                            player={currentUser}
                            onSubmit={(m) => handleAddMatch(m)}
                          />
                        </Suspense>
                      </Box>
                    </Dialog>
                  </View>
                </div>
                {isLoading === true ? <CircularProgress size={200} /> :
                  /** STANDINGS table */
                  < Table height="1px" id="standingsTable">
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Wins</TableCell>
                        <TableCell>Losses</TableCell>
                        <TableCell>Points</TableCell>
                        {isPlayerInLadder &&
                          <TableCell className="desktop-only limit-width">
                            Challenge
                          </TableCell>}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ladder?.ladder_standings?.map((s, i) => {
                        return (
                          <TableRow id='standing' key={i} hover>
                            <TableCell width="1px"><Typography variant="h6">{i + 1}.</Typography></TableCell>
                            <TableCell key={s.player.id} className="cursorHand" onClick={e => { toggleProfileLink(s.player.id) }}>
                              {/* <Link to={`../../profile/${s.player.id}`}> */}
                              <CardHeader sx={{ padding: 0 }}
                                //avatar={<Avatar {...userHelper.stringAvatar(s.player, 50)} />}
                                avatar={<ProfileImage player={s.player} size={50} />}
                                title={s.player.name}
                              />
                              {showProfileClickOptions && selectedPlayer === s.player.id && (
                                <div className="options">
                                  <Link to={`../../profile/${s.player.id}`}>Go to profile</Link>
                                  <Link onClick={(e) => { e.stopPropagation(); handleChallenge(s.player.id) }}>Challenge</Link>
                                </div>
                              )}
                              {/* </Link> */}
                            </TableCell>
                            <TableCell>{s.wins ?? 0}</TableCell>
                            <TableCell>{s.losses ?? 0}</TableCell>
                            <TableCell>{`${s.points}p`}</TableCell>
                            {isPlayerInLadder && loggedInPlayerId !== s.player.id &&
                              <TableCell align="center" className="desktop-only limit-width">
                                <GiTennisRacket
                                  size="1.75em"
                                  color="maroon"
                                  className="cursorHand"
                                  onClick={() => handleChallenge(s.player.id)}
                                />
                              </TableCell>
                            }
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                }
              </div>
              {/* Only visable on larger screens */}
              <Grid
                id='matches'
                templateRows={"auto"}
                className="desktop-only"
                textAlign='left'
                paddingRight='1rem'
              >
                <View>
                  <Typography variant="subtitle1">Lastest matches</Typography>
                  <Matches
                    ladderMatches={ladder.matches}
                    key="last5Matches"
                    displayAs={enums.DISPLAY_MODE.SimpleList}
                    onAddMatches={() => { console.log('add matches click') }}
                  />
                </View>
              </Grid>
            </div>
          }
        </TabItem>
        <TabItem title="Matches">
          <Matches
            ladderMatches={ladder?.matches||[]}
            //ladder={ladder}
            excludeColumns={['ladder']}
            useColorCode={false}
            sortDirection={'desc'}
            sortingField={"played_on"}
            onAddMatches={addMatches}
            pageSize={3}
          />
        </TabItem>
      </Tabs>
    </div >
  )
}

export { Ladder };