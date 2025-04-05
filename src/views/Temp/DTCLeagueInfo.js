import React from 'react'
import { Box, Typography, Button, Card, CardContent, CardMedia, List, ListItem, ListItemText, Link, Paper } from '@mui/material'
import { GiTennisCourt } from 'react-icons/gi'
import { AiOutlineMessage } from 'react-icons/ai'

export default function DTCLeagueInfoPage() {
  return (
    <Paper sx={{ maxWidth: 800, mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Free Local Leagues for DTC Members!
      </Typography>

      <Typography variant="body1" gutterBottom>
        We're excited to announce that <strong>Davis Tennis Club</strong> is launching free local league play for all members! Whether you're a beginner or an advanced player, there's a league for you.
      </Typography>

      <Typography variant="h6" gutterBottom>
        Joining is as easy as 1, 2, 3:
      </Typography>

      <List>
        <ListItem>
          <ListItemText
            primary={
              <Typography>1. Create your account&nbsp;
                <Link href="https://mytennis.space/registration" target="_blank" rel="noopener">
                  here
                </Link>
              </Typography>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <Typography>
                2. Apply to join the&nbsp;
                <Link href="https://mytennis.space/clubs/481b72af-ed72-419a-826f-ab986dd24f0c" target="_blank" rel="noopener">
                  Davis Tennis Club
                </Link>
              </Typography>}

          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="3. Once approved, join the league that matches your skill level, by clicking the league and then the join button"
          />
        </ListItem>
      </List>

      <Typography variant="body1" sx={{ mt: 2 }}>
        Leagues will begin as soon as they fill up — or no later than <strong>April 12th</strong>. Sign up today!
      </Typography>

      <Typography variant="body1" sx={{ mt: 2 }}>
        <strong>Note:</strong> Membership with the Davis Tennis Club is required to participate.
        <br />
        <Link href="https://davistennisclub.org/membership" target="_blank" rel="noopener">
          Sign up for DTC Membership here
        </Link>
      </Typography>

      <Typography variant="body1" sx={{ mt: 3 }}>
        Got questions? I'm happy to help.
        <br />
        Message me, <AiOutlineMessage
          color='green'
          size={25}
        />, through my profile here: &nbsp;
        <Link href="https://mytennis.space/players/319ae6e1-e7c7-4f54-b770-99176f774a89" target="_blank" rel="noopener">
          Jonas Persson
        </Link>
        <br />
        or email me at: <Link href="mailto:leagues@davistennisclub.org">leagues@davistennisclub.org</Link>
      </Typography>

      <Typography variant="h6" sx={{ mt: 4 }}>
        Come for the fun, competition, and community — and maybe even take home a trophy! 🏆
      </Typography>
    </Paper >
  )
}
