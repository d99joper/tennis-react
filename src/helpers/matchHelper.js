import { helpers } from 'helpers'


const matchHelper = {
  canAddMatchToEvent: function (event) {
    return event.is_participant || event.is_admin;
  },
  canReportScheduledMatch: function(event, match, currentUser) {
    if(event.is_admin) return true;
    return match.player1.id === currentUser.id || match.player2.id === currentUser.id;
  }
}
function scoreToString(score, flipScore) {

  if (!flipScore) return score.filter(Boolean).join(', ')
  let flippedScore = []
  for (const set of score) {
    const games = set.split('-')
    // keep tiebreak score to the right side
    if (games[1].indexOf("(") > 0) {
      games[0] += games[1].substring(games[1].indexOf("("))
      games[1] = games[1].substring(0, games[1].indexOf("("))
    }

    flippedScore.push(games[1] + '-' + games[0])
  }
  return flippedScore.filter(Boolean).join(', ')
}

// function setPlayerMatchInput(match, matchID, flipScoreOnLoss, winner) {
//   const scoreBreakdown = parseScore(match.score, winner ? flipScoreOnLoss : !flipScoreOnLoss)
//   const playerMatchInput =
//   {
//     matchID: matchID,
//     playerID: winner ? match.winner.id : match.loser.id,
//     opponentID: winner ? match.loser.id : match.winner.id,
//     ladderID: match.ladderID,
//     playedOn: helpers.formatAWSDate(match.playedOn, 0),
//     matchType: match.type,
//     win: winner,
//     ...scoreBreakdown
//   }
//   //console.log(playerMatchInput)
//   return playerMatchInput
// }

function parseScore(score, flipScore) {

  let breakdown = {
    setsWon: 0,
    setsLost: 0,
    gamesWon: 0,
    gamesLost: 0,
    tiebreaksWon: 0,
    tiebreaksLost: 0
  }

  score.forEach((setScore) => {
    if (setScore) {
      const games = setScore.match(/\d+/g).map(Number);
      if (games[0] > games[1]) {
        breakdown.setsWon++
        if (games[0] > games[1] && Math.abs(games[0] - games[1]) === 1)
          breakdown.tiebreaksWon++
      }
      if (games[1] > games[0]) {
        breakdown.setsLost++
        if (games[1] > games[0] && Math.abs(games[1] - games[0]) === 1)
          breakdown.tiebreaksLost++
      }

      breakdown.gamesWon += games[0]
      breakdown.gamesLost += games[1]
    }
  })
  if (flipScore)
    breakdown = {
      setsWon: breakdown.setsLost,
      setsLost: breakdown.setsWon,
      gamesWon: breakdown.gamesLost,
      gamesLost: breakdown.gamesWon,
      tiebreaksWon: breakdown.tiebreaksLost,
      tiebreaksLost: breakdown.tiebreaksWon
    }

  return breakdown
}

function setMatchWinnerLoserScore(matches) {
  //console.log(matches)
  matches.map((m) => {
    // set the winner and loser objects
    m.winner = m.win ? m.player : m.opponent
    m.match.winner = m.win ? m.player : m.opponent
    m.loser = m.win ? m.opponent : m.player
    m.match.loser = m.win ? m.opponent : m.player
    m.match.ladder = m.ladder
    // flip the score if it's a loss
    if (!m.win) m.score = scoreToString(m.match.score.replace(/\s/g, '').split(','), true)
  })
  return matches
}

export default matchHelper;