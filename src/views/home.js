import React, { useContext, useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid2 as Grid,
  CircularProgress,
  Button,
  Stack
} from '@mui/material'
import { MdHome, MdOutlineHome, MdOutlineSportsTennis } from 'react-icons/md'
import { clubAPI, eventAPI, matchAPI } from 'api/services'
import { Match } from 'components/forms'
import { Link } from 'react-router-dom'
import { AuthContext } from 'contexts/AuthContext'
import { Helmet } from 'react-helmet-async'

const DEFAULT_LOCATION = { lat: 38.5449, lng: -121.7405 } // Davis, CA

const Home = ({ player }) => {
  const [clubs, setClubs] = useState([])
  const [matches, setMatches] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState({
    clubs: true,
    matches: true,
    events: true,
  })
  const { isLoggedIn } = useContext(AuthContext)

  const setAllLoading = (state) => {
    setLoading({ clubs: state, matches: state, events: state })
  }

  useEffect(() => {
    const loadData = async (lat, lng) => {
      setAllLoading(true)
      let filter = { lat, lng }

      try {
        const [clubsRes, matchesRes, eventsRes] = await Promise.all([
          clubAPI.getClubs(filter, 1, 5),
          matchAPI.getMatches(filter, 1, 5),
          eventAPI.getEvents(filter, 1, 5),
        ])
        setClubs(clubsRes?.data?.clubs || [])
        setMatches(matchesRes?.matches || [])
        setEvents(eventsRes?.events || [])
      } catch (err) {
        console.error('Error loading homepage data:', err)
        setClubs([])
        setMatches([])
        setEvents([])
      } finally {
        setAllLoading(false)
      }
    }

    if (player?.lat && player?.lng) {
      loadData(player.lat, player.lng)
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          loadData(latitude, longitude)
        },
        (err) => {
          console.warn('Geolocation denied or failed, using default location:', err)
          loadData(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng)
        }
      )
    }
  }, [player])

  const renderSection = (title, data, isLoading, renderItem, emptyText) => (
    <Card>
      <CardHeader title={title} avatar={<MdOutlineSportsTennis />} />
      <Divider />
      <CardContent>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress />
          </Box>
        ) : data.length === 0 ? (
          <Typography>{emptyText}</Typography>
        ) : (
          data.map(renderItem)
        )}
      </CardContent>
    </Card>
  )

  return (
    <Box sx={{ p: 2 }}>
      
      <Helmet>
        <title>MyTennis Space</title>
      </Helmet>

      <Typography variant="h4" gutterBottom>
        🎾 Welcome to My Tennis Space
      </Typography>
      <Typography variant="body1" gutterBottom>
        Store your match stats, meet new tennis players, join local events, and have fun competing!
      </Typography>

      <Stack direction="row" spacing={2}>
          <Button
            component={Link}
            to="/registration"
            variant="contained"
            color="primary"
          >
            Join Now
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            color="primary"
          >
            Log In
          </Button>
        </Stack>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {/* Matches */}
        <Grid size={{ xs: 12, md: 4 }}>
          {renderSection(
            'Latest Matches',
            matches,
            loading.matches,
            match => <Match key={match.id} match={match} variant={'simple'} />,
            'No recent matches found.'
          )}
        </Grid>

        {/* Clubs */}
        <Grid size={{ xs: 12, md: 4 }}>
          {renderSection(
            'Clubs Near You',
            clubs,
            loading.clubs,
            club => (
              <Box key={club.id} sx={{ pb: 2, pt: 2 }}>
                <Link to={`clubs/${club.id}`} variant="subtitle1">{club.name}</Link>
                <Divider />
              </Box>
            ),
            'No nearby clubs found.'
          )}
        </Grid>

        {/* Events */}
        <Grid size={{ xs: 12, md: 4 }}>
          {renderSection(
            'Local Events',
            events,
            loading.events,
            event => (
              <Box key={event.id} sx={{ pb: 2, pt: 2 }}>
                <Link to={`events/${event.id}`} variant="subtitle1">{event.name}</Link>
                <Divider />
              </Box>
            ),
            'No events found near you.'
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Home
