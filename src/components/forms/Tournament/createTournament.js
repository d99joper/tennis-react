// src/views/CreateTournament.js
import React, { useState } from 'react'
import { Box, TextField, Button, Typography, MenuItem } from '@mui/material'
import { eventAPI } from 'api/services'

const TournamentCreate = () => {
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [startDate, setStartDate] = useState('')
	const [matchType, setMatchType] = useState('singles')

	const handleSubmit = async () => {
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
			window.location.href = `/events/${result.slug}`
		} catch (err) {
			console.error('Error creating tournament', err)
		}
	}

	return (
		<Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
			<Typography variant="h4" gutterBottom>Create Tournament</Typography>
			<TextField fullWidth label="Tournament Name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />
			<TextField fullWidth label="Description" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mb: 2 }} />
			<TextField fullWidth label="Start Date" type="date" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} sx={{ mb: 2 }} />
			<TextField select fullWidth label="Match Type" value={matchType} onChange={(e) => setMatchType(e.target.value)} sx={{ mb: 2 }}>
				<MenuItem value="singles">Singles</MenuItem>
				<MenuItem value="doubles">Doubles</MenuItem>
			</TextField>
			<Button variant="contained" color="primary" onClick={handleSubmit}>Create</Button>
		</Box>
	)
}

export default TournamentCreate
