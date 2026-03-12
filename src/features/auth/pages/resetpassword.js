import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box, Typography, TextField, Button, Alert } from '@mui/material'
import { playerAPI } from 'api/services'

const ResetPassword = () => {
  const [params] = useSearchParams()
  const token = params.get("token")

  const [password, setPassword] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await playerAPI.resetPassword(token, password)
      setConfirmed(true)
    } catch {
      setError('Invalid or expired reset token.')
    }
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" gutterBottom>
        Reset Your Password
      </Typography>
      {confirmed ? (
        <Alert severity="success">Your password has been updated. You may now log in.</Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" fullWidth>
            Reset Password
          </Button>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </form>
      )}
    </Box>
  )
}

export default ResetPassword
