import React, { useState } from 'react'
import { Box, Typography, TextField, Button, Alert } from '@mui/material'
import { playerAPI } from 'api/services'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await playerAPI.requestPasswordReset(email)
      console.log(res)
      if (res.message?.includes('Google')) {
        setError("This account uses Google login. Please log in using the 'Continue with Google' option.")
      }
      else
        setSent(true)
    } catch (err) {
      setError('Unable to send password reset email. Please try again.')
    }
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" gutterBottom>
        Forgot Your Password?
      </Typography>
      {sent ? (
        <Alert severity="success">
          If an account with that email exists, you’ll receive a reset link shortly.
        </Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" fullWidth>
            Send Reset Link
          </Button>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </form>
      )}
    </Box>
  )
}

export default ForgotPassword
