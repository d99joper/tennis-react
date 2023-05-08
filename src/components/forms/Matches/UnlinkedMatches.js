import { Button, Grid, View } from "@aws-amplify/ui-react"
import { Box, Checkbox, Dialog, DialogTitle } from "@mui/material"
import { useState } from "react"
import { Match } from "../Match/Match"
import { matchFunctions } from "helpers"

const UnlinkedMatches = ({
  matches,
  player,
  handleMatchAdded,
  ...props
}) => {

  const [unLinkedMatches, setUnLinkedMatches] = useState(matches)
  const [showUnlinked, setShowUnlinked] = useState(false)

  function handleIgnoreLinkedMatches() {
    for (const match of unLinkedMatches) { 
    }
  }

  async function updateLinkedMatch(match, unlinkedPlayerId) {
    // check if it was a win or a loss
    const isWin = unlinkedPlayerId === match.winner.id ? true : false
      
    // update match to reflect the new player
    await matchFunctions.UpdateMatch({
      id: match.id, 
      winnerID: isWin ? player.id : match.winner.id,
      loserID: isWin ? match.loser.id : player.id,
      type: match.type,
      ladderID: match.ladder.id,
      playedOn: match.playedOn,
      score: match.score
    })

    // delete and recreate the player's playerMatch
    await matchFunctions.DeleteAndRecreatePlayerMatch(match.id, unlinkedPlayerId, player.id, match.type )

    // update the opponent's playerMatch
    await matchFunctions.UpdatePlayerMatchOpponent({
      playerID: isWin ? match.loser.id : match.winner.id, 
      opponentID: player.id, 
      matchID: match.id,
      matchType: match.type,
      playedOn: match.playedOn
    })
  }

  function handleLinkToProfile() {
    for (let x of unLinkedMatches) {
      if(x.checked) 
        updateLinkedMatch(x.match, x.playerID).then(() => {
          x.checked = false
          handleMatchAdded(x.match)
          let newMatches = unLinkedMatches
          newMatches[unLinkedMatches.findIndex(m => m.match.id === x.match.id)].checked = false
          setUnLinkedMatches(newMatches.filter(elem => elem.match.id !== x.match.id))
        })
    }
  }

  return (
    unLinkedMatches?.length > 0 &&
    <>
      <div>
        There are unlinked matches for a player with your name<br />
        <a className='cursorHand' onClick={() => setShowUnlinked(true)}>Click here to review</a>
      </div>
      <Dialog
        onClose={() => setShowUnlinked(false)}
        open={showUnlinked}
        aria-labelledby={`Unlinked matches`}
      >
        <DialogTitle>Link matches</DialogTitle>
        <Box padding={'1rem'}>
          <Grid templateRows={"auto"}>
            {unLinkedMatches?.map((m, i) => {
              return (
                <Grid templateColumns={"auto 1fr"} key={`unlinkedMatch_${i}`}>
                  <Checkbox onClick={() => {
                    let newMatches = unLinkedMatches
                    newMatches[i].checked = !unLinkedMatches[i].checked

                    setUnLinkedMatches(newMatches)
                  }} />
                  <Match match={m.match} backgroundColor={unLinkedMatches[i].checked ? 'white' : null} />
                </Grid>
              )
            })}
            <View>
              <Button variation='primary' onClick={handleLinkToProfile} >Link matches to my profile</Button>
              <Button variation='link' onClick={handleIgnoreLinkedMatches} >Ignore Selected</Button>
            </View>
          </Grid>
        </Box>
      </Dialog>
    </>
  )
}

export default UnlinkedMatches