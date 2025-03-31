import React from 'react'
import PlayerSearch from '../Player/playerSearch';
import { ProfileImage } from '../ProfileImage';
import { Box, Divider } from '@mui/material';

const FriendlyMatchPlayers = ({ matchLogic }) => {
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
        <ProfileImage player={matchLogic.selectedWinners[0]} /> {matchLogic.selectedWinners[0].name}
      </Box>
      {matchLogic.isDoubles &&
        <Box>
          <PlayerSearch
            key={'doubles_winner_partner'}
            selectedPlayer={matchLogic.selectedWinners[1]}
            setSelectedPlayer={(p) => matchLogic.setSelectedWinners([matchLogic.selectedWinners[0], p].filter(Boolean))}
            excludePlayers={[...matchLogic.selectedWinners, ...matchLogic.selectedOpponents].filter(p => p !== matchLogic.selectedWinners[1])}
            label="Your partner"
            required
            allowCreate={true}
            error={matchLogic.error.winners}
            errorMessage={matchLogic.error.winners ? 'Partner is required in doubles' : ''}
          />
          <Divider sx={{ pt: 2 }} >Opponents</Divider>
        </Box>
      }

      <PlayerSearch
        key={'opponent'}
        selectedPlayer={matchLogic.selectedOpponents[0]}
        setSelectedPlayer={(p) => matchLogic.setSelectedOpponents([p, matchLogic.selectedOpponents[1]].filter(Boolean))}
        excludePlayers={[...matchLogic.selectedWinners, ...matchLogic.selectedOpponents].filter(p => p !== matchLogic.selectedOpponents[0])}
        label="Opponent"
        required
        allowCreate={true}
        error={matchLogic.error.opponents}
        errorMessage={matchLogic.error.opponents ? 'Opponent is required' : ''}
      />
      {matchLogic.isDoubles &&
        <PlayerSearch
          key={'doubles_opponent_partner'}
          selectedPlayer={matchLogic.selectedOpponents[1]}
          setSelectedPlayer={(p) => matchLogic.setSelectedOpponents([matchLogic.selectedOpponents[0], p].filter(Boolean))}
          excludePlayers={[...matchLogic.selectedWinners, ...matchLogic.selectedOpponents].filter(p => p !== matchLogic.selectedOpponents[1])}
          label="Opponent partner"
          required
          allowCreate={true}
          error={matchLogic.error.opponents}
          errorMessage={matchLogic.error.winners ? 'Partner is required in doubles' : ''}
        />
      }
    </>
  )

}
export default FriendlyMatchPlayers
