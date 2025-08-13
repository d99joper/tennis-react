import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography, CircularProgress } from '@mui/material'
import { eventAPI } from 'api/services'

const TournamentViewPage = () => {
  const { slug } = useParams()
  const [event, setEvent] = useState(null)

  useEffect(() => {
    async function fetchEvent() {
      const e = await eventAPI.getEventBySlug(slug)
      setEvent(e)
    }
    fetchEvent()
  }, [slug])

  if (!event) return <CircularProgress />

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4">{event.name}</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>{event.description}</Typography>

      {/* TODO: Render bracket here */}
      <pre>{JSON.stringify(event.tournament_bracket, null, 2)}</pre>
    </Box>
  )
}

export default TournamentViewPage
