import { Card, CardContent, Typography, Button, Grid, CircularProgress } from "@mui/material"
import { playerAPI } from "api/services"
import { useState } from "react"
import { ProfileImage } from "../ProfileImage"
import { Link } from "react-router-dom"

const MergeProfiles = ({ mainPlayer, potentialMergers, ...props }) => {
  const [showLoader, setShowLoader] = useState(Array(potentialMergers.length).fill(false))
  const [showSuccess, setShowSuccess] = useState(Array(potentialMergers.length).fill(false))
  const [message, setMessage] = useState(Array(potentialMergers.length).fill(''))
  
  // console.log(showLoader)

  function mergePlayers(mergeId, mergeEmail, index) {
    // show the loader
    setShowLoader(prevState => {
      const newState = [...prevState]
      newState[index] = true
      return newState
    })
    //console.log('showloader', showLoader[index])

    // if email address ends with mytennis.space, merge right away
    if (mergeEmail.includes('@mytennis.space')) {
      playerAPI.mergePlayers(mainPlayer.id, mergeId).then(() => {
        // hide the loader
        setShowLoader(prevState => {
          const newState = [...prevState]
          newState[index] = false
          return newState
        })
        setMessage(setShowSuccess(prevState => {
          const newState = [...prevState]
          newState[index] = 'Successfully merged'
          return newState
        }))
        // show successfully merged message
        setShowSuccess(prevState => {
          const newState = [...prevState]
          newState[index] = true
          return newState
        })

        setShowLoader(prevState => {
          const newState = [...prevState]
          newState[index] = false
          return newState
        })
      })
    }
    else {
      // send merge email 
      playerAPI.initiateMerge(mainPlayer.id, mergeId)

      setShowLoader(prevState => {
        const newState = [...prevState]
        newState[index] = false
        return newState
      })
      
      setMessage(setShowSuccess(prevState => {
        const newState = [...prevState]
        newState[index] = 'An email has been sent to the player\'s email. Verify that it\s you, click the link in the email.'
        return newState
      }))
    }
  }

  return (
    <Grid container spacing={2}>
      {potentialMergers.map((player, index) => (
        <Grid item xs={12} sm={12} md={12} lg={12} key={index} minWidth={300}>
          <Card sx={{ backgroundColor: 'whitesmoke' }}>
            <CardContent>
              <div>
                <ProfileImage player={player} size={75}
                  className={`image`}
                />
                <Link to={"/profile/" + player.id}>
                  <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                  >
                    {player.name}
                  </Typography>
                </Link>
              </div>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Location: {player.location || 'N/A'}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Matches: {player.stats?.totals?.stats?.matches?.total || 0}
              </Typography>
              {showLoader[index] ? (
                <CircularProgress /> // Display loading spinner if showLoader is true
              ) : showSuccess[index] ? (
                <Typography variant="h5" color="#058d0c" gutterBottom>
                  {message[index]}
                </Typography>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => mergePlayers(player.id, player.email, index)}
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