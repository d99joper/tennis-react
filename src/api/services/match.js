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

  createMatch: async function (match) {
    const singleMatch = {
      winner: [
        { id: '21c841d6-bb21-4766-bf4f-b204cc53dde7' }
      ],
      loser: [
        { id: '4d2c332e-d5a1-4d35-8be8-3d9ee6407d0b' }
      ],
      ladder: { id: '35a52e5b-d915-4b84-a4e0-22f2906305a6' },
      score: '6-3, 6-7(4), 6-4',
      played_on: '2022-05-02',
      comments: [
        {
          message: 'Hello',
          posted_on: '2022-05-15'
        }
      ],
      retired: false,
      type: 'DOUBLES',
      ignored_by: [{ id: '21c841d6-bb21-4766-bf4f-b204cc53dde7' }],
    }
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer my-token'
      },
      body: JSON.stringify(
        {
          winner: [
            { id: '21c841d6-bb21-4766-bf4f-b204cc53dde7' },
            { id: 'bdc9391d-198e-4e78-aa9e-da65991e8686' }
          ],
          loser: [
            { id: 'e3415350-6350-4fdf-be1a-b6349dc48b7b' },
            { id: '4d2c332e-d5a1-4d35-8be8-3d9ee6407d0b' }
          ],
          ladder: { id: '35a52e5b-d915-4b84-a4e0-22f2906305a6' },
          score: '6-3, 6-7(4), 6-1',
          played_on: '2022-05-02',
          comments: [
            {
              message: 'Hello',
              posted_on: '2022-05-15'
            }
          ],
          retired: false,
          type: 'DOUBLES',
          ignored_by: [{ id: '21c841d6-bb21-4766-bf4f-b204cc53dde7' }],
        }
      )
    }

    const response = await fetch('https://mytennis-space.uw.r.appspot.com/matches/create', requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to create match' }
  },

  // Can't really see much of a use for this function. 
  // If a match has been misreported, it's probably for an admin to update/delete it
  updateMatch(match) {
    return { statusCode: 200, statusMessage: 'OK' }
  }
}


export default matchFunctions