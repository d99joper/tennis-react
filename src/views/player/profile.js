// Profile.js
import React, { useState, useEffect, useContext } from 'react'
import { Box, LinearProgress, Typography, Modal } from '@mui/material'
import { useParams } from 'react-router-dom'
import { playerAPI } from 'api/services'
import { AuthContext } from 'contexts/AuthContext'
import { ProfileImageContext } from 'components/forms/ProfileImage'
import ProfileHeader from './profileHeader'
import PlayerStatsPanel from './playerStatsPanel'
import EventSection from './eventSection'
import { helpers } from 'helpers'
import { Helmet } from 'react-helmet-async'

const ProfileNew = () => {
  const { userid } = useParams()
  const { user, isLoggedIn, loading: userIsLoading } = useContext(AuthContext)
  const { setProfileImage } = useContext(ProfileImageContext)

  const [player, setPlayer] = useState(null)
  const [canEdit, setCanEdit] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [showUtrRefresh, setShowUtrRefresh] = useState(false)
  const [showUtrRefreshing, setShowUtrRefreshing] = useState(false)
  const [utrRankSingles, setUtrRankSingles] = useState()
  const [utrRankDoubles, setUtrRankDoubles] = useState()
  const [utrLink, setUtrLink] = useState('')
  const [awards, setAwards] = useState({})

  useEffect(() => {
    async function fetchProfile() {
      try {
        const id = userid || user?.id
        if (!id) throw new Error('No user ID found.')

        const fetchedPlayer = await playerAPI.getPlayer(id)
        setPlayer(fetchedPlayer)
        setIsLoaded(true)
        fetchAwards(fetchedPlayer.id)

        if (!userIsLoading && isLoggedIn && user?.id === fetchedPlayer.id) {
          setCanEdit(true)
          setShowUtrRefresh(true)
        }

        if (fetchedPlayer.UTR) {
          setUtrLink(`https://app.utrsports.net/profiles/${fetchedPlayer.UTR}`)
          if (fetchedPlayer.cached_utr) {
            setUtrRankSingles(fetchedPlayer.cached_utr?.singles?.toFixed(2))
            setUtrRankDoubles(fetchedPlayer.cached_utr?.doubles?.toFixed(2))
          }
        }
      } catch (err) {
        console.error(err)
        setIsLoaded(true)
      }
    }

    async function fetchAwards(id) {
      playerAPI.getPlayerAwards(id).then((data) => {
        setAwards(data)
        console.log(data)
      })
    }

    fetchProfile()
  }, [userid, user, userIsLoading, isLoggedIn])

  const handleImageUpdate = async (e) => {
    try {
      const imageFile = e.target.files[0]
      const resizedImage = await helpers.resizeImage(imageFile, 800)
      await playerAPI.updatePlayerImage(player.id, resizedImage)
      setProfileImage(player.id, player.image_urls?.thumbnail)
      setShowImagePicker(false)
    } catch (error) {
      console.error('Error updating image:', error)
    }
  }

  const updateUTR = () => {
    setShowUtrRefresh(false)
    setShowUtrRefreshing(true)
    playerAPI.getPlayerUTR(player.id).then((utr_obj) => {
      if (utr_obj) {
        setUtrRankSingles(utr_obj.singles.toFixed(2))
        setUtrRankDoubles(utr_obj.doubles.toFixed(2))
      }
      setShowUtrRefreshing(false)
    })
  }

  if (!isLoaded) return <LinearProgress />
  if (!player) return <Typography>Error loading player profile</Typography>

  return (
    <Box sx={{ px: 2, py: 1, maxWidth: '100%', display:'grid', justifyContent:'flex-start' }}>
      <Helmet>
        <title>{player?.name} | MyTennis Space</title>
      </Helmet>
      <ProfileHeader
        player={player}
        awards={awards}
        canEdit={canEdit}
        onImageClick={() => setShowImagePicker(true)}
        utrRankSingles={utrRankSingles}
        utrRankDoubles={utrRankDoubles}
        utrLink={utrLink}
        showUtrRefreshing={showUtrRefreshing}
        showUtrRefresh={showUtrRefresh}
        onUtrRefresh={updateUTR}
      />

      {/* <PlayerStatsPanel player={player} />
      <EventSection player={player} /> */}

      <Modal open={showImagePicker} onClose={() => setShowImagePicker(false)}>
        <Box sx={{ overflow: 'auto', maxHeight: '80vh', width: 300, p: 2, mt: '10%', mx: 'auto', backgroundColor: 'white' }}>
          <Typography variant="h6">Update Profile Picture</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpdate}
            style={{ display: 'block', marginTop: 16 }}
          />
        </Box>
      </Modal>
    </Box>
  )
}

export default ProfileNew
