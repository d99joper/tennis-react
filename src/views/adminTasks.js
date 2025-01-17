import { Button, Card, Grid, TabItem, Tabs } from "@aws-amplify/ui-react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ladderAPI, playerAPI } from "api/services";
import { AddPlayerToClub, CreateClub, ErrorHandler, MatchEditor, SelectWithFetch } from "components/forms";
import ClubSearchAutocomplete from "components/forms/Club/club_search";
import { enums, helpers, ladderHelper, matchHelper, userHelper } from "helpers";
import React, { useEffect, useState } from "react";
import XLSX, { read, utils, writeFile } from 'xlsx';

const AdminTasks = (() => {


  const [player, setPlayer] = useState({})
  const [ladders, setLadders] = useState([])
  const [players, setPlayers] = useState([])
  const [ladderId, setLadderId] = useState()
  const [playerId, setPlayerId] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    async function getData() {
      const ladders = await ladderAPI.getLadders()
      //const players = await ladderHelper.GetPlayers()
      //console.log(ladders)
      return { ladders: ladders.ladders, players: [] }
    }
    getData().then((data) => {
      //console.log(data.ladders)
      setLadders(data.ladders)
      setPlayers(data.players)
    })
  }, [])

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
    matchHelper.createMatchesFromArray(matchArray)
  }

  function addPlayer() {
    if (player?.name.length > 3)
      playerAPI.createPlayer(player)
        .then((response) => {
          console.log(response)
          if(response.error) {
            setError(error)
          }
        })
  }

  function addPlayerToLadder() {
    ladderAPI.addPlayerToLadder(playerId, ladderId)
  }

  function onMatchSubmit(e) {
    console.log('match submitted')
  }

  function updateLadder(){
    ladderAPI.updateLadder({id:'35a52e5b-d915-4b84-a4e0-22f2906305a6', match_type: enums.MATCH_TYPE.DOUBLES})
  }

  function handlePlayerChange(value, type) {
    let updatedPlayer = player
    if (type === 'email')
      updatedPlayer.email = value
    if (type === 'name') 
      updatedPlayer.name = value
    setPlayer(updatedPlayer)
  }

  return (
    <>
      <ErrorHandler error={error} />
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
                  ladders={ladders}
                  player={{ id: 0, name: '' }}
                  isAdmin={true}
                  minDate={helpers.setDate(-90)}
                  onSubmit={onMatchSubmit}
                />
              </div>
            </Card>
          </Grid>
        </TabItem>
        <TabItem title="Players">
          <div>
            name: 
            <input type="text" onChange={(e) => { handlePlayerChange(e.target.value,'name') }} 
            />
            email: 
            <input type="text" onChange={(e) => { handlePlayerChange(e.target.value, 'email') }} 
            />
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
              value={ladderId || ''}
              onChange={(e) => { setLadderId(e.target.value) }}>
              {ladders?.map(option => {
                return (
                  <MenuItem key={option.id + '_admin'} value={option.id}>{option.name}</MenuItem>
                )
              })}
            </Select>

          </FormControl>
          <FormControl sx={{ minWidth: 120, width: 300 }}>
            <InputLabel id="select-players-label">Players</InputLabel>
            <SelectWithFetch
              label="Player"
              ladderId={0}
              onPlayerSelect={p => setPlayerId(p)}
            />

          </FormControl>
          <Button onClick={addPlayerToLadder}>Add player to ladder</Button>
        <Button onClick={updateLadder} color="tennis">Update ladder</Button>
        </TabItem>
        <TabItem title="Other">
          <CreateClub />
          <AddPlayerToClub />
          <ClubSearchAutocomplete />
        </TabItem>
      </Tabs>
    </>
  )
})

export default AdminTasks