import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { eventAPI } from 'api/services';
import TournamentBracket from 'components/forms/Tournament/bracket';

const TournamentViewPage = ({ event: initialEvent }) => {
  const { id } = useParams();
  const [event, setEvent] = useState(initialEvent || null);
  const [bracket, setBracket] = useState(
    initialEvent?.tournament_bracket || initialEvent?.tournament?.bracket || null
  );

  useEffect(() => {
    if (event) return; // already have event from props
    const fetchEvent = async () => {
      try {
        const e = await eventAPI.getEvent(id);
        setEvent(e);
        setBracket(e.tournament_bracket || e.tournament?.bracket);
      } catch (err) {
        console.error('Error loading tournament', err);
      }
    };
    fetchEvent();
  }, [id, event]);

  if (!event) return <CircularProgress />;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        {event.name}
      </Typography>
      {event.club && (
        <Typography variant="body1" sx={{ mb: 2 }}>
          Hosted by <Link to={'/clubs/' + event.club.slug}>{event.club.name}</Link>
        </Typography>
      )}
      {event.description && (
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {event.description}
        </Typography>
      )}

      <TournamentBracket bracket={bracket} />
    </Box>
  );
};

export default TournamentViewPage;
