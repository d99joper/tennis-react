import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material'

const RulesPage = () => {
  return (
    <div className="rules-container">
      <Typography variant="h4" gutterBottom>
        Rules
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Bring a can of balls each" secondary="The winner keeps the unopened can." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Agree on a match location" secondary="If no agreement, the challenged player has preference." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Call lines on your own half" secondary="Be fair with your calls, we're all out there to have fun." />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Ranking Points"
            secondary="The loser gets 1p per game won. The winner gets 20p. If the winner had fewer initial points, they receive the same amount as the opponent's initial points."
          />
        </ListItem>
      </List>
    </div>
  );
};

export default RulesPage;
