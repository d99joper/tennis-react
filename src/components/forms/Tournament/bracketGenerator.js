import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  TextField,
  IconButton,
  Stack,
} from '@mui/material';
import { AiFillDelete } from 'react-icons/ai';
import { tournamentsAPI } from 'api/services';
import Wizard from 'components/forms/Wizard/Wizard';

const BracketGenerator = ({
  availableParticipants = [],
  tournamentId,
  onBracketGenerated,
  title = "Generate Bracket",
  subtitle = "Select participants and configure seeding options"
}) => {
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [useSeeding, setUseSeeding] = useState(true);
  const [seedCount, setSeedCount] = useState(4);
  const [dragIndex, setDragIndex] = useState(null);
  const [bracketName, setBracketName] = useState('Main Draw');

  const handleChange = (e) => {
    const next = e.target.value || [];
    setSelectedParticipants(next);
  };

  const handleRemove = (participant) => {
    const id = typeof participant === 'string' || typeof participant === 'number' ? participant : participant?.id;
    setSelectedParticipants((prev) => {
      const next = prev.filter((p) => p.id !== id);
      return next;
    });
  };

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (dragIndex === null || dragIndex === index) return;
    const updated = [...selectedParticipants];
    const [removed] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, removed);
    setSelectedParticipants(updated);
    setDragIndex(null);
  };

  const handleGenerate = async () => {
    const participants = selectedParticipants.map((p, idx) => ({
      id: p.id,
      seed: useSeeding && idx < seedCount ? idx + 1 : null,
    }));

    try {
      console.log('Generating bracket with participants:', participants);
      const newBracket = await tournamentsAPI.generateBrackets(tournamentId, participants, bracketName);

      console.log('Generated bracket response:', newBracket);

      if (newBracket && onBracketGenerated) {
        onBracketGenerated(newBracket);
      }
    } catch (err) {
      console.error('Error generating bracket:', err);
      throw err; // Re-throw to let wizard handle it
    }
  };

  // Adjust seedCount when selectedParticipants changes
  React.useEffect(() => {
    if (seedCount > selectedParticipants.length) {
      setSeedCount(selectedParticipants.length);
    }
  }, [selectedParticipants.length, seedCount]);

  // Step 1: Select Participants
  const participantSelectionContent = (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <Box>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          Bracket Name
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={bracketName}
          onChange={(e) => setBracketName(e.target.value)}
          placeholder="e.g., Main Draw, Consolation, etc."
          helperText="Give this bracket a name to identify it"
        />
      </Box>
      
      <Box>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          Participants
        </Typography>
        <Select
          multiple
          fullWidth
          value={selectedParticipants}
          onChange={handleChange}
          displayEmpty
          renderValue={(selected) => 
            selected.length === 0 
              ? <em style={{ color: 'rgba(0,0,0,0.4)' }}>Choose participants...</em>
              : `${selected.length} participant${selected.length !== 1 ? 's' : ''} selected`
          }
          sx={{ minHeight: 56 }}
        >
          <MenuItem disabled value="">
            <em>Choose participants...</em>
          </MenuItem>
          {availableParticipants.map((p) => (
            <MenuItem key={p.id} value={p}>
              {p.name}
            </MenuItem>
          ))}
        </Select>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Select at least 2 participants to generate a bracket
        </Typography>
      </Box>
    </Stack>
  );

  // Step 2: Configure Seeding
  const seedingConfigContent = (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <FormControlLabel
        control={
          <Switch
            checked={useSeeding}
            onChange={(e) => setUseSeeding(e.target.checked)}
            color="primary"
          />
        }
        label="Use seeding"
      />
      {useSeeding && (
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Number of seeded players
          </Typography>
          <TextField
            type="number"
            size="small"
            fullWidth
            value={seedCount}
            onChange={(e) => {
              const v = Number(e.target.value) || 0;
              setSeedCount(Math.max(0, Math.min(v, selectedParticipants.length)));
            }}
            inputProps={{ 
              min: 0, 
              max: Math.max(0, selectedParticipants.length) 
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Max: {selectedParticipants.length} participants
          </Typography>
        </Box>
      )}
    </Stack>
  );

  // Step 3: Review and Reorder
  const reviewContent = (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          Bracket Name
        </Typography>
        <Typography variant="h6" color="primary.main">
          {bracketName}
        </Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {selectedParticipants.length} participant{selectedParticipants.length !== 1 ? 's' : ''} selected. 
        Drag and drop to reorder.
      </Typography>
      
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          maxWidth: 600,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: useSeeding ? '60px 1fr 60px' : '1fr 60px',
            alignItems: 'center',
            fontWeight: 600,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            px: 1.5,
            py: 1,
          }}
        >
          {useSeeding && <Typography variant="body2">Seed</Typography>}
          <Typography variant="body2">Name</Typography>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Remove
          </Typography>
        </Box>

        {/* Rows */}
        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {selectedParticipants.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No participants selected
              </Typography>
            </Box>
          ) : (
            selectedParticipants.map((participant, idx) => (
              <Box
                key={participant.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: useSeeding ? '60px 1fr 60px' : '1fr 60px',
                  alignItems: 'center',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  px: 1.5,
                  py: 1,
                  cursor: 'grab',
                  bgcolor: dragIndex === idx ? 'action.hover' : 'transparent',
                  '&:hover': { bgcolor: 'action.hover' },
                  '&:active': { cursor: 'grabbing' },
                }}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(idx)}
              >
                {useSeeding && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: idx < seedCount ? 600 : 400,
                      color: idx < seedCount ? 'primary.main' : 'text.secondary'
                    }}
                  >
                    {idx < seedCount ? `#${idx + 1}` : '-'}
                  </Typography>
                )}
                <Typography variant="body2">{participant.name}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleRemove(participant)}
                    sx={{ color: 'error.main' }}
                  >
                    <AiFillDelete size={18} />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>
      {selectedParticipants.length > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          💡 Drag and drop to reorder participants
        </Typography>
      )}
    </Box>
  );

  // Define wizard steps
  const wizardSteps = [
    {
      label: 'Select Participants',
      description: 'Name your bracket and choose the participants',
      content: participantSelectionContent,
      handleNext: async () => {
        if (!bracketName || bracketName.trim() === '') {
          alert('Please enter a bracket name');
          return false;
        }
        if (selectedParticipants.length < 2) {
          alert('Please select at least 2 participants');
          return false;
        }
        return true;
      }
    },
    {
      label: 'Configure Seeding',
      description: 'Set up seeding options for the bracket',
      content: seedingConfigContent,
      handleNext: async () => {
        return true;
      }
    },
    {
      label: 'Review & Generate',
      description: 'Review the participant order and generate your bracket',
      content: reviewContent,
      handleNext: async () => {
        return true;
      }
    }
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      
      <Wizard
        steps={wizardSteps}
        handleSubmit={handleGenerate}
        submitText="🏆 Generate Bracket"
        completeStep={
          <Typography variant="body1" color="success.main">
            Bracket generated successfully!
          </Typography>
        }
      />
    </Box>
  );
};

export default BracketGenerator;
