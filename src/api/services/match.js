import { fetchWithRetry } from "api/fetchWithRetry"
import { authAPI } from "."
import apiUrl from "config"

const matchesUrl = apiUrl + 'matches/'

const matchAPI = {

  getMatch: async function (id) {
    const requestOptions = authAPI.getRequestOptions('GET')
    let response = await fetchWithRetry(matchesUrl + id, requestOptions)

    if (response.ok) {
      return await response.json()
    }
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to get match' }
  },

  getMatches: async function (filter, page = 1, pageSize = 20, skip = 0) {

    const requestOptions = authAPI.getRequestOptions('GET')
    const params = new URLSearchParams({ page: page, 'page-size': pageSize, skip: skip, ...(filter ? filter : {}) })

    let response = await fetchWithRetry(`${matchesUrl}?${params}`, requestOptions)

    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to get matches' }
  },

  createMatchesFromArray: async function(matches) {
    const requestOptions = authAPI.getRequestOptions('POST', matches)

    let response = await fetchWithRetry(matchesUrl + 'import/bulk', requestOptions)
    
    if (response.ok) {
      return response
    }
    else throw new Error()
  },

  importFromUTR: async function (utr_id) {
    const requestOptions = authAPI.getRequestOptions('GET')
    let response = await fetchWithRetry(matchesUrl + 'import/utr/' + utr_id, requestOptions)

    if (response.ok) {
      const response = await response.json()
      return response //just a 203 status and a success text
    }
    else
      return { status: response.status, statusCode: response.statusCode, statusText: response.statusText, error: 'Failed to get utr matches' }
  },

  getMatchesForPlayer: async function (playerId, type, page, numPerPage, sortDirection, sortOrder) {
    const requestOptions = authAPI.getRequestOptions('GET')
    const url = matchesUrl
      + '?player=' + playerId
      + (type ? '&match-type=' + type : '')
      + (page ? '&page=' + page : '')
      + (numPerPage ? '&num-per-page=' + numPerPage : '')

    let response = await fetchWithRetry(url, requestOptions)

    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to get matches' }
  },

  getMatchesForEvent: async function (eventId, page, numPerPage, sortDirection, sortOrder) {
    const requestOptions = authAPI.getRequestOptions('GET')
    const url = matchesUrl
      + '?event=' + eventId
      + (page ? '&page=' + page : '')
      + (numPerPage ? '&num-per-page=' + numPerPage : '')
      //+ (sortDirection ? '&sort=' + sortDirection : '')
      + (sortOrder ? '&sort=' + sortOrder : '')

    let response = await fetchWithRetry(url, requestOptions)

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

    let response = await fetchWithRetry(matchesUrl + '?ladder=' + ladderId, requestOptions)

    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to get matches' }
  },

  createMatch: async function (match) {
    const requestOptions = authAPI.getRequestOptions('POST', match)

    const response = await fetchWithRetry(matchesUrl + 'create', requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to create match' }
  },

  updateMatch: async function (match) {
    const requestOptions = authAPI.getRequestOptions('PATCH', match)

    const response = await fetchWithRetry(matchesUrl + 'update', requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to create match' }
  }
}


export default matchAPI