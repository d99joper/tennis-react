// ProfileHeader.js
import React, { useContext, useEffect, useState } from 'react'
import { Box, Typography, CircularProgress, Card, CardContent, Divider, TextField, MenuItem, Button, Select, IconButton, Tooltip } from '@mui/material'
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
import { GoLinkExternal } from 'react-icons/go'

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
    <Card variant="outlined" sx={{ width: '100%', mb: 2 }}>
      <CardContent>
        <Box sx={{ mx: 'auto' }} >
          <Grid container spacing={2} alignItems="flex-start" >
            {/** Row 1: Profile image | details | utr */}
            <Grid size={12}>
              {/* <Grid container spacing={2} sx={{ justifyContent: 'flex-start', alignItems: 'top' }}> */}
              <Grid container alignItems="flex-start" justifyContent="space-between">
                <Grid size={{ xs: 12, md: 8 }}>
                  {/** Profile Image */}
                  <Box sx={{ display: 'flex' }} gap={4} >
                    <ProfileImage
                      player={player}
                      size={140}
                      className={canEdit ? 'cursorHand' : ''}
                      onClick={onImageClick}
                    />
                    {/** Details */}
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

                      {/** Birth Year */}
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
                        <Box sx={{ width: '100%' }}>
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
                </Grid>

                {/** Ratings */}
                <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                  {/** NTRP */}
                  <Box sx={{ display: 'flex', flexDirection: {xs: 'row', md: 'column'} }}>
                    <Grid>
                      <Editable
                        text={
                          <Box display={'flex'}>
                            <InfoPopup paddingLeft={"0.2rem"} width="450px">
                              <NTRPLevels />
                              <a
                                href='https://www.usta.com/content/dam/usta/pdfs/NTRP%20General%20Characteristics.pdf'
                                target='_blank'
                              >
                                {`View the USTA NTPR guidelines here >>`}
                              </a>
                            </InfoPopup>
                            <Typography>&nbsp;NTRP:&nbsp;</Typography>
                            {formData.NTRP ? parseFloat(formData.NTRP).toFixed(1) : 'N/A'}
                          </Box>
                        }
                        isEditing={isEdit}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'top', gap: 1 }}>
                          <Typography sx={{ display: 'flex', flexDirection: 'row', }}>

                            <InfoPopup paddingLeft={"0.2rem"}>
                              <NTRPLevels />
                              <a
                                href='https://www.usta.com/content/dam/usta/pdfs/NTRP%20General%20Characteristics.pdf'
                                target='_blank'
                              >
                                {`View the USTA NTPR guidelines here >>`}
                              </a>
                            </InfoPopup>&nbsp;NTRP:
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

                        </Box>
                      </Editable>
                    </Grid>

                    <Divider orientation='horizontal' flexItem sx={{ m: 1 }} />

                    {/** UTR */}
                    <Grid>
                      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 0, p: 0 }}>
                        <Typography>
                          {canEdit &&
                            <InfoPopup paddingLeft={"0.2rem"} >
                              Add your UTR ID to link up with your UTR account.<br />
                              You can find your ID if you go to your UTR profile page.
                              <img src={utrInstructions} alt='UTR Instructions' />
                            </InfoPopup>
                          } UTR:
                          {utrLink &&
                            <Tooltip title="View UTR Profile">
                              <IconButton size="small" href={utrLink} color="success" target="_blank" rel="noopener noreferrer">
                                <GoLinkExternal size={16} />
                              </IconButton>
                            </Tooltip>
                          }
                        </Typography>
                        <Editable isEditing={isEdit} text={
                          <Box sx={{ ml: '1rem', width: '100%' }}>
                            <Typography variant="body2">
                              Singles: {showUtrRefreshing ? <CircularProgress size={14} /> : (utrRankSingles > 0 ? utrRankSingles : 'UR')}
                              {showUtrRefresh &&
                                <Tooltip title="View UTR Profile">
                                  <IconButton size="small" color="success" onClick={() => onUtrRefresh()} >
                                    <MdOutlineRefresh size={16} />
                                  </IconButton>
                                </Tooltip>
                              }
                            </Typography>
                            <Typography variant="body2">
                              Doubles: {showUtrRefreshing ? <CircularProgress size={14} /> : (utrRankDoubles > 0 ? utrRankDoubles : 'UR')}
                            </Typography>

                            {canEdit && player.UTR &&
                              <UTRImportButton color="green" utr_id={formData.UTR} callback={onUtrRefresh} />
                            }
                          </Box>
                        }>
                          <TextField
                            name="UTR"
                            size='small'
                            value={formData.UTR}
                            onChange={(e) => handleChange('UTR', e.target.value)}
                          />
                        </Editable>
                      </Box>
                    </Grid>
                  </Box>
                </Grid>

              </Grid>
            </Grid>
          </Grid>
          {/* <Grid size={12}>
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
          </Grid> */}
          {/* <Grid size={12} sx={{ backgroundColor: 'white' }}>
            <Grid container>
              <Grid size={{ sm: 6, md: 4 }}>
                {player.clubs?.length > 0 && (
                  <Box>
                    <Typography fontWeight="bold"><BsHouse /> Clubs</Typography>
                    {player.clubs.map(club => (
                      <Typography key={club.id} variant="body2">
                        <a href={`/clubs/${club.slug}`}>{club.name}</a>
                      </Typography>
                    ))}
                  </Box>
                )}
                <Divider orientation='vertical' flexItem />
              </Grid>
            <Grid size={{ sm: 6, md: 4 }}>
              <PlayerLadders playerId={player.id} showWinLoss={true} showRating={true} />
            </Grid>
            </Grid>
          </Grid> */}
          {!isEdit &&
            <Grid size={12}>
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
            </Grid>
          }
          <Grid size={12}>
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
          </Grid>
        </Box>
      </CardContent>

    </Card >
  )
}

export default ProfileHeader