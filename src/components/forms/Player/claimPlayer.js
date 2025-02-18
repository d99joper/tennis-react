import { Box, Button, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import PlayerCard from './playerCard';
import { Link } from 'react-router-dom';
import InfoPopup from '../infoPopup';
import { GiTennisCourt } from 'react-icons/gi';
import Matches from '../Matches/Matches';
import { useState } from 'react';
import { enums } from 'helpers';

export const ClaimPlayer = ({ players, onClaim, onAbort, ...props }) => {

  const [errors, setErrors] = useState({})
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleClick = (noClaim) => {

    // console.log(selectedPlayer, noClaim)
    if(noClaim === true)
      onClaim(null)
    else
      onClaim(selectedPlayer)
  }

  return (
    <Grid container spacing={'0.5rem'}>

      <Typography>
        <b>Is this you?</b> <br />
        The profiles below are not linked to an account.<br />
        If one is you, click to claim it.
      </Typography>
      <Grid size={12} container spacing={'0.5rem'}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        {players.map((p, i) => (
          <Grid key={'playerCard' + i}>
            <PlayerCard
              backgroundColor={'#FAFAFA'}
              player={p}
              selectedPlayer={selectedPlayer}
              setSelectedPlayer={setSelectedPlayer}
              checkboxText={'This is me! '}
              headerAsLink={true}
              openToBlank={true}
            >
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                // justifyContent: 'space-between', // Pushes items to far left and right
                // alignItems: 'center', // Vertically centers the items
                padding: '1rem',
              }} >
                <InfoPopup iconType='custom' size={30} onHoverHighlight={true} color="green" customIcon={
                  <Box
                    sx={{
                      color: 'green',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: '#f50057',
                      },
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <GiTennisCourt size={30} />&nbsp;Latest Matches
                  </Box>
                }
                >
                  <Matches
                    originId={p.id}
                    originType={'player'}
                    pageSize={5} 
                    showFilterByPlayer={false}
                    showAsSmallScreen={true}
                  />
                </InfoPopup>
              </Box>
            </PlayerCard >

          </Grid >
        ))}
        <Button disabled={!selectedPlayer} onClick={handleClick} variant="contained" color="primary" fullWidth >Claim</Button>
        <Button onClick={() => handleClick(true)} variant="contained" color="primary" fullWidth >No, continue without claiming</Button>
      </Grid>
    </Grid>
  )
}

export default ClaimPlayer;