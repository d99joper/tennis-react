import { Button, Grid, View } from "@aws-amplify/ui-react"
import { Box, Checkbox, Dialog, DialogTitle } from "@mui/material"
import { useState } from "react"
import { Match } from "../Match/Match"
import { matchFunctions, userFunctions } from "helpers"

const UnlinkedMatches = ({
  matches,
  player,
  handleMatchAdded,
  ...props
}) => {

  const [unLinkedMatches, setUnLinkedMatches] = useState(matches)
  const [showUnlinked, setShowUnlinked] = useState(false)

  async function ignoreMatch() {
    let oldPlayerId, matchlist = []
    for (let x of unLinkedMatches) {
      if (x.checked) {
        // Add user to ignore list
        const retVal = await matchFunctions.ignorePlayerMatch({ matchID: x.match.id, playerID: x.playerID }, player.id)
        if (retVal) // add the match to the match list
          matchlist.push(x.match.id)
      }
    }
    return { matchlist: matchlist, oldPlayerId: oldPlayerId }
  }
  function handleIgnoreLinkedMatches() {
    ignoreMatch().then((data) => {
      updateMatchList(data.matchlist, data.oldPlayerId)
    })
  }

  async function updateLinkedMatches() {
    let oldPlayerId, matchlist = []

    for (let x of unLinkedMatches) {
      oldPlayerId = x.playerID
      if (x.checked) {
        const match = x.match
        // check if it was a win or a loss
        const isWin = oldPlayerId === match.winner.id ? true : false

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
        await matchFunctions.DeleteAndRecreatePlayerMatch(match.id, oldPlayerId, player.id, match.type)

        // update the opponent's playerMatch
        await matchFunctions.UpdatePlayerMatchOpponent({
          playerID: isWin ? match.loser.id : match.winner.id,
          opponentID: player.id,
          matchID: match.id,
          matchType: match.type,
          playedOn: match.playedOn
        })

        // add the match to the match list
        matchlist.push(x.match.id)
      }
    }
    return { matchlist: matchlist, oldPlayerId: oldPlayerId }
  }
  function handleLinkToProfile() {

    updateLinkedMatches().then((data) => {
      updateMatchList(data.matchlist, data.oldPlayerId)
    })
  }

  function updateMatchList(matchlist, oldPlayerId) {
    // set all checkboxes to false
    let newMatches = unLinkedMatches.map((x) => {
      x.checked = false
      return x
    })
      // filter out the processed matches
      .filter(elem => !matchlist.includes(elem.match.id))
    // set the new value
    setUnLinkedMatches(newMatches)

    // call the parent function for adding the matches
    handleMatchAdded()

    // if there are no more matches, update the old user profile
    if (newMatches.length === 0) {
      userFunctions.deletePlayer(oldPlayerId)
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
            {unLinkedMatches?.map((x, i) => {
              if (!x.checked) x.checked = false
              return (
                <Grid templateColumns={"auto 1fr"} key={`unlinkedMatch_${i}`}>
                  <Checkbox
                    checked={x.checked}
                    //value={x.checked}
                    onClick={() => {
                      let newMatches = [...unLinkedMatches]
                      newMatches[i].checked = !x.checked
                      setUnLinkedMatches(newMatches)
                    }}
                  />
                  <Match match={x.match} />
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