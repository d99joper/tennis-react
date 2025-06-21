import React, { useEffect, useState } from 'react'
import { Box, Typography, Button, Card, CardContent, Grid2 as Grid, CircularProgress, LinearProgress, Tabs, Tab } from '@mui/material'
import { ProfileImage } from 'components/forms/ProfileImage'
import Matches from '../Matches/Matches'
import MyModal from 'components/layout/MyModal'
import { ladderAPI } from 'api/services'


const Ladder = ({ id }) => {
  const [showAddMatchModal, setShowAddMatchModal] = useState(false)
  const [ladder, setLadder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshIndex, setRefreshIndex] = useState(0)
  const [tabIndex, setTabIndex] = useState(0)

  const handleMatchAdded = () => {
    setShowAddMatchModal(false)
    setRefreshIndex((prev) => prev + 1)
  }

  useEffect(() => {
    ladderAPI.getLadder(id).then((data) => {
      console.log(data)
      setLadder(data)
      setLoading(false)
    })
  }, [id])

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue)
  }

  if (loading) return (<LinearProgress />)
  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
      <Typography variant='h4' gutterBottom>
        {ladder.name}
      </Typography>
      <Typography variant='body1' gutterBottom>
        {ladder.description}
      </Typography>



      <Card>
        <CardContent>
          <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
            <Tab label="Standings" />
            <Tab label="Matches" />
          </Tabs>
          {tabIndex === 0 &&
            <Grid container spacing={2} sx={{ pt: 2 }}>
              {ladder.standings.map((entry) => (
                <Grid key={entry.player.id} size={12}>
                  <Box display='flex' alignItems='center' gap={2}>
                    <Typography variant='h6'>{entry.ranking}.</Typography>
                    <ProfileImage player={entry.player} size={50} asLink showName />
                    <Typography variant='body1'>
                      {entry.wins} Wins
                    </Typography>
                    <Typography variant='body1'>
                      {entry.losses} Losses
                    </Typography>
                    <Box ml='auto' textAlign='right'>
                      <Typography variant='body2'>Rating: {entry.rating.toFixed(1)}</Typography>
                      <Typography variant='body2'>W-L: {entry.wins - entry.losses}</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          }
          {tabIndex === 1 &&
            <Box mt={4}>
              {/* <Box display='flex' justifyContent='flex-end' mb={2}>
                <Button variant='contained' color='primary' onClick={() => setShowAddMatchModal(true)}>
                  Add Match
                </Button>
              </Box> */}
              <Matches
                originId={ladder.id}
                originType='ladder'
                matchType={ladder.match_type}
                pageSize={10}
                refresh={refreshIndex}
                showAddMatch={false}
                showComments={true}
                callback={handleMatchAdded}
              />
            </Box>
          }
        </CardContent>
      </Card>



      <MyModal
        showHide={showAddMatchModal}
        onClose={() => setShowAddMatchModal(false)}
        title='Add Ladder Match'
      >
        <Matches
          originId={ladder.id}
          originType='ladder'
          matchType={ladder.match_type}
          editMode={true}
          callback={handleMatchAdded}
        />
      </MyModal>
    </Box>
  )
}

export { Ladder }