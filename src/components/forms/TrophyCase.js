import React, { useState } from 'react'
import { Box, Typography, IconButton, Tooltip, Divider } from '@mui/material'
import { BsTrophyFill } from 'react-icons/bs'
import { AiOutlineStar } from 'react-icons/ai'
import { MdEmojiEvents } from 'react-icons/md'
import MyModal from 'components/layout/MyModal'

const TrophyCase = ({ trophies = [], badges = [] }) => {
  const [showModal, setShowModal] = useState(false)

  return (
    <Box sx={{ mt: 3 }}>
      <Box display="flex" alignItems="center" gap={1}>
        {/* <Typography variant="h6">Trophy Case</Typography> */}
        <Tooltip title="View all achievements">
          <IconButton size="small" onClick={() => setShowModal(true)}>
            <MdEmojiEvents size={24} />
            {/* <AiOutlineStar /> */}
          </IconButton>
        </Tooltip>
        <Typography variant="body2" sx={{ ml: 2, color: 'gray' }}>
          {trophies.length} Troph{trophies.length === 1 ? 'y' : 'ies'}, {badges.length} badge{badges.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      <MyModal showHide={showModal} onClose={() => setShowModal(false)} title="🏆 Trophy Case">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Trophies */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Trophies</Typography>
            {trophies.length > 0 ? trophies.map((t, i) => (
              <Box key={`trophy-${i}`} display="flex" alignItems="center" gap={1}>
                <BsTrophyFill color="goldenrod" />
                <Typography variant="body1">{t.title}</Typography>
              </Box>
            )) : (
              <Typography variant="body2" color="text.secondary">No trophies yet.</Typography>
            )}
          </Box>
          <Divider />
          {/* Badges */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Badges</Typography>
            {badges.length > 0 ? badges.map((b, i) => (
              <Box key={`badge-${i}`} display="flex" alignItems="center" gap={1}>
                <AiOutlineStar color="deepskyblue" />
                <Typography variant="body1">{b.title}</Typography>
              </Box>
            )) : (
              <Typography variant="body2" color="text.secondary">No badges yet.</Typography>
            )}
          </Box>
        </Box>
      </MyModal>
    </Box>
  )
}

export default TrophyCase
