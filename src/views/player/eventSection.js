import React from 'react'
import { Divider, Grid2 as Grid } from "@mui/material"
import PlayerLadders from './playerLadders'
import PlayerLeagues from './playerLeagues'
import PlayerTournaments from './playerTournaments'

const EventSection = ({ player }) => {
  return (
    <Grid container>
      <Grid size={{xs:12, md:6}}>
        <PlayerLeagues player={player} showWinLoss={true} showRating={true} />
        <Divider sx={{ m: 2 }} />
        <PlayerTournaments player={player} showWinLoss={true} showRating={true} />
      </Grid>
      <Grid size={{xs:12, md:6}}>
      <PlayerLadders playerId={player.id} showWinLoss={true} showRating={true} />
      </Grid>
    </Grid>
  )
}

export default EventSection