import React, { useEffect, useState } from 'react'
import { Box, Typography, CircularProgress, Switch } from '@mui/material'
import { Link } from 'react-router-dom'
import { MdLeaderboard } from 'react-icons/md'

const PlayerLeagues = ({ player, showRank = true, showWinLoss = false, showRating = false }) => {
  const [activeLeagues, setActiveLeagues] = useState([])
  const [archivedLeagues, setArchivedLeagues] = useState([])
  const [showArchivedEvents, setShowArchivedEvents] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!player) return
    let newActiveLeagues = []
    let newArchivedLeagues = []
    player.events?.active_events?.league?.map(league => newActiveLeagues.push(league))
    player.events?.active_events?.multievent?.map(event => newActiveLeagues.push(event))
    player.events?.archived_events?.league?.map(league => newArchivedLeagues.push(league))
    setActiveLeagues(newActiveLeagues)
    setArchivedLeagues(newArchivedLeagues)
    setLoaded(true)
  }, [player])

  if (!loaded) return <CircularProgress size={16} />

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <MdLeaderboard /> Active Leagues
      </Typography>
      {activeLeagues.length > 0 ?
        activeLeagues.map((league) => (
          <Box key={league.id} sx={{ pl: 1, mb: 1 }}>
            <Link to={`/events/${league.slug}`}>
              {/* <Typography variant="body2"> */}
              <Typography variant="body1" fontWeight="bold">
                {league.name}
              </Typography>
            </Link>
          </Box>
        ))
        : <Typography sx={{ pl: 1, mb: 1 }}>You are not part of any current leagues</Typography>
      }
      {archivedLeagues.length > 0 &&
        <>
          <Switch checked={showArchivedEvents} onChange={() => setShowArchivedEvents(!showArchivedEvents)} />
          Show Archived leagues ({archivedLeagues.length})
        </>
      }
      {showArchivedEvents &&
        archivedLeagues.map((league) => (
          <Box key={league.id} sx={{ pl: 2, mb: 1 }}>
            <Link to={`/events/${league.slug}`}>
              {/* <Typography variant="body2"> */}
              <Typography variant="body1" fontWeight="bold">
                {league.name}
              </Typography>
            </Link>
          </Box>
        ))
      }
    </Box>
  )
}

export default PlayerLeagues
