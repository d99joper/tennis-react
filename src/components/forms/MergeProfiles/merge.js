import { Card, CardContent, Typography, Button, Grid, CircularProgress } from "@mui/material"
import { playerAPI } from "api/services"
import { useState } from "react"

const MergeProfiles = ({ mainPlayer, potentialMergers, ...props }) => {
  const [showLoader, setShowLoader] = useState(Array(potentialMergers.length).fill(false))
  const [showSuccess, setShowSuccess] = useState(Array(potentialMergers.length).fill(false))
console.log(showLoader)
  function mergePlayers(mergeId, index) {
    // show the loader
    setShowLoader(prevState => {
      const newState = [...prevState]
      newState[index] = true
      return newState
    })
    console.log('showloader', showLoader[index])

    playerAPI.mergePlayers(mainPlayer.id, mergeId).then(() => {
      // hide the loader
      setShowLoader(prevState => {
        const newState = [...prevState]
        newState[index] = false
        return newState
      })
      // show successfully merged message
      setShowSuccess(prevState => {
        const newState = [...prevState]
        newState[index] = true
        return newState
      })
    })
  }

  return (
    <Grid container spacing={2}>
      {potentialMergers.map((player, index) => (
        <Grid item xs={12} sm={12} md={12} lg={12} key={index}>
          <Card sx={{ backgroundColor: 'whitesmoke' }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {player.name}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Location: {player.location}
              </Typography>
              {showLoader[index] ? (
                <CircularProgress /> // Display loading spinner if showLoader is true
              ) : showSuccess[index] ? (
                <Typography variant="h5" color="#058d0c" gutterBottom>
                  Successfully merged
                </Typography>
              ) : (
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  onClick={() => mergePlayers(player.id, index)}
                  disabled={showLoader[index]}
                >
                  Merge
                </Button>
              )
              }
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default MergeProfiles