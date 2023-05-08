import { Button, Grid, Loader, TabItem, Tabs, View } from "@aws-amplify/ui-react";
import { enums, helpers, ladderFunctions as lf, matchFunctions, userFunctions } from "helpers";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Ladder.css'
import { Modal, Typography, Table, TableHead, TableCell, TableBody, Avatar, TableRow, CardHeader, Box, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, TextField } from "@mui/material"
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { GiSwordsPower, GiTennisRacket } from "react-icons/gi";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { MdOutlineSms } from "react-icons/md";
import { Storage } from "aws-amplify";
import { Matches } from "../../forms/index.js"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import Modal from "components/layout/Modal/modal.js";
// import { Modal, ModalClose, ModalDialog, Sheet } from "@mui/joy";

const Ladder = ({
    id,
    isPlayerInLadder,
    loggedInPlayerId,
    currentUser = null,
    ...props
}) => {

    const MatchEditor = lazy(() => import("../../forms/index") //MatchEditor/MatchEditor")
        .then(module => { return { default: module.MatchEditor } }))

    const [ladder, setLadder] = useState()
    const [matches, setMatches] = useState({ nextToken: null, matches: [] })
    const [player, setPlayer] = useState()
    const [showChallangeModal, setShowChallangeModal] = useState(false)
    const [showAddMatchModal, setShowAddMatchModal] = useState(false)
    const [nextMatchesToken, setNextMatchesToken] = useState()
    const [displayedStandings, setDisplayedStandings] = useState()
    const [standingsAsOfDate, setStandingsAsOfDate] = useState()

    async function setPlayerImages(details) {
        if (typeof details === "string")
            details = JSON.parse(details)

        return await Promise.all(details.map(async (s, i) => {
            if (s.player?.image) {
                // set the image 
                await Storage.get(s.player.image).then(data => {
                    s.player.imageUrl = data
                })
            }
            return s
        }))
    }
    // get latest standing
    useEffect(() => {
        async function getLadder() {
            const l = await lf.GetLadder(id, nextMatchesToken)
            //console.log(l)
            // parse the details JSON and set player images
            l.standings.details = await setPlayerImages(l.standings.details)
            return l
        }

        getLadder().then((data) => {
            // only refresh the ladder data if there is no nextMatchToken (meaining we've never fetched more matches)
            if (!nextMatchesToken) {
                setLadder(data)
                setDisplayedStandings(data.standings)
            }
            setMatches(oldMatches => ({ nextToken: data.matches.nextToken, matches: [...oldMatches.matches, ...data.matches.matches] }))
            console.log(data)
        })
    }, [isPlayerInLadder, id, nextMatchesToken])

    // function handleDisplayedStandings(ladder, standings) {
    //     // find the correct cur standings in prev standings
    //     let currentStandingIndex = ladder.previousStandings.findIndex(x => x.id == standings.id)
    //     if (currentStandingIndex === -1) {
    //         ladder.previousStandings.push(standings)
    //         currentStandingIndex = ladder.previousStandings.findIndex(x => x.id == standings.id)
    //     }
    //     ladder.previousStandings[currentStandingIndex] = standings
    //     return ladder.previousStandings[currentStandingIndex]
    // }

    useEffect(() => { }, [])

    function addMatches(nextToken) {
        const compareToken = nextMatchesToken ?? ''
        console.log(nextToken.substring(0, 40), compareToken.substring(0, 40))
        if (compareToken == nextToken) return
        else {
            console.log('not equal')
            setNextMatchesToken(nextToken)
        }
        return
    }

    // async function updateDisplayedStandings(standings) {
    //     if (!standings.details) {
    //         console.log(standings)
    //         standings = await lf.GetStandingsDetails(standings.id)
    //         standings.details = await setPlayerImages(standings.details)
    //     }

    //     setDisplayedStandings(handleDisplayedStandings(ladder, standings))
    // }

    async function updateDisplayedStandings2(date) {
        let standings = await lf.GetStandingsForDate(ladder.id, date, true)
        if (typeof standings.details === "string") {
            standings.details = JSON.parse(standings.details)
            standings.details = await setPlayerImages(standings.details)
        }
        standings.details = standings.details.sort((a, b) => { return b.points - a.points })
        //setDisplayedStandings(handleDisplayedStandings(ladder, standings))
        setDisplayedStandings(standings)
    }

    // function handleStandingsChange(e) {
    //     console.log(e.target.value)
    //     let standings = e.target.value
    //     updateDisplayedStandings(standings)
    // }
    function handleStandingsChange2(date) {
        console.log(date)
        updateDisplayedStandings2(date)
    }

    function handleAddMatch(match) {
        console.log(match)
        console.log(ladder)
        console.log(matches)
        setMatches(oldMatches => ({ matches: [...oldMatches.matches, { match: match }] }))
        setLadder(prevLadder => ({ ...prevLadder, matches: { matches: [...prevLadder.matches.matches, { match: match }] } }))
        setShowAddMatchModal(false)
        // show the details from todays date
        updateDisplayedStandings2(Date.now())
    }

    function handleChallenge(playerId) {
        // get the player details
        userFunctions.getPlayer(playerId).then((data) => {
            // set the player data
            console.log(data)
            setPlayer(data)
            // display a modal with details
            setShowChallangeModal(true)
        })
    }

    return (
        <Grid
            templateRows={'1fr auto'}
            gap={20}
        >
            <View columnStart="1" columnEnd="-1">
                <Typography variant="h4">{ladder?.name}</Typography>
                <Typography variant="caption">{ladder?.description}</Typography>
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
                        <Grid
                            templateColumns={'2fr 1fr'}
                            gap={20}
                        >
                            <Table height="1px">
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Wins</TableCell>
                                        <TableCell>Losses</TableCell>
                                        <TableCell>Points</TableCell>
                                        {isPlayerInLadder && <TableCell>Challenge</TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {displayedStandings?.details.map((s, i) => {
                                        return (
                                            <TableRow id='standing' key={i} hover>
                                                <TableCell width="1px"><Typography variant="h6">{i + 1}.</Typography></TableCell>
                                                <TableCell key={s.player.id}>
                                                    <Link to={`../../profile/${s.player.id}`}>
                                                        <CardHeader sx={{ padding: 0 }}
                                                            avatar={<Avatar {...userFunctions.stringAvatar(s.player, 50)} />}
                                                            title={s.player.name}
                                                        />
                                                    </Link>
                                                </TableCell>
                                                <TableCell>{s.wins ?? 0}</TableCell>
                                                <TableCell>{s.losses ?? 0}</TableCell>
                                                <TableCell>{`${s.points}p`}</TableCell>
                                                {
                                                    isPlayerInLadder && loggedInPlayerId !== s.player.id &&
                                                    <TableCell align="center">
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
                            {/* Make this a grid and add "Add Match in the middle" */}
                            <Grid
                                id='matches'
                                templateRows={"auto"}
                                textAlign='left' paddingRight='1rem' >
                                <FormControl variant="standard" sx={{ m: 1, minWidth: 120, paddingBottom: '2rem' }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Standings as of"
                                            required
                                            maxDate={Date.now()}
                                            value={standingsAsOfDate}
                                            onChange={(newValue) => {
                                                setStandingsAsOfDate(newValue)
                                                handleStandingsChange2(newValue.$d)
                                            }}
                                            renderInput={(params) => <TextField required {...params} sx={{ width: 200 }} />}
                                        />
                                    </LocalizationProvider>
                                    {/* <Select
                                        value={displayedStandings}
                                        onChange={(e) => handleStandingsChange(e)}
                                        labelId="demo-simple-select-standard-label"
                                        variant="standard"
                                    >
                                        {ladder?.previousStandings.length && ladder?.previousStandings.map((s, i) => {
                                            //const postedOn = Date(s.postedOn).toISOString().split('T')[0]
                                            const postedOn = s.postedOn.split('T')[0]
                                            if (postedOn == "1900-01-01") return
                                            return (
                                                <MenuItem key={i} value={s}>
                                                    {postedOn}
                                                </MenuItem>
                                            )
                                        })}
                                    </Select> */}
                                </FormControl>
                                <View>
                                    <Button variation="primary" onClick={() => setShowAddMatchModal(true)}>Add a match</Button>
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
                                <View>
                                    <Typography variant="subtitle1">Lastest matches</Typography>
                                    <Matches
                                        ladderMatches={ladder.matches}
                                        key="last5Matches"
                                        displayAs={enums.DISPLAY_MODE.SimpleList}
                                        onAddMatches={() => { console.log('add matches click') }}
                                        limit="10"
                                    />
                                </View>
                            </Grid>
                        </Grid>
                    }
                </TabItem>
                <TabItem title="Matches">
                    <Matches
                        ladderMatches={matches}
                        excludeColumns={['ladder']}
                        useColorCode={false}
                        sortDirection={'desc'}
                        sortingField={"match.playedOn"}
                        onAddMatches={addMatches}
                    />
                </TabItem>
            </Tabs>
        </Grid>
    )
}

export { Ladder };