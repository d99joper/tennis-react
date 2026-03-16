// src/views/CreateTournament.js
import React, { useState, useContext } from 'react'
import { Box, TextField, Button, Typography, MenuItem, FormControlLabel, Checkbox } from '@mui/material'
import { eventAPI, billableItemAPI } from 'api/services'
import { AuthContext } from 'contexts/AuthContext'
import BillableItemForm from 'features/stripe/components/BillableItemForm'

const TournamentCreate = () => {
  const { user } = useContext(AuthContext)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [matchType, setMatchType] = useState('singles')
  const [isPaid, setIsPaid] = useState(false)
  const [billableItem, setBillableItem] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const defaultTournamentConfig = {
      bracket: {},
      finalized: false
    }

    const payload = {
      name,
      description,
      start_date: startDate,
      event_type: 'tournament',
      match_type: matchType,
      content_object: defaultTournamentConfig
    }
    try {
      const result = await eventAPI.createEvent(payload)
      
      // If paid event, create billable item
      if (isPaid && billableItem) {
        await billableItemAPI.createBillableItem({
          event_id: result.data.id,
          amount: billableItem.amount,
          description: billableItem.description || `${name} entry fee`,
          currency: 'usd',
          refund_policy: billableItem.refund_policy || 'no_refunds'
        })
      }
      
      window.location.href = `/events/${result.data.slug}`
    } catch (err) {
      console.error('Error creating tournament', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>Create Tournament</Typography>
      <TextField
        fullWidth
        label="Tournament Name"
        value={name}
        onChange={(e) => setName(e.target.value)} 
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Description"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Start Date"
        type="date"
        slotProps={{ input: {shrink: true} }}
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        select
        fullWidth
        label="Match Type"
        value={matchType}
        onChange={(e) => setMatchType(e.target.value)}
        sx={{ mb: 2 }}
      >
        <MenuItem value="singles">Singles</MenuItem>
        <MenuItem value="doubles">Doubles</MenuItem>
      </TextField>
      
      <FormControlLabel
        control={
          <Checkbox 
            checked={isPaid} 
            onChange={(e) => setIsPaid(e.target.checked)} 
          />
        }
        label="Paid Event"
        sx={{ mb: 2 }}
      />
      
      {isPaid && (
        <BillableItemForm 
          value={billableItem}
          onChange={setBillableItem}
        />
      )}
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSubmit}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Creating...' : 'Create Tournament'}
      </Button>
    </Box>
  )
}

export default TournamentCreate
