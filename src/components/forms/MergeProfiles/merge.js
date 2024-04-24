import { Card, CardContent, Typography, Button, Grid, CircularProgress, Box } from "@mui/material"
import { playerAPI } from "api/services"
import { useState } from "react"
import { ProfileImage } from "../ProfileImage"
import { Link } from "react-router-dom"

const MergeProfiles = ({ mainPlayer, potentialMergers, ...props }) => {
  const [showLoader, setShowLoader] = useState(Array(potentialMergers.length).fill(false))
  const [showMessage, setShowMessage] = useState(Array(potentialMergers.length).fill(false))
  const [messageTitle, setMessageTitle] = useState(Array(potentialMergers.length).fill(''))
  const [messageText, setMessageText] = useState(Array(potentialMergers.length).fill(''))

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
        setMessageTitle(prevState => {
          const newState = [...prevState]
          newState[index] = 'Successfully merged'
          return newState
        })
        setMessageText(prevState => {
          const newState = [...prevState]
          newState[index] = ''
          return newState
        })
        // show successfully merged message
        setShowMessage(prevState => {
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
      playerAPI.initiateMerge(mainPlayer.id, mergeId).then(response => {
        setShowLoader(prevState => {
          const newState = [...prevState]
          newState[index] = false
          return newState
        })
        // show successfully merged message
        setShowMessage(prevState => {
          const newState = [...prevState]
          newState[index] = true
          return newState
        })
        let m_title = 'Error'
        let m_text = 'There was an error when trying to merge the accounts.'
        if (response.statusCode === 204) {
          m_title = 'Initiated'
          m_text = 'An email has been sent to the player\'s email. Verify that it\'s you, click the link in the email to complete the merge.'
        }
        setMessageTitle(prevState => {
          const newState = [...prevState]
          newState[index] = m_title
          return newState
        })
        setMessageText(prevState => {
          const newState = [...prevState]
          newState[index] = m_text
          return newState
        })
      })

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
              ) : showMessage[index] ? (
                <Box
                  backgroundColor={messageTitle == "Error" ? "#FFCCCC" : "#BBEEBB"}
                  border={1}
                  padding={1}
                >
                  <Typography variant="h5"
                    color={messageTitle == "Error" ? "#FF4444" : "#058d0c"}
                    gutterBottom
                  >
                    {messageTitle[index]}
                  </Typography>
                  <Typography variant="body1" color="#444" maxWidth={240} gutterBottom>
                    {messageText[index]}
                  </Typography>
                </Box>
              ) : player.merge_initiated === true
                ?
                <Box
                  backgroundColor={messageTitle == "Error" ? "#FFCCCC" : "#BBEEBB"}
                  border={1}
                  padding={1}
                >
                  Merger initiated. Check your email,<br/>
                  or, &nbsp;
                  <a 
                    onClick={() => mergePlayers(player.id, player.email, index)}
                    className="cursorHand"
                  >
                    resend email
                  </a>.
                </Box>
                :
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => mergePlayers(player.id, player.email, index)}
                  disabled={showLoader[index]}
                >
                  Merge
                </Button>
              }
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default MergeProfiles