import React, { useEffect, useState } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import { Link } from 'react-router-dom'
import { MdLeaderboard } from 'react-icons/md'
import { playerAPI } from 'api/services'
import { GiLadder } from 'react-icons/gi'

const PlayerLadders = ({ playerId, showRank = true, showWinLoss = false, showRating = false }) => {
  const [ladders, setLadders] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!playerId) return
    playerAPI.getLaddersForPlayer(playerId).then((res) => {
      setLadders(res.ladders || [])
      setLoaded(true)
    })
  }, [playerId])

  if (!loaded) return <CircularProgress size={16} />

  if (ladders.length === 0) return null

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <GiLadder /> Ladders
      </Typography>
      {ladders.map((ladder) => (
        <Box key={ladder.ladder_id} sx={{ pl: 1, mb: 1 }}>
          <Link to={`/ladders/${ladder.ladder_slug}`}>
            <Typography variant="body1" fontWeight="bold">
              {ladder.ladder_name}
            </Typography>
          </Link>
          <Typography variant="body2" color="text.secondary">
            {showRank && `Rank #${ladder.ranking}`} 
            {showWinLoss && ` — ${ladder.wins}W / ${ladder.losses}L`} 
            {showRating && ` — Rating: ${ladder.rating?.toFixed?.(1) ?? 'N/A'}`}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

export default PlayerLadders
