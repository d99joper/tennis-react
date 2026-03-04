// Profile.js
import React, { useState, useEffect, useContext, useMemo } from 'react'
import { Box, LinearProgress, Typography, Modal, Card, Tab, CardContent, Tabs, CircularProgress, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { useParams, useSearchParams } from 'react-router-dom'
import { playerAPI } from 'api/services'
import { AuthContext } from 'contexts/AuthContext'
import { ProfileImageContext } from 'components/forms/ProfileImage'
import ProfileHeader from './profileHeader'
import EventSection from './eventSection'
import { enums, helpers } from 'helpers'
import { Helmet } from 'react-helmet-async'
import { Matches, TopRivals, UserStats } from 'components/forms'
import { BsHouse } from 'react-icons/bs'
import SeoHelmet from 'components/seoHelmet'

const Profile = () => {
  const { userid } = useParams()
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [stats, setStats] = useState({})
  const [statsFetched, setStatsFetched] = useState(false);
  const [rivals, setRivals] = useState({})
  const [rivalsFetched, setRivalsFetched] = useState(false);
  const [rivalsLoading, setRivalsLoading] = useState(false);
  const [rivalsPlayerId, setRivalsPlayerId] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Tab name mappings
  const tabNameToIndex = useMemo(() => ({
    'events': 0,
    'matches': 1,
    'stats': 2,
    'rivals': 3,
  }), []);

  const indexToTabName = useMemo(() => ({
    0: 'events',
    1: 'matches',
    2: 'stats',
    3: 'rivals',
  }), []);

  const matchTabNameToIndex = useMemo(() => ({
    'singles': 0,
    'doubles': 1,
  }), []);

  const indexToMatchTabName = useMemo(() => ({
    0: 'singles',
    1: 'doubles',
  }), []);

  // Derive tabs from URL parameters
  const tabParam = searchParams.get('tab') || 'events';
  const tabIndex = tabNameToIndex[tabParam] ?? 0;
  
  const matchTabParam = searchParams.get('matchTab') || 'singles';
  const matchTabIndex = matchTabNameToIndex[matchTabParam] ?? 0;

  // Match filter: all | event | friendly
  const matchFilterParam = searchParams.get('matchFilter') || 'all';
  const matchFilter = ['all', 'event', 'friendly'].includes(matchFilterParam) ? matchFilterParam : 'all';

  const handleMatchFilterChange = (_, newFilter) => {
    if (!newFilter) return; // prevent deselect
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newFilter === 'all') {
        next.delete('matchFilter');
      } else {
        next.set('matchFilter', newFilter);
      }
      return next;
    }, { replace: true });
  };

  useEffect(() => {
    async function fetchProfile() {
      setRivals({})
      setRivalsFetched(false)
      setRivalsPlayerId(null)
      setStatsFetched(false)
      setStats({})
      try {
        const id = userid || user?.id
        if (!id) throw new Error('No user ID found.')

        const fetchedPlayer = await playerAPI.getPlayer(id)
        setPlayer(fetchedPlayer)
        setStats(fetchedPlayer.stats)
        setStatsFetched(true)
        setIsLoaded(true)
        fetchAwards(fetchedPlayer.id)

        if (!userIsLoading && isLoggedIn && user?.id === fetchedPlayer.id) {
          setCanEdit(true)
          setShowUtrRefresh(true)
        } else {
          setCanEdit(false)
          setShowUtrRefresh(false)
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

  const handleRivalsClick = () => {
    if (!rivalsFetched) {
      setRivalsLoading(true)
      // userHelper.getGreatestRivals(player.id)
      playerAPI.getGreatestRivals([player.id], enums.MATCH_TYPE.SINGLES)
        //playerFunctions.getGreatestRivals([player.id,'abc'], enums.MATCH_TYPE.DOUBLES)
        .then((data) => {
          setRivals(data)
          setRivalsPlayerId(player.id)
          setRivalsFetched(true)
          setRivalsLoading(false)
        })
        .catch((error) => {
          console.error('Failed to fetch rivals:', error)
          setRivalsPlayerId(player.id)
          setRivalsLoading(false)
          setRivalsFetched(true) // Set to true to prevent infinite retry
        })
    }
  }

  // Fetch rivals when on Rivals tab and player changes
  useEffect(() => {
    console.log('Rivals useEffect:', { tabIndex, playerId: player?.id, rivalsFetched, rivalsPlayerId })
    if (tabIndex === 3 && player && rivalsPlayerId !== player.id) {
      console.log('Fetching rivals for player:', player.id)
      setRivalsLoading(true)
      playerAPI.getGreatestRivals([player.id], enums.MATCH_TYPE.SINGLES)
        .then((data) => {
          console.log('Rivals data received:', data)
          setRivals(data)
          setRivalsPlayerId(player.id)
          setRivalsFetched(true)
          setRivalsLoading(false)
        })
        .catch((error) => {
          console.error('Failed to fetch rivals:', error)
          setRivalsPlayerId(player.id)
          setRivalsLoading(false)
          setRivalsFetched(true) // Set to true to prevent infinite retry
        })
    }
  }, [tabIndex, player, rivalsPlayerId, rivalsFetched])

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
  const handleUTRImported = () => {
    // update the refresh index to force a re-render of matches
    const newRefresh = refreshIndex + 1;
    setRefreshIndex(newRefresh);
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

  const handleTabChange = (event, newValue) => {
    const tabName = indexToTabName[newValue];
    if (tabName) {
      const newParams = { tab: tabName };
      // Preserve matchTab parameter if on matches tab
      if (newValue === 1) {
        newParams.matchTab = searchParams.get('matchTab') || 'singles';
      }
      setSearchParams(newParams, { replace: true });
    }
  }

  if (!isLoaded) return <LinearProgress />
  if (!player) return <Typography>Error loading player profile</Typography>

  return (
    <Box
      sx={{
        px: 2,
        py: 1,
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start'
      }}
    >
      <Helmet>
        <title>{player?.name} | MyTennis Space</title>
      </Helmet>
      <SeoHelmet
        title={`${player?.name} | My Tennis Space`}
        description={player?.bio || `View the profile of ${player?.name} on My Tennis Space.`}
        url={`https://mytennis.space/player/${player?.id}`}
      />
      <Box sx={{ width: '100%', maxWidth: 900 }}>
        <ProfileHeader
          key={userid || user?.id}
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

        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>

            {player.clubs?.length > 0 && (
              <Box>
                <Typography variant='subtitle1'><BsHouse /> Clubs</Typography>
                {player.clubs.length === 0
                  ?
                  <Typography sx={{pl:1}}>
                    You are not a member of any clubs. <br/>
                    Clubs arrange leagues and tournaments that you can play in. <br/>
                    Find a club near you today:  <a href={`/clubs`}>Club search page</a>
                  </Typography>
                  :
                  <Typography variant="body1">
                    {player.clubs.map((club, index) => (
                      <span key={club.id}>
                        <a href={`/clubs/${club.slug}`}>{club.name}</a>
                        {index < player.clubs.length - 1 && ', '}
                      </span>
                    ))}
                  </Typography>
                }
              </Box>
            )}
          </CardContent>
        </Card>

        <Card variant="outlined">
          <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
            <Tab label="Events" />
            <Tab label="Matches" />
            <Tab label="Stats" />
            <Tab label="Rivals" onClick={handleRivalsClick} />
          </Tabs>
          <CardContent>
            {tabIndex === 0 &&
              <EventSection key={player.id} player={player} />
            }
            {tabIndex === 1 &&
              <Box sx={{ padding: { xs: 1, sm: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Tabs
                    value={matchTabIndex}
                    onChange={(e, newValue) => {
                      const matchTabName = indexToMatchTabName[newValue];
                      if (matchTabName) {
                        setSearchParams({ tab: 'matches', matchTab: matchTabName }, { replace: true });
                      }
                    }}
                  >
                    <Tab label="Singles" />
                    <Tab label="Doubles" />
                  </Tabs>
                  <ToggleButtonGroup
                    value={matchFilter}
                    exclusive
                    onChange={handleMatchFilterChange}
                    size="small"
                  >
                    <ToggleButton value="all">All</ToggleButton>
                    <ToggleButton value="event">Events</ToggleButton>
                    <ToggleButton value="friendly">Friendly</ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                {matchTabIndex === 0 && (
                  <Matches
                    key={`singles-${player.id}-${matchFilter}`}
                    originId={player.id}
                    originType={'player'}
                    matchType={'singles'}
                    matchFilter={matchFilter}
                    pageSize={10}
                    refresh={refreshIndex}
                    showAddMatch={true}
                    showComments={true}
                    showH2H={true}
                    callback={(matchdata) => { console.log('new match to profile', matchdata) }}
                  />
                )}
                {matchTabIndex === 1 && (
                  <Matches
                    key={`doubles-${player.id}-${matchFilter}`}
                    originId={player.id}
                    originType={'player'}
                    matchType={'doubles'}
                    matchFilter={matchFilter}
                    pageSize={10}
                    showAddMatch={true}
                    showComments={true}
                    showH2H={true}
                  />
                )}
              </Box>
            }
            {tabIndex === 2 &&
              <UserStats key={player.id} stats={stats} statsFetched={statsFetched} />
            }
            {tabIndex === 3 &&
              (rivalsLoading || rivalsPlayerId !== player.id ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4, flexDirection: 'column', gap: 2 }}>
                  <CircularProgress />
                  <Typography>Loading rivals...</Typography>
                </Box>
              ) : (
                <TopRivals key={player.id} data={rivals} rivalsFetched={rivalsFetched} player={player} paddingTop={10} />
              ))
            }
          </CardContent>
        </Card>
      </Box>

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

export default Profile
