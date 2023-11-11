import { Button, Card, Grid, TabItem, Tabs } from "@aws-amplify/ui-react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { MatchEditor } from "components/forms";
import { ladderHelper, matchFunctions, userFunctions } from "helpers";
import React, { useEffect, useState } from "react";
import XLSX, { read, utils, writeFile } from 'xlsx';

const AdminTasks = (() => {

    
    const [playerName, setPlayerName] = useState('')
    const [ladders, setLadders] = useState([])
    const [players, setPlayers] = useState([])
    const [ladderId, setLadderId] = useState()
    const [playerId, setPlayerId] = useState()

    useEffect(() => {
        async function getData() {
            const ladders = await ladderHelper.GetLadders()
            const players = await ladderHelper.GetPlayers()

            return {ladders: ladders, players: players}
        }
        getData().then((data) => {
            setLadders(data.ladders)
            setPlayers(data.players)
        })
    },[])

    async function importMatches(e) {
        console.log("import matches")
        const file = e.target.files[0];
        /* get raw data */
        const data = await file.arrayBuffer();
        /* data is an ArrayBuffer */
        const wb = XLSX.read(data);
        //console.log(data, wb)
        /* do something with the workbook here */
        const matchArray = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { raw: false })
        matchFunctions.createMatchesFromArray(matchArray)
    }

    function addPlayer() {
        if (playerName.length > 3)
            userFunctions.createPlayerIfNotExist(playerName)
    }

    function addPlayerToLadder() {
        ladderHelper.AddLadderPlayer(playerId, ladderId)
    }

    function onMatchSubmit(e) {
        console.log('match submitted')
    }

    return (
        <>
            <Tabs padding={'1rem'}
                justifyContent="flex-start">
                <TabItem title="Matches">
                    <Grid gap={'1rem'}
                        templateRows={'1fr auto'}
                    >
                        <Card>
                            <input onChange={importMatches} type="file"></input>Import Matches
                        </Card>
                        <Card>
                            <div>
                                <MatchEditor 
                                    player={{ id: 0, name: '' }} 
                                    isAdmin={true} 
                                    minDate={'2023-01-01'}
                                    onSubmit={onMatchSubmit} 
                                />
                            </div>
                        </Card>
                    </Grid>
                </TabItem>
                <TabItem title="Players">
                    <div>
                        <input type="text" value={playerName} onChange={(e) => { setPlayerName(e.target.value) }} />
                        <Button onClick={addPlayer}>Add Player</Button>
                    </div>
                </TabItem>
                <TabItem title="Player to Ladder" isDisabled={false}>
                    <FormControl sx={{ minWidth: 120, width: 300 }}>
                        <InputLabel id="select-ladders-label">Ladders</InputLabel>
                        
                            <Select
                                labelId='select-ladders-label'
                                label="Ladders"
                                id="ladder-select"
                                value={ladderId}
                                onChange={(e) => { setLadderId(e.target.value) }}>
                                {ladders?.map(option => {
                                    return (
                                        <MenuItem key={option.id+'_admin'} value={option.id}>{option.name}</MenuItem>
                                    )
                                })}
                            </Select>

                    </FormControl>
                    <FormControl sx={{ minWidth: 120, width: 300 }}>
                        <InputLabel id="select-players-label">Players</InputLabel>
                        
                            <Select
                                labelId='select-players-label'
                                label="Players"
                                id="player-select"
                                value={playerId}
                                onChange={(e) => { setPlayerId(e.target.value) }}>
                                {players?.map(option => {
                                    return (
                                        <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                                    )
                                })}
                            </Select>

                    </FormControl>
                    <Button onClick={addPlayerToLadder}>Add player to ladder</Button>
                </TabItem>
            </Tabs>
        </>
    )
})

export default AdminTasks