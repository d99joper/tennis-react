import { helpers } from "helpers"
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
    const url = new URL(laddersUrl)
    if(filter)
      url.search = helpers.parseFilter(filter)
    //console.log(url.search)
    const requestOptions = authAPI.getRequestOptions('GET')
    //const queryString = helpers.parseFilter(filter)
    const response = await fetch(url, requestOptions)//(laddersUrl + queryString, requestOptions)
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


export default ladderAPI