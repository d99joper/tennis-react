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
import { MdOutlineSportsTennis } from 'react-icons/md'
import { clubAPI, eventAPI, matchAPI } from 'api/services'
import { Match } from 'components/forms'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { AuthContext } from 'contexts/AuthContext'
const DEFAULT_LOCATION = { lat: 38.5449, lng: -121.7405 };
const CACHE_DURATION_MS = 1000 * 60 * 60; // 1 hour

const Home = ({ homeDataRef }) => {
  const [data, setData] = useState({ clubs: [], matches: [], events: [] });
  //const [loading, setLoading] = useState(!homeDataRef.current);
  const { isLoggedIn } = useContext(AuthContext)

  const [loading, setLoading] = useState({
    clubs: !homeDataRef.current,
    matches: !homeDataRef.current,
    events: !homeDataRef.current,
  })

  const setAllLoading = (state) => {
    setLoading({ clubs: state, matches: state, events: state })
  }

  useEffect(() => {
    const isFresh =
      homeDataRef.current &&
      Date.now() - homeDataRef.current.fetchedAt < CACHE_DURATION_MS;

    if (isFresh) {
      setData(homeDataRef.current.data);
      setLoading(false);
      return;
    }

    const loadData = async (lat, lng) => {
      setAllLoading(true)
      try {
        let filters = {};
        filters.geo = `${lat},${lng},25`;
        const [clubsRes, matchesRes, eventsRes] = await Promise.all([
          clubAPI.getClubs(filters, 1, 5),
          matchAPI.getMatches(filters, 1, 5),
          eventAPI.getEvents(filters, 1, 5),
        ]);
        const freshData  = {
          clubs: clubsRes?.data?.clubs || [],
          matches: matchesRes?.matches || [],
          events: eventsRes?.events || [],
        };
        homeDataRef.current = {
          data: freshData,
          fetchedAt: Date.now()
        }
        setData(freshData );
      } catch (err) {
        console.error('Error loading home page data:', err);
      } finally {
        setAllLoading(false)
      }
    };

    navigator.geolocation.getCurrentPosition(
      pos => loadData(pos.coords.latitude, pos.coords.longitude),
      () => loadData(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng)
    );
  }, [homeDataRef]);

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

  const { clubs, matches, events } = data;
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

      {!isLoggedIn &&
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
      }

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

export default Home;
