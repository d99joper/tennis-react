import { enums } from "helpers"
import matchHelper from "helpers/matchHelper"
import { authAPI } from "."

const matchesUrl = 'https://mytennis-space.uw.r.appspot.com/matches/'

const matchAPI = {

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
    const requestOptions = authAPI.getRequestOptions('GET')
    let response = await fetch(matchesUrl + id, requestOptions)

    if (response.ok) {
      return await response.json()
    }
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to get match' }
  },

  getMatchesForPlayer: async function (playerId, type, page, numPerPage, sortDirection, sortOrder) {
    const requestOptions = authAPI.getRequestOptions('GET')
    const url = matchesUrl
      + '?player=' + playerId
      + (type ? '&match-type=' + type : '')
      + (page ? '&page=' + page : '')
      + (numPerPage ? '&num-per-page=' + numPerPage : '')

    let response = await fetch(url, requestOptions)

    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to get matches' }
  },

  getMatchesForLadder: async function (ladderId, type, page, numPerPage, sortDirection, sortOrder) {
    const requestOptions = authAPI.getRequestOptions('GET')
    const url = matchesUrl
      + '?ladder=' + ladderId
      + (type ? '&match-type=' + type : '')
      + (page ? '&page=' + page : '')
      + (numPerPage ? '&num-per-page=' + numPerPage : '')

    let response = await fetch(matchesUrl + '?ladder=' + ladderId, requestOptions)

    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to get matches' }
  },

  createMatch: async function (match) {
    const requestOptions = authAPI.getRequestOptions('POST', match)
    
    const response = await fetch(matchesUrl + 'create', requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to create match' }
  },

  updateMatch: async function (match) {
    const requestOptions = authAPI.getRequestOptions('PATCH', match)

    const response = await fetch(matchesUrl + 'update', requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to create match' }
  }
}


export default matchAPI