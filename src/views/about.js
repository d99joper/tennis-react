import React, { useContext } from 'react';
import { Typography, Box, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from 'contexts/AuthContext';

const AboutPage = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Box>
      <Helmet>
        <title>MyTennis Space</title>
      </Helmet>

      <Typography variant="h4" gutterBottom>
        Welcome to My Tennis Space!
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Looking to swing your racket, meet fellow tennis players, and make new connections?
        My Tennis Space is your hub for storing your match history, tracking stats, and finding local players to hit with.
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Join a local club or sign up for a league to get real match play and meet players at your skill level.
        Whether you're just getting started or a seasoned competitor, there's a spot for you in our community.
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        We're building a platform to make tennis more social, accessible, and competitive — all at the same time.
        So grab your racket and let's hit the court!
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        See you out there!
      </Typography>

      {!isLoggedIn && (
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
      )}
    </Box>
  );
};

export default AboutPage;
