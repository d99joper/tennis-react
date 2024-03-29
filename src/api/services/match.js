import { authAPI } from "."
import apiUrl from "config"

const matchesUrl = apiUrl+'matches/'

const matchAPI = {

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