import React from 'react';
import { Box } from '@mui/material';
import PlayerSearch from '../Player/playerSearch';
import GetParticipants from '../Event/getParticipants';
import DivisionFilter from './DivisionFilter';

const MatchFilters = ({
  originType,
  originId,
  divisions = [],
  selectedPlayers = [],
  selectedDivisionId = '',
  onPlayerChange,
  onDivisionChange,
  showFilterByPlayer = true,
  showFilterByDivision = false,
  fromProfileId = null
}) => {
  if (!showFilterByPlayer && !showFilterByDivision) {
    return null;
  }
  //console.log('MatchFilter', fromProfileId, selectedDivisionId, originType, originId);
  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      alignItems: 'flex-start',
      flexWrap: 'wrap'
    }}>
      {showFilterByPlayer && (
        <Box sx={{ flex: 1, minWidth: 200 }}>
          {originType?.toLowerCase() === 'event' ? (
            <GetParticipants 
              eventId={originId} 
              label={'Filter on a participant ...'}
              setParticipantPlayers={onPlayerChange}
              setSelectedParticipant={() => {}}
            />
          ) : (
            <PlayerSearch
              label={'Filter on a player ...'}
              selectedPlayer={selectedPlayers[0]}
              setSelectedPlayer={onPlayerChange}
              fromProfileId={fromProfileId}
            />
          )}
        </Box>
      )}
      
      {showFilterByDivision && divisions?.length > 0 && (
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <DivisionFilter
            divisions={divisions}
            selectedDivisionId={selectedDivisionId}
            onDivisionChange={onDivisionChange}
          />
        </Box>
      )}
    </Box>
  );
};

export default MatchFilters;