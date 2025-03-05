import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material'
import { Helmet } from 'react-helmet-async';


const RulesPage = () => {
  return (
    <div className="rules-container" style={{ maxWidth: '500px' }}>
      <Helmet>
        <title>Rules | MyTennis Space</title>
      </Helmet>
      <Typography variant="h4" gutterBottom>
        Rules
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Scheduling"
            secondary="Once challenged, the players should try to find a match time and location within two
            weeks of the challenge date."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Location"
            secondary="You can play your match on any courts you agree upon. No player can be forced to
            pay a court fee if public courts are available. If you agree to pay for court time,
            the fee should be split between the players (unless otherwise agreed).   
            If the players cannot agree on a court, the challenged player has preference, 
            though a compromise is always preferable."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Match formats"
            secondary="Basically, we want you to choose a match format that fits you and your opponent best. 
            You can do best-of-three sets with a full third set or a third set tie-break. If you are short on 
            time, you can play a single pro-set to 10 or 8 games. We also offer fast 4 matchformats with best 
            out of 3 or 5 sets."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Fresh balls"
            secondary="Both players bring a can of balls each. 
            The winner keeps the unopened can, while the loser gets the used balls."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Ranking Points"
            secondary="The winner always gets 20p for a win, while the opponent gets 1p per game won. 
            In addition, if the winner had fewer initial points than their opponent, the winner also receive the 
            same amount as the opponent's initial points. For example, Player A initially had 10p, while player B
            had 40p, initially. Player A wins over Player B with 6-4, 6-3. After the match, Player A
            will get the same amount of points as B's inital points, plus 20p, equaling 60p, while Player B will retain their 40p and add another 7 points for the games won,
            equaling 47p."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Sportsmanship"
            secondary="You call your side of the court and your opponent calls their side. 
            Be fair with your calls. We're all out there to have fun."
          />
        </ListItem>
      </List>
    </div>
  );
};

export default RulesPage;
