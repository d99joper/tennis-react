import { enums } from "helpers"
import MatchFunctions from "helpers/matchFunctions"

const matchFunctions = {

  matchDummyData: {
    totalCount: 23,
    matches: [
      {
        id: '1',
        winner: [
          { id: '123', name: 'Travis Carter', verified: true },
          { id: '1262162a-9732-4222-8a93-c9925703c911', name: 'Jonas Persson', verified: true }
        ],
        loser: [
          { id: '4731b4c0-1938-439e-aa9b-28df1a2c78d1', name: 'Dwayne Vakatini', verified: true },
          { id: 'abc', name: 'Scott Voelker', verified: true }
        ],
        ladder: { id: '12be8efa-ea59-4ffd-ac67-96a1342b8dba', name: 'Test Ladder' },
        score: '6-3, 6-7(4), 6-4',
        playedOn: '2022-05-02',
        comments: [
          {
            id: '1',
            message: 'Hello',
            postedOn: '2022-05-15',
            postedBy: {
              id: '1262162a-9732-4222-8a93-c9925703c911', name: 'Jonas Persson'
            }
          }
        ],
        retired: false,
        createdBy: { id: '1262162a-9732-4222-8a93-c9925703c911', name: 'Jonas Persson' },
        type: 'DOUBLES',
        ignoredBy: [{ id: '1262162a-9732-4222-8a93-c9925703c911', name: 'Jonas Persson' }],
      },
      {
        id: '1',
        winner: [{ id: '1262162a-9732-4222-8a93-c9925703c911', name: 'Jonas Persson', verified: true }],
        loser: [{ id: '4731b4c0-1938-439e-aa9b-28df1a2c78d1', name: 'Dwayne Vakatini', verified: true }],
        ladder: { id: '12be8efa-ea59-4ffd-ac67-96a1342b8dba', name: 'Test Ladder' },
        score: '6-3, 6-7(4), 6-4',
        playedOn: '2022-05-02',
        comments: [
          {
            id: '1',
            message: 'Hello',
            postedOn: '2022-04-15',
            postedBy: {
              id: '1262162a-9732-4222-8a93-c9925703c911', name: 'Jonas Persson'
            }
          }
        ],
        retired: false,
        createdBy: { id: '1262162a-9732-4222-8a93-c9925703c911', name: 'Jonas Persson' },
        type: 'SINGLES',
        ignoredBy: [{ id: '1262162a-9732-4222-8a93-c9925703c911', name: 'Jonas Persson' }]
      },
      {
        id: '1',
        winner: [{ id: '4731b4c0-1938-439e-aa9b-28df1a2c78d1', name: 'Dwayne Vakatini', verified: true }],
        loser: [{ id: 'abc', name: 'Scott Voelker', verified: false }],
        ladder: { id: '12be8efa-ea59-4ffd-ac67-96a1342b8dba', name: 'Test Ladder' },
        score: '6-3, 6-1',
        playedOn: '2022-05-22',
        comments: [
          {
            id: '1',
            message: 'Hello',
            postedOn: '2022-05-15',
            postedBy: {
              id: '1262162a-9732-4222-8a93-c9925703c911', name: 'Jonas Persson'
            }
          }
        ],
        retired: false,
        createdBy: { id: '1262162a-9732-4222-8a93-c9925703c911', name: 'Jonas Persson' },
        type: 'SINGLES',
        ignoredBy: [{ id: '1262162a-9732-4222-8a93-c9925703c911', name: 'Jonas Persson' }]
      }
    ]
  },

  getMatch: async function (id) {
    return this.matchDummyData.matches.find((x) => x.id === id)
  },

  getMatchesForPlayer: async function (playerId, type, limit, page, sortDirection, sortOrder) {
    const matches = this.matchDummyData.matches
      .sort((a, b) => new Date(b.playedOn) - new Date(a.playedOn))
      .filter((x) => {
        return x.type === type &&
          (x.loser.find((z) => z.id === playerId) ||
            x.winner.find(z => z.id === playerId)
          )
      })
      // map the resulting matches to add a win attribute depending on if the player won or lost the match
      .map((match) => {
        const isWinner = match.winner.find((p) => p.id === playerId)
        match.win = isWinner ? true : false
        return match
      })
    matches.totalPages = Math.ceil(this.matchDummyData.totalCount / limit)
    return matches
  },

  getMatchesForLadder: async function (ladderId, limit, page, sortDirection, sortOrder) {
    const matches = this.matchDummyData.matches
      .sort((a, b) => new Date(b.playedOn) - new Date(a.playedOn))
      .filter((x) => {
        return x.ladder.id === ladderId
      })
    matches.totalPages = Math.ceil(this.matchDummyData.totalCount / limit)
    return matches
  },

  createMatch(match) {
    // let testData = {
    //   winner: [{ id: '1262162a-9732-4222-8a93-c9925703c911', name: 'Jonas Persson', verified: true }],
    //   loser: [{ id: '4731b4c0-1938-439e-aa9b-28df1a2c78d1', name: 'Dwayne Vakatini', verified: true }],
    //   score: '6-3, 6-4',
    //   type: enums.MATCH_TYPE.SINGLES,
    //   playedOn: new Date('2023-11-01'),
    //   ladder: { id: '12be8efa-ea59-4ffd-ac67-96a1342b8dba' },
    //   retired: false
    // }
    // calculate new ladder standings based on match
    // ladderFunctions.updateStandings(match)
    
    // flatten the score 
    //match.score = match.score.filter(Boolean).join(', ')
    
    let response = this.matchDummyData.matches.push(match) //(testData)
    response = { statusCode: 200, statusMessage: 'OK' }
    
    return response
  },

  // Can't really see much of a use for this function. 
  // If a match has been misreported, it's probably for an admin to update/delete it
  updateMatch(match) {
    return { statusCode: 200, statusMessage: 'OK' }
  }
}


export default matchFunctions