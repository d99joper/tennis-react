import { Grid, TabItem, Tabs, Text, View } from "@aws-amplify/ui-react";
import { enums, ladderFunctions as lf, matchFunctions, userFunctions } from "helpers";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Matches } from "../../forms/index.js"
import './Ladder.css'
import { Modal, Typography, Table, TableHead, TableCell, TableBody, Avatar, TableRow, CardHeader, Box, Select, MenuItem } from "@mui/material"
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { GiSwordsPower, GiTennisRacket } from "react-icons/gi";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { MdOutlineSms } from "react-icons/md";
// import Modal from "components/layout/Modal/modal.js";
// import { Modal, ModalClose, ModalDialog, Sheet } from "@mui/joy";

const Ladder = ({
    id,
    isPlayerInLadder,
    ...props
}) => {

    const [ladder, setLadder] = useState()
    const [matches, setMatches] = useState({ nextToken: null, matches: [] })
    const [player, setPlayer] = useState()
    const [showModal, setShowModal] = useState(false)
    const [nextMatchesToken, setNextMatchesToken] = useState()
    const previousStandings = [{id:'1', createdOn: '2023-04-13'}]

    // get latest standing
    useEffect(() => {
        async function getLadder() {
            const l = await lf.GetLadder(id, nextMatchesToken)
            //console.log(l)
            return l
        }
        getLadder().then((data) => {
            // only refresh the ladder data if there is no nextMatchToken (meaining we've never fetched more matches)
            if (!nextMatchesToken)
                setLadder(data)
            setMatches(oldMatches => ({ nextToken: data.matches.nextToken, matches: [...oldMatches.matches, ...data.matches.matches] }))
            console.log(data)
        })
    }, [isPlayerInLadder, id, nextMatchesToken])

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

    function handleChallenge(playerId) {
        // get the player details
        userFunctions.getPlayer(playerId).then((data) => {
            // set the player data
            console.log(data)
            setPlayer(data)
            // display a modal with details
            setShowModal(true)
        })
    }
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    return (
        <Grid
            templateRows={'1fr auto'}
            gap={20}
        >
            <View columnStart="1" columnEnd="-1">
                <Typography variant="h4">{ladder?.name}</Typography>
                <Typography variant="caption">{ladder?.description}</Typography>
                <Modal
                    onClose={() => setShowModal(false)}
                    open={showModal}
                    aria-labelledby={`Challenge ${player?.name}`}
                    aria-describedby="Challenge another player to a match"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={'1rem'}>
                            {`Challenge ${player?.name}`}
                        </Typography>
                        <Typography variant="body1">
                            You can challange {player?.name} by
                            <View marginLeft={'1rem'}>
                                {player?.phone && <div><a href={`tel:+${player?.phone}`}><AiOutlinePhone /> {player?.phone}</a></div>}
                                {player?.phone && <div><a href={`sms:+${player?.phone}?&body=Hi ${player?.name.split(' ')[0]}!%20I'd%20like%20to%20challange%20you%20to%20a%20ladder%20match`}><MdOutlineSms /> {player?.phone}</a></div>}
                                
                                <div><a href={`mailto:${player?.email}`}><AiOutlineMail /> {player?.email}</a></div>
                            </View>
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
                                    {JSON.parse(ladder?.standings?.details).map((s, i) => {
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
                                                {isPlayerInLadder &&
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

                            <View textAlign='left' paddingRight='1rem' id='matches'>
                                <Box paddingBottom={'2rem'}>
                                    <Typography variant="subtitle1">Previous Standings</Typography>
                                    <Select value={'1'}>
                                        {previousStandings.map((s) => {return <MenuItem value={s.id}>{s.createdOn}</MenuItem>})}
                                    </Select>
                                </Box>
                                <Typography variant="subtitle1">Last 5 matches</Typography>
                                <Matches
                                    ladderMatches={ladder.matches}
                                    key="last5Matches"
                                    displayAs={enums.DISPLAY_MODE.SimpleList}
                                    onAddMatches={() => { console.log('add matches click') }}
                                    limit="5">
                                </Matches>
                            </View>
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