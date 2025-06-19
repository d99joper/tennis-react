// components/awards/FloatingAward.js
import React, { useEffect, useState } from 'react'
import { Box, Typography, Fade, Slide } from '@mui/material'
import { AiOutlineStar, AiFillTrophy } from 'react-icons/ai'
import confetti from 'canvas-confetti'

const ICONS = {
  badge: <AiOutlineStar color="deepskyblue" size={40} />,
  trophy: <AiFillTrophy color="gold" size={40} />,
}

const FloatingAward = ({ type, title, onDone }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    launchConfetti()
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDone?.(), 500)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  function launchConfetti() {
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.3 }
    })
  }

  return (
    <Fade in={visible} timeout={500}>
      <Slide in={visible} direction="down" timeout={500}>
        <Box sx={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'white',
          padding: 3,
          borderRadius: 3,
          boxShadow: 6,
          textAlign: 'center',
          zIndex: 1300,
        }}>
          {ICONS[type] || <AiOutlineStar size={40} />}
          <Typography variant="h6" fontWeight="bold" mt={1}>
            You earned a new {type}!
          </Typography>
          <Typography>{title}</Typography>
        </Box>
      </Slide>
    </Fade>
  )
}

export default FloatingAward
