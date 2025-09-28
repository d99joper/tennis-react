import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  CircularProgress
} from '@mui/material';
import divisionAPI from '../../../api/services/divisions';

const DivisionSelect = ({ 
  divisions, 
  currentDivisionId, 
  participantId, 
  participantName, 
  onAssignmentComplete,
  disabled = false 
}) => {
  const [selectedDivisionId, setSelectedDivisionId] = useState(currentDivisionId || '');
  const [assigning, setAssigning] = useState(false);

  const handleAssign = async () => {
    if (!selectedDivisionId || selectedDivisionId === currentDivisionId) return;
    
    try {
      setAssigning(true);
      
      // If participant was in a different division, remove them first
      if (currentDivisionId && currentDivisionId !== selectedDivisionId) {
        await divisionAPI.removeDivisionPlayers(currentDivisionId, [participantId]);
      }
      
      // Add to new division
      if (selectedDivisionId !== '') {
        await divisionAPI.addDivisionPlayers(selectedDivisionId, [participantId]);
      }
      
      // Notify parent component of successful assignment
      if (onAssignmentComplete) {
        onAssignmentComplete(participantId, selectedDivisionId);
      }
    } catch (error) {
      console.error('Failed to assign participant to division:', error);
      // Reset selection on error
      setSelectedDivisionId(currentDivisionId || '');
    } finally {
      setAssigning(false);
    }
  };

  const hasChanged = selectedDivisionId !== (currentDivisionId || '');

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1, 
      mt: 1,
      flexWrap: 'wrap'
    }}>
      <TextField
        select
        size="small"
        variant="outlined"
        value={selectedDivisionId}
        onChange={(e) => setSelectedDivisionId(e.target.value)}
        disabled={disabled || assigning}
        sx={{ minWidth: 120, fontSize: '0.875rem' }}
      >
        <MenuItem value="">
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
            No division
          </Typography>
        </MenuItem>
        {divisions?.map((division) => (
          <MenuItem key={division.id} value={division.id}>
            <Typography variant="body2">
              {division.name}
            </Typography>
          </MenuItem>
        ))}
      </TextField>
      
      {hasChanged && (
        <Button
          variant="contained"
          size="small"
          onClick={handleAssign}
          disabled={assigning}
          sx={{ 
            minWidth: 80,
            height: 32,
            textTransform: 'none'
          }}
        >
          {assigning ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            'Assign'
          )}
        </Button>
      )}
    </Box>
  );
};

export default DivisionSelect;

