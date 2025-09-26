import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box, Typography, IconButton, Tooltip, Divider } from '@mui/material'
import { BsTrophyFill } from 'react-icons/bs'
import { AiOutlineStar } from 'react-icons/ai'
import { MdEmojiEvents } from 'react-icons/md'
import MyModal from 'components/layout/MyModal'
import { helpers } from 'helpers'
import { GoLinkExternal } from 'react-icons/go'
import confetti from 'canvas-confetti'
import ReactConfetti from 'react-confetti'
import useAwardToast from 'helpers/useAwardsToast'
import { playerAPI } from 'api/services'
import { AuthContext } from 'contexts/AuthContext'

const TrophyCase = ({ trophies = [], badges = [], player_id = null }) => {
  const [showModal, setShowModal] = useState(false)
  const [animatedItems, setAnimatedItems] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [uncelebrated, setUncelebrated] = useState([])
  const [localTrophies, setLocalTrophies] = useState([...trophies])
  const [localBadges, setLocalBadges] = useState([...badges])
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [showConfetti, setShowConfetti] = useState(false)
  const { showAward, AwardToast } = useAwardToast()
  const { user } = useContext(AuthContext)

  useEffect(() => {
    setLocalTrophies(trophies || [])
    setLocalBadges(badges || [])
  }, [trophies, badges])
  
  useLayoutEffect(() => {
    if (showModal && user?.id === player_id) {
      // Defer execution until next tick to ensure DOM is painted
      const timer = setTimeout(() => {
        if (!containerRef.current) return
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })

        const newTrophies = localTrophies.filter(t => !t.celebrated).map(t => ({ ...t, type: 'trophy' }))
        const newBadges = localBadges.filter(b => !b.celebrated).map(b => ({ ...b, type: 'badge' }))
        const combined = [...newTrophies, ...newBadges]

        if (combined.length === 0) return
        console.log(trophies, badges)
        setUncelebrated(combined)
        setShowConfetti(true)
        setCurrentIndex(0)
        playerAPI.markAwardSeen({ badges: localBadges.map(b => b.id), trophies: localTrophies.map(t => t.id) })
          .then(() => {
            // Update local trophy and badge states to mark them as celebrated
            setLocalTrophies(prev => prev.map(t => ({ ...t, celebrated: true })))
            setLocalBadges(prev => prev.map(b => ({ ...b, celebrated: true })))
          })
      }, 0)

      return () => clearTimeout(timer)
    }
  }, [showModal, trophies, badges, user, player_id])

  useEffect(() => {
    if (!showModal || uncelebrated.length === 0 || currentIndex >= uncelebrated.length || user?.id !== player_id) return

    const item = uncelebrated[currentIndex]

    if (currentIndex === 0) {
      // FIRST ONE: show immediately
      showAward(item.type, item.title)
      setAnimatedItems(prev => [...prev, item.id || item.title])
      setCurrentIndex(prev => prev + 1)
    } else {
      // ⏱ Subsequent ones: delay 2.5s
      const timeout = setTimeout(() => {
        showAward(item.type, item.title)
        setAnimatedItems(prev => [...prev, item.id || item.title])
        setCurrentIndex(prev => prev + 1)
      }, 2500)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, uncelebrated, showModal, user, player_id])

  const openModal = () => {
    setShowModal(true)
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1}>
        {/* <Typography variant="h6">Trophy Case</Typography> */}
        <Tooltip title="View all achievements">
          <IconButton size="small" onClick={() => openModal()}>
            <MdEmojiEvents size={24} />
            {/* <AiOutlineStar /> */}
          </IconButton>
        </Tooltip>
        <Typography variant="body2" sx={{ ml: 2, color: 'gray' }}>
          {localTrophies.length} Troph{localTrophies.length === 1 ? 'y' : 'ies'}, {localBadges.length} badge{localBadges.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      <MyModal showHide={showModal} onClose={() => { setShowModal(false); setShowConfetti(false) }} title="🏆 Trophy Case">

        <Box
          ref={containerRef}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'relative' }}>
          {showConfetti && (
            <>
              <AwardToast />
              <ReactConfetti
                width={dimensions.width}
                height={dimensions.height}
                numberOfPieces={700}
                recycle={false}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  pointerEvents: 'none',
                  zIndex: 1000,
                }}
              />
            </>
          )}
          {/* Trophies */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Trophies</Typography>
            {localTrophies.length > 0 ? localTrophies.map((t, i) => {
              const animate = !t.celebrated && user?.id === player_id && animatedItems.includes(t.id || t.title)
              return (
                <Box key={`trophy-${i}`}
                  className={animate ? 'trophy-animate' : ''}
                  sx={{ mb: 2 }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <BsTrophyFill color="goldenrod" />
                    <Typography variant="body1">{t.title}</Typography>
                    {t.event?.slug &&
                      <Tooltip title="View event">
                        <IconButton size="small" href={`/events/${t.event.slug}`} target="_blank" rel="noopener noreferrer">
                          <GoLinkExternal size={16} />
                        </IconButton>
                      </Tooltip>
                    }
                  </Box>
                  <Box pl={4}>
                    <Typography variant="body2" color="text.secondary">{t.description}</Typography>
                    <Typography variant="body2" color="text.secondary">{helpers.formatDate(t.earned_on)}</Typography>
                  </Box>
                </Box>
              )
            }) : (
              <Typography variant="body2" color="text.secondary">No trophies yet.</Typography>
            )}
          </Box>
          <Divider />
          {/* Badges */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Badges</Typography>
            {localBadges.length > 0 ? localBadges.map((b, i) => {
              const animate = !b.celebrated && user?.id === player_id && animatedItems.includes(b.id || b.title)
              return (
                <Box key={`badge-${i}`}
                  display="flex"
                  alignItems="center" gap={1}
                  sx={{ mb: 2 }}
                  className={animate ? 'trophy-animate' : ''}
                >
                  <AiOutlineStar color="deepskyblue" />
                  <Typography variant="body1">{b.title}</Typography>
                </Box>
              )
            }) : (
              <Typography variant="body2" color="text.secondary">No badges yet.</Typography>
            )}
          </Box>
        </Box>
      </MyModal >
    </Box >
  )
}

export default TrophyCase
