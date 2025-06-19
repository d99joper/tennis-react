// ProfileHeader.js
import React, { useContext, useEffect, useState } from 'react'
import { Box, Typography, CircularProgress, Card, CardContent, Divider, TextField, MenuItem, Button, Select } from '@mui/material'
import { Grid2 as Grid } from '@mui/material'
import { BsHouse } from 'react-icons/bs'
import { MdSportsTennis, MdOutlineRefresh } from 'react-icons/md'
import PlayerLadders from './playerLadders'
import { AutoCompletePlaces, Editable, InfoPopup, ProfileImage } from 'components/forms'
import TrophyCase from 'components/forms/TrophyCase'
import UTRImportButton from 'components/forms/Player/UTRImport'
import NTRPLevels from 'views/NTRPLevels';
import { playerAPI } from 'api/services'
import { AiOutlineMessage } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import MyModal from 'components/layout/MyModal'
import { useNotificationsContext } from 'contexts/NotificationContext'
import { AuthContext } from 'contexts/AuthContext'
import Conversation from 'components/forms/Conversations/conversations'
import utrInstructions from '../../images/utr_instructions.png'

const ProfileHeader = ({
  player,
  awards,
  canEdit,
  onImageClick,
  utrRankSingles,
  utrRankDoubles,
  utrLink,
  showUtrRefreshing,
  showUtrRefresh,
  onUtrRefresh
}) => {

  const [isEdit, setIsEdit] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
  const [trophies, setTrophies] = useState([])
  const [badges, setBadges] = useState([])
  const { user, isLoggedIn, loading: userIsLoading } = useContext(AuthContext)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1940 + 1 }, (v, i) => currentYear - i - 5);

  const NTRPItems = ["-", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5"]
  const { notificationCount } = useNotificationsContext()
  const [formData, setFormData] = useState({
    name: player.name || '',
    city_name: player.city?.name || '',
    lat: player.city?.lat,
    lng: player.city?.lng,
    about: player.about || '',
    NTRP: player.NTRP || '',
    UTR: player.UTR || '',
    id: player.id,
    birth_year: player.birth_year || ''
  })

  useEffect(() => {
    if (awards) {
      setTrophies(awards.trophies || [])
      setBadges(awards.badges || [])
    }
  }, [awards])

  const handleEditToggle = () => setIsEdit(!isEdit);

  const handleChange = (field, value) => {
    if (field === 'location') {
      setFormData(prev => ({ ...prev, ['city_name']: value.city_name }))
      setFormData(prev => ({ ...prev, ['lat']: value.lat }))
      setFormData(prev => ({ ...prev, ['lng']: value.lng }))
    }
    else
      setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      await playerAPI.updatePlayer(formData)
      setIsEdit(false)
    } catch (err) {
      console.error('Failed to update profile', err)
    }
  }

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        {/* Top row: Profile image + basic info */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ProfileImage
              player={player}
              size={140}
              className={canEdit ? 'cursorHand' : ''}
              onClick={onImageClick}
            />
          </Box>

          {/** Name */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              <Editable isEditing={isEdit} text={formData.name} placeholder="Name">
                <TextField
                  fullWidth
                  variant="standard"
                  size="small"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </Editable>
            </Typography>

            {/** birth year */}
            <Editable
              // hide this, since I don't think ppl want to show their age
              text=""
              //text={birthyear ? <Typography>Born in {birthyear}</Typography> : ''}
              isEditing={isEdit}>
              <Box>
                <Typography>Year I was born:</Typography>
                <TextField
                  select
                  fullWidth
                  name="birthyear"
                  label="Birth Year"
                  value={formData.birth_year}
                  onChange={(e) => handleChange('birth_year', e.target.value)}
                  sx={{ mb: 3 }} // Add bottom margin to the TextField
                >
                  {/* Map over the years array to create MenuItem components */}
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Editable>

            {/** Location */}
            <Editable
              text={<Typography>{formData.city_name || 'Location Unknown'}</Typography>}
              isEditing={isEdit}
            >
              <AutoCompletePlaces
                onPlaceChanged={(e) => { handleChange('location', e) }}
                showGetUserLocation={true}
                initialCity={player.city?.name}
              />
            </Editable>

            {/** Notifications */}
            {!isEdit &&
              <>
                {canEdit ?
                  <Link to='/notifications/'>
                    {notificationCount > 0 && `You have ${notificationCount} unread messages`}
                  </Link>
                  : isLoggedIn && !player.username.endsWith('@mytennis.space') &&
                  <Box display={'flex'} gap={1} alignItems={'center'}>
                    <AiOutlineMessage
                      onClick={() => setShowChatModal(true)}
                      color='green'
                      size={25}
                      cursor={'pointer'}
                    />
                    <Typography>Message</Typography>
                  </Box>
                }
                <MyModal
                  showHide={showChatModal}
                  onClose={() => setShowChatModal(false)}
                  title={`Send ${player.name} a message`}
                >
                  Send a message
                  <Conversation player1={user} player2={player} />
                </MyModal>
              </>
            }

            {/** About */}
            <Editable
              text={formData.about}
              isEditing={isEdit}>
              <Box>
                <Typography>About Me:</Typography>
                <TextField
                  multiline
                  fullWidth
                  rows={4}
                  name="about"
                  placeholder={'Something about me...'}
                  value={formData.about}
                  onChange={(e) => handleChange('about', e.target.value)}
                />
              </Box>
            </Editable>
          </Box>
        </Box>

        {/* Trophies */}
        <Box sx={{
          display: 'inline-block',
          mt: 2,
          p: 1, pr: 2, pl: 1.5,
          border: 1,
          borderColor: '#AAA',
          borderRadius: 8,
        }}>
          {awards &&
            <TrophyCase
              trophies={trophies || []}
              badges={badges || []}
              player_id={player.id}
            />
          }
        </Box>
        {/* Ratings and Clubs Grid */}
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid xs={12} sm={6} md={4} lg={2}>
            <Editable
              text={
                <Box display={'flex'}>
                  <Typography fontWeight="bold"><MdSportsTennis /> NTRP:&nbsp;</Typography>
                  {formData.NTRP ? parseFloat(formData.NTRP).toFixed(1) : 'N/A'}
                  <InfoPopup paddingLeft={"0.2rem"} width="450px">
                    <NTRPLevels />
                    <a
                      href='https://www.usta.com/content/dam/usta/pdfs/NTRP%20General%20Characteristics.pdf'
                      target='_blank'
                    >
                      {`View the USTA NTPR guidelines here >>`}
                    </a>
                  </InfoPopup>
                </Box>
              }
              isEditing={isEdit}
            >
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'top', gap: 1 }}>
                <Typography sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                  <MdSportsTennis /> NTRP:
                </Typography>
                <Select
                  name="NTPR"
                  size='small'
                  fullWidth
                  sx={{ height: '40px' }}
                  value={formData.NTRP ? parseFloat(formData.NTRP).toFixed(1) : '2.0'}
                  onChange={(e) => handleChange('NTRP', e.target.value)}
                >
                  {NTRPItems.map((x) =>
                    <MenuItem key={x} value={x}>{x}</MenuItem>
                  )}
                </Select>
                <InfoPopup paddingLeft={"0.5rem"}>
                  <NTRPLevels />
                  <a
                    href='https://www.usta.com/content/dam/usta/pdfs/NTRP%20General%20Characteristics.pdf'
                    target='_blank'
                  >
                    {`View the USTA NTPR guidelines here >>`}
                  </a>
                </InfoPopup>

              </Box>
            </Editable>

            <Divider orientation='horizontal' flexItem sx={{ m: 2 }} />

            {/** UTR */}
            {/************ UTR  *************/}
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 0, }}>
              <Typography>
                <MdSportsTennis /> UTR:
                {canEdit &&
                  <InfoPopup paddingLeft={"0.5rem"} >
                    Add your UTR ID to link up with your UTR account.<br />
                    You can find your ID if you go to your UTR profile page.
                    <img src={utrInstructions} alt='UTR Instructions' />
                  </InfoPopup>
                }
              </Typography>
              <Editable isEditing={isEdit} text={
                <Box sx={{ ml: '1rem', width: '100%' }}>
                  <Typography variant="body2">
                    Singles: {showUtrRefreshing ? <CircularProgress size={14} /> : (utrRankSingles > 0 ? utrRankSingles : 'UR')}
                    {showUtrRefresh &&
                      <MdOutlineRefresh
                        style={{ marginLeft: '5px' }}
                        title='Refresh your UTR score'
                        color="green"
                        className='cursorHand'
                        onClick={() => onUtrRefresh()} />
                    }
                  </Typography>
                  <Typography variant="body2">
                    Doubles: {showUtrRefreshing ? <CircularProgress size={14} /> : (utrRankDoubles > 0 ? utrRankDoubles : 'UR')}
                  </Typography>
                  {utrLink && (
                    <Typography variant="body2">
                      <a href={utrLink} target="_blank" rel="noopener noreferrer">
                        View UTR Profile &gt;&gt;
                      </a>
                    </Typography>
                  )}
                  {canEdit && player.UTR &&
                    <UTRImportButton utr_id={formData.UTR} callback={onUtrRefresh} />
                  }
                </Box>
              }>
                <TextField name="UTR" size='small' value={formData.UTR} onChange={(e) => handleChange('UTR', e.target.value)}></TextField>
              </Editable>
            </Box>
          </Grid>
          <Divider orientation='vertical' flexItem />
          {player.clubs?.length > 0 && (
            <Grid xs={12} sm={12} md={4} lg={2}>
              <Typography fontWeight="bold"><BsHouse /> Clubs</Typography>
              {player.clubs.map(club => (
                <Typography key={club.id} variant="body2">
                  <a href={`/clubs/${club.slug}`}>{club.name}</a>
                </Typography>
              ))}
            </Grid>

          )}
          <Divider orientation='vertical' flexItem />
          <Grid xs={12} sm={12} md={4} lg={2}>
            <PlayerLadders playerId={player.id} showWinLoss={true} showRating={true} />
          </Grid>

        </Grid>


      </CardContent>
      { //*********** EDIT BUTTONS  ***********/ 
        canEdit && (
          <Box sx={{}}>
            {isEdit ? (
              <>
                <Button onClick={handleSave} color='primary'>Save</Button>
                <Button onClick={handleEditToggle} color='error'>Cancel</Button>
              </>
            ) : (
              <Button onClick={handleEditToggle} color='info'>Update profile</Button>
            )}
          </Box>
        )
      }
    </Card >
  )
}

export default ProfileHeader
