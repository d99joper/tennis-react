import { authAPI } from "."
import apiUrl from "config"

const laddersUrl = apiUrl+'ladders/'

const ladderAPI = {

  /* API calls */
  getLadder: async function (id) {
    const requestOptions = authAPI.getRequestOptions('GET')

    const response = await fetch(laddersUrl + id, requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to get ladder' }
  },

  getLadders: async function (filter) {
    const requestOptions = authAPI.getRequestOptions('GET')
    const queryString = parseFilter(filter)
    const response = await fetch(laddersUrl + queryString, requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to get ladders' }
  },

  createLadder: async function (ladder) {
    const requestOptions = authAPI.getRequestOptions('POST', ladder)

    const response = await fetch(laddersUrl + 'create', requestOptions)
    if (response.ok)
      return await response.json()
    else
      throw new Error(response.status + ': Failed to create ladder')
  },

  // partial ladder as input. Only provided fields get updated
  updateLadder: async function (ladder) {
    const requestOptions = authAPI.getRequestOptions('PATCH', ladder)

    const response = await fetch(laddersUrl + 'update', requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to update ladder' }
  },

  addPlayerToLadder: async function (playerId, ladderId) {
    const requestOptions = authAPI.getRequestOptions('POST', { player_id: playerId })

    const response = await fetch(laddersUrl + ladderId + '/add-player', requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to add player to ladder.' }
  },
}

function parseFilter(filter) {
  let queryString

  queryString = filter.map((x) => {
    switch (x.name.toLowerCase()) {
      case 'geo':
        return `${x.name}=${x.point.lat},${x.point.lng},${x.radius}&`
      case 'match_type':
        return `${x.name}=${x.matchType}&`
      case 'level':
        return `${x.name}_min=${x.level_min}&${x.name}_max=${x.level_max}&`
      default:
        break
    }
  })
  return queryString ? '?' + queryString.join('') : ''


}

export default ladderAPI