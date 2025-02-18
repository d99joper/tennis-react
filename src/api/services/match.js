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

  getMatches: async function(filter, page=1, pageSize=20, skip=0) {
    
    const requestOptions = authAPI.getRequestOptions('GET')
    const params = new URLSearchParams({page:page, 'page-size':pageSize, skip: skip, ...(filter ? filter : {})}) 
    // const url = apiUrl + 'matches/'
    //   + '?origin-type=' + originType
    //   + (originId ? '&origin-id=' + originId : '')
    //   + (matchType ? '&match-type=' + matchType : '')
    //   + (page ? '&page=' + page : '')
    //   + (pageSize ? '&page-size=' + pageSize : '')
    //   + (skip ? '&skip=' + skip : '')

    let response = await fetch(`${matchesUrl}?${params}`, requestOptions)

    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to get matches' }
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

  getMatchesForEvent: async function (eventId, page, numPerPage, sortDirection, sortOrder) {
    const requestOptions = authAPI.getRequestOptions('GET')
    const url = matchesUrl
      + '?event=' + eventId
      + (page ? '&page=' + page : '')
      + (numPerPage ? '&num-per-page=' + numPerPage : '')
      //+ (sortDirection ? '&sort=' + sortDirection : '')
      + (sortOrder ? '&sort=' + sortOrder : '')
      
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