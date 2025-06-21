import React, { useEffect, useState } from 'react'
import { Box, Typography, CircularProgress, Switch } from '@mui/material'
import { Link } from 'react-router-dom'
import { TbTournament } from 'react-icons/tb'
import { playerAPI } from 'api/services'

const PlayerTournaments = ({ player, showRank = true, showWinLoss = false, showRating = false }) => {
  const [activeTournaments, setActiveTournaments] = useState([])
    const [archivedTournaments, setArchivedTournaments] = useState([])
    const [showArchivedEvents, setShowArchivedEvents] = useState(false)
    const [loaded, setLoaded] = useState(false)
  
    useEffect(() => {
      if (!player) return
      let newActiveTournaments = []
      let newArchivedTournaments = []
      player.events?.active_events?.tournament?.map(t => newActiveTournaments.push(t))
      player.events?.archived_events?.tournament?.map(t => newArchivedTournaments.push(t))
      setActiveTournaments(newActiveTournaments)
      setArchivedTournaments(newArchivedTournaments)
      setLoaded(true)
    }, [player])
  
    if (!loaded) return <CircularProgress size={16} />
  
    return (
      <Box sx={{ width: '100%' }}>
        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TbTournament /> Active Tournaments
        </Typography>
        {activeTournaments.length > 0 ?
          activeTournaments.map((t) => (
            <Box key={t.id} sx={{ pl: 1, mb: 1 }}>
              <Link to={`/events/${t.slug}`}>
                {/* <Typography variant="body2"> */}
                <Typography variant="body1" fontWeight="bold">
                  {t.name}
                </Typography>
              </Link>
            </Box>
          ))
          : <Typography sx={{ pl: 1, mb: 1 }}>You are not part of any current tournaments</Typography>
        }
        {archivedTournaments.length > 0 &&
          <>
            <Switch checked={showArchivedEvents} onChange={() => setShowArchivedEvents(!showArchivedEvents)} />
            Show Archived Tournaments ({archivedTournaments.length})
          </>
        }
        {showArchivedEvents &&
          archivedTournaments.map((league) => (
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

export default PlayerTournaments
